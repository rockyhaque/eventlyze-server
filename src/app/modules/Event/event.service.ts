import {
  Event,
  EventCategory,
  EventStatus,
  Prisma,
  UserRole,
} from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { isBefore, isWithinInterval } from "date-fns";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { eventFilterableFields, eventSearchAbleFields } from "./event.constant";
import { TAuthUser } from "../../interfaces/common";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createEvent = async (data: Event, user: JwtPayload) => {
  const email = user?.email;
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!existingUser) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const now = new Date();

  // Use date-fns to determine status
  let status: EventStatus;
  if (isBefore(data.eventEndTime, now)) {
    status = EventStatus.COMPLETED;
  } else if (
    isWithinInterval(now, {
      start: data.eventStartTime,
      end: data.eventEndTime,
    })
  ) {
    status = EventStatus.ONGOING;
  } else {
    status = EventStatus.UPCOMING;
  }

  // Destructure to ignore status from incoming data
  const { status: _ignoredStatus, ...restData } = data;

  const result = await prisma.$transaction(
    async (transactionClient: Prisma.TransactionClient) => {
      const event = await transactionClient.event.create({
        data: {
          ...restData,
          ownerId: existingUser.id,
          status,
        },
      });

      await transactionClient.notification.create({
        data: {
          userId: existingUser.id,
          eventId: event.id,
          message: `New ${event.title} event created by ${email}`,
        },
      });

      return event;
    }
  );

  return result;
};

const getAllEvents = async (params: any, options: any) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...restParams } = params;

  const andConditions: Prisma.EventWhereInput[] = [];

  // Search logic
  if (searchTerm) {
    andConditions.push({
      OR: eventSearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // Filter logic
  const filterData: any = {};
  for (const key of eventFilterableFields) {
    if (key in restParams) {
      let value = restParams[key];

      if (value === "true") value = true;
      if (value === "false") value = false;
      if (["price", "seat"].includes(key)) value = Number(value);

      filterData[key] = value;
    }
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([key, value]) => ({
        [key]: { equals: value },
      })),
    });
  }

  const whereConditions: Prisma.EventWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.event.findMany({
    where: whereConditions,
    include: {
      participant: true,
      review: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              photo: true,
            },
          },
        },
      },
      owner: {
        select: {
          name: true,
          email: true,
          photo: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
  });

  const total = await prisma.event.count({ where: whereConditions });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

const getEventById = async (id: string) => {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      participant: true,
      review: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              photo: true,
            },
          },
        },
      },
      owner: {
        select: {
          name: true,
          email: true,
          photo: true,
        },
      },
    },
  });

  if (!event) {
    throw new AppError(StatusCodes.NOT_FOUND, "Event not found");
  }

  const relatedEvents = await prisma.event.findMany({
    where: {
      category: event.category,
      NOT: { id },
    },
  });

  if (!relatedEvents || relatedEvents.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, "Related Category not found");
  }

  return { event, relatedEvents };
};

// Role based get events
const myCreatedEvents = async (user: TAuthUser) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: user?.email,
    },
  });

  if (!userData) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  let events;

  if (
    userData.role === UserRole.ADMIN ||
    userData.role === UserRole.SUPER_ADMIN
  ) {
    // Admins see all events
    events = await prisma.event.findMany({
      include: {
        participant: true,
        review: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                photo: true,
              },
            },
          },
        },
        owner: {
          select: {
            name: true,
            email: true,
            photo: true,
          },
        },
      },
    });
  } else if (userData.role === UserRole.USER) {
    // Regular users see only their own events
    events = await prisma.event.findMany({
      where: {
        ownerId: userData.id,
      },
      include: {
        participant: true,
        review: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                photo: true,
              },
            },
          },
        },
        owner: {
          select: {
            name: true,
            email: true,
            photo: true,
          },
        },
      },
    });
  } else {
    throw new AppError(StatusCodes.FORBIDDEN, "Unauthorized access");
  }

  if (!events || events.length === 0) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      userData.role === UserRole.USER
        ? "No events created by this user"
        : "No event found"
    );
  }

  return events;
};

const getEventCategoryCount = async () => {
  // Fetch all events and their categories
  const events = await prisma.event.findMany({
    select: {
      category: true,
    },
  });

  // Initialize all categories with 0
  const categoryCounts: Record<string, number> = {};
  for (const category of Object.values(EventCategory)) {
    categoryCounts[category] = 0;
  }

  // Count how many events belong to each category
  events.forEach((event: any) => {
    categoryCounts[event.category]++;
  });

  return categoryCounts;
};

const updateSingleEvent = async (id: string, data: Partial<Event>) => {
  const event = await prisma.event.update({
    where: { id },
    data,
    include: {
      participant: true,
      review: true,
    },
  });
  // console.log(event)
  return event;
};

const deleteSingleEvent = async (id: string) => {
  const eventData = await prisma.event.findUnique({
    where: {
      id,
    },
  });

  if (!eventData) {
    throw new AppError(StatusCodes.NOT_FOUND, "Event not found");
  }

  // await prisma.notification.deleteMany({
  //   where: {
  //     eventId: eventData.id,
  //   },
  // });

  const event = await prisma.event.delete({
    where: { id },
  });

  return event;
};

const bannedEvent = async (id: string) => {
  const eventData = await prisma.event.findUnique({
    where: {
      id,
    },
  });

  if (!eventData) {
    throw new AppError(StatusCodes.NOT_FOUND, "Event Not Found");
  }

  const bannedEvent = await prisma.event.update({
    where: {
      id: eventData.id,
    },
    data: {
      status: EventStatus.BANNED,
    },
  });

  return bannedEvent;
};

export const eventService = {
  createEvent,
  getAllEvents,
  getEventById,
  myCreatedEvents,
  getEventCategoryCount,
  updateSingleEvent,
  deleteSingleEvent,
  bannedEvent,
};
