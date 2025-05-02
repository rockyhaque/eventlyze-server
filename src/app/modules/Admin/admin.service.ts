import { User, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";

const getAdminStats = async (user: any) => {
  const allSubscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: {
      createdAt: "desc", // or any timestamp field
    },
    take: 6,
  });

  const stats = {
    totalEvents: 12, // Static
    eventAttendees: 145, // Static
    upcomingEvents: 4, // Static
    eventRating: 4.6, // Static
    recentSubscribers: allSubscribers, // Array of up to 6 subscribers
  };

  return stats;
};

const permanentDeleteUser = async (id: string): Promise<User | null> => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id,
      status: UserStatus.ACTIVE,
    },
  });

  const result = await prisma.user.delete({
    where: {
      email: userData.email,
    },
  });

  return result;
};

const softUserDelete = async (id: string): Promise<User | null> => {
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
  });

  return result;
};

export const AdminService = {
  getAdminStats,
  softUserDelete,
  permanentDeleteUser,
};
