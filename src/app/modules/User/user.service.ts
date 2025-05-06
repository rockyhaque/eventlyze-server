import { Request } from "express";
import bcrypt from "bcryptjs";
import { Prisma, User, UserRole, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { safeUserSelect, userSearchAbleFields } from "./user.constant";
import { TAuthUser } from "../../interfaces/common";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";

type TSafeUser = Omit<User, "password">;

const createUser = async (req: Request): Promise<TSafeUser> => {
  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);
  const userData = {
    email: req.body.email,
    password: hashedPassword,
    role: UserRole.USER,
    photo: req.body.photo,
    name: req.body.name,
    contactNumber: req.body.contactNumber,
    gender: req.body.gender,
  };

  const existingUser = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });

  if (existingUser) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "Email already exists. Please use another email."
    );
  }

  const createdUserData = await prisma.user.create({
    data: userData,
    select: safeUserSelect,
  });

  return createdUserData;
};

const createAdmin = async (req: Request): Promise<TSafeUser> => {
  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);
  const userData = {
    email: req.body.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
    photo: req.body.photo,
  };

  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });

  if (existingAdmin) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "Email already exists. Please use another email."
    );
  }

  const createdAdminData = await prisma.user.create({
    data: userData,
    select: safeUserSelect,
  });

  return createdAdminData;
};

const getUserStats = async (user: any) => {


  const userInfo = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
    select: safeUserSelect,
  });

  if (!userInfo || userInfo.status !== "ACTIVE") {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found or inactive");
  }

  // Events created by the user (based on ownerId)
  const userEvents = await prisma.event.findMany({
    where: {
      ownerId: userInfo.id,
    },
    select: {
      id: true,
      status: true,
    },
  });

  const userEventIds = userEvents.map((event) => event.id);

  // Total events created
  const totalEvents = userEvents.length;

  // Total Event Attendees
  const eventAttendees = await prisma.participant.count({
    where: {
      eventId: { in: userEventIds },
    },
  });

  // Upcoming Events
  const upcomingEvents = userEvents.filter(
    (event) => event.status === "UPCOMING"
  ).length;

  // Average Rating
  const userEventReviews = await prisma.review.findMany({
    where: {
      eventId: { in: userEventIds },
    },
  });

  let eventRating = "0.0";
  if (userEventReviews.length > 0) {
    const totalRating = userEventReviews.reduce((sum, r) => sum + r.rating, 0);
    eventRating = (totalRating / userEventReviews.length).toFixed(1);
  }

  // Final result return
  const stats = {
    totalEvents,
    eventAttendees,
    upcomingEvents,
    eventRating,
  };

  return stats;
};

const getAllUserFromDB = async (params: any, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  //   For spesific field filter
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.user.findMany({
    where: whereConditions,
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
    select: safeUserSelect,
  });

  const total = await prisma.user.count({
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

const myProfile = async (user: TAuthUser) => {
  const userInfo = await prisma.user.findUnique({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
    },
  });

  let profileInfo;
  if (userInfo?.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.user.findUnique({
      where: {
        email: userInfo.email,
      },
      select: safeUserSelect,
    });
  } else if (userInfo?.role === UserRole.ADMIN) {
    profileInfo = await prisma.user.findUnique({
      where: {
        email: userInfo.email,
      },
      select: safeUserSelect,
    });
  } else if (userInfo?.role === UserRole.USER) {
    profileInfo = await prisma.user.findUnique({
      where: {
        email: userInfo.email,
      },
      select: safeUserSelect,
    });
  }

  return { ...userInfo, ...profileInfo };
};

const changeProfileStatus = async (id: string, status: UserRole) => {
  prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
    select: safeUserSelect,
  });

  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data: status,
    select: safeUserSelect,
  });

  return updateUserStatus;
};

const updateRole = async (id: string, role: UserRole) => {
  prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
    select: safeUserSelect,
  });

  const updateRole = await prisma.user.update({
    where: {
      id,
    },
    data: role,
    select: safeUserSelect,
  });

  return updateRole;
};

const updateMyProfile = async (user: TAuthUser, req: Request) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
  });

  // According the role, data will update
  let profileInfo;

  if (userInfo?.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.user.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
      select: safeUserSelect,
    });
  } else if (userInfo?.role === UserRole.ADMIN) {
    profileInfo = await prisma.user.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
      select: safeUserSelect,
    });
  } else if (userInfo?.role === UserRole.USER) {
    profileInfo = await prisma.user.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
      select: safeUserSelect,
    });
  }

  return { ...profileInfo };
};

export const UserService = {
  createUser,
  createAdmin,
  getUserStats,
  getAllUserFromDB,
  myProfile,
  changeProfileStatus,
  updateRole,
  updateMyProfile,
};
