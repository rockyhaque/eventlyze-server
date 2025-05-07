import { StatusCodes } from "http-status-codes";
import prisma from "../../../shared/prisma";
import { safeUserSelect } from "../User/user.constant";
import AppError from "../../errors/AppError";
import { startOfYear, endOfYear } from "date-fns";
import { UserRole } from "@prisma/client";

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

const getChartData = async (user: any) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
    select: safeUserSelect,
  });

  if (!userData) {
    throw new AppError(StatusCodes.NOT_FOUND, "User Not Found");
  }

  const yearStart = startOfYear(new Date());
  const yearEnd = endOfYear(new Date());

  const findEvents = await prisma.event.findMany();
  if (!findEvents) {
    throw new AppError(StatusCodes.NOT_FOUND, "Event Not Found");
  }

  const isAdmin =
    userData.role === UserRole.ADMIN || userData.role === UserRole.SUPER_ADMIN;

  const events = await prisma.event.findMany({
    where: {
      ...(isAdmin ? {} : { ownerId: userData.id }),
      createdAt: {
        gte: yearStart,
        lte: yearEnd,
      },
    },
    select: {
      createdAt: true,
    },
  });

  const totalEventsCreated = events.length;

  const monthCountMap: Record<string, number> = {
    January: 0,
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    October: 0,
    November: 0,
    December: 0,
  };

  for (const event of events) {
    const monthName = event.createdAt.toLocaleString("default", {
      month: "long",
    });
    monthCountMap[monthName]++;
  }

  const chartData = Object.entries(monthCountMap).map(([month, event]) => ({
    month,
    event,
  }));

  return {
    totalEventsCreated,
    chartData,
  };
};

export const DashboardService = {
  getAdminStats,
  getUserStats,
  getChartData,
};
