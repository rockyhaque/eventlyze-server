import { User, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { safeUserSelect } from "../User/user.constant";

const getAdminStats = async (user: any) => {
  // Total Event Count
  const totalEvents = await prisma.event.count();

  // Total Event Attendies
  const totalParticipants = await prisma.participant.count();

  // Upcoming Events
  const upcomingEvents = await prisma.event.count({
    where: {
      status: "UPCOMING",
    },
  });

  // Recent Subscribers
  const allSubscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });

  // Average Rating
  const allReviews = await prisma.review.findMany();
  let eventRating = "0.0";

  if (allReviews.length > 0) {
    const totalRating = allReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    eventRating = (totalRating / allReviews.length).toFixed(1);
  }

  // Final result return
  const stats = {
    totalEvents,
    eventAttendees: totalParticipants,
    upcomingEvents,
    eventRating,
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
