import { StatusCodes } from "http-status-codes";
import prisma from "../../../shared/prisma";
import { safeUserSelect } from "../User/user.constant";
import AppError from "../../errors/AppError";

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

export const DashboardService = {
  getAdminStats,
  getUserStats
};
