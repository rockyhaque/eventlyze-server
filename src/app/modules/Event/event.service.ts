import { Event, Prisma } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { eventSearchAbleFields } from "./event.constant";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


const createEvent = async (data: Event, user: JwtPayload) => {

  const email = user?.email;
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!existingUser) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  const result = await prisma.$transaction(async (transactionClient: Prisma.TransactionClient) => {

    // Event Create function
    const event = await transactionClient.event.create({
      data: {
        ...data,
        ownerId: existingUser.id,
      },
    });

    // Botification Created function
    await transactionClient.notification.create({
      data: {
        userId: existingUser?.id,
        eventId: event?.id,
        message: `New ${event?.title} event created by ${email}`
      }
    });

    return event;
  });

  return result;
};



// const parseBoolean = (value: string | undefined): boolean | undefined => {
//   if (value === "true") return true;
//   if (value === "false") return false;
//   return undefined;
// };

const getAllEvents = async (params: any, options: any) => {
  // console.log(options)
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.EventWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: eventSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
  }

  //   For spesific field filter
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        let value = (filterData as any)[key];

        if (value === "true") value = true;
        if (value === "false") value = false;

        if (typeof value === "boolean") {
          return { [key]: value };
        } else {
          return { [key]: { equals: value } };
        }
      }),
    });
  }

  const whereConditions: Prisma.EventWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  console.dir(whereConditions, { depth: null });

  const result = await prisma.Event.findMany({
    where: whereConditions,
    include: {
      participant: true,
      review: true,
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
          [options.sortBy]: options.sortOrder,
        }
        : {
          createdAt: "desc",
        },
  });

  const total = await prisma.Event.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getEventById = async (id: string) => {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      participant: true,
      review: true,
    },
  });
  return event;
};

const updateSingleEvent = async (id: string, data: Partial<Event>) => {
  console.log(data)
  const event = await prisma.event.update({
    where: { id },
    data,
    include: {
      participant: true,
      review: true,
    }
  });
  // console.log(event)
  return event;
};

const deleteSingleEvent = async (id: string) => {
  const event = await prisma.event.delete({
    where: { id },
  });
  return event;
};

export const eventService = {
  createEvent,
  getAllEvents,
  getEventById,
  updateSingleEvent,
  deleteSingleEvent,
};
