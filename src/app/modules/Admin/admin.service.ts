import { User, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { safeUserSelect } from "../User/user.constant";

const getAdminStats = async (user: any) => {
  const totalEvents = (await prisma.event.findMany()).length;
  const upcomingEvents = await prisma.event.count({
    where: {
      status: "UPCOMING",
    },
  });

  const allSubscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });

  const stats = {
    totalEvents,
    eventAttendees: 145, // Static
    upcomingEvents,
    eventRating: 4.6, // Static
    recentSubscribers: allSubscribers,
  };

  return stats;
};

const permanentDeleteUser = async (id: string) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id,
      status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  await prisma.user.delete({
    where: {
      email: userData.email,
    },
  });
};

const softUserDelete = async (id: string) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id,
      status: UserStatus.ACTIVE,
    },
  });

  const result = await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      status: UserStatus.DELETED,
    },
    select: safeUserSelect,
  });

  return result;
};

export const AdminService = {
  getAdminStats,
  softUserDelete,
  permanentDeleteUser,
};
