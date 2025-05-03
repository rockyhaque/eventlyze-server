import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";

const createReview = async (payload: any, user: JwtPayload) => {
  const email = user?.email;

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!existingUser) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const event = await prisma.event.findUnique({
    where: {
      id: payload.eventId,
    },
    include: { participant: { select: { userId: true } } },
  });

  if (!event) {
    throw new AppError(StatusCodes.NOT_FOUND, "Event not found");
  }

  const isParticipant = event.participant.some(
    (p) => p.userId === existingUser.id
  );

  if (!isParticipant) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You are not a participant of this event"
    );
  }

  const review = await prisma.review.create({
    data: {
      rating: payload.rating,
      content: payload.content,
      eventId: payload.eventId,
      userId: existingUser.id,
    },
  });

  return review;
};

const getReviewsByUserId = async (user: JwtPayload) => {
  const email = user?.email;

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!existingUser) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  // Now get all reviews by this user
  const reviews = await prisma.review.findMany({
    where: {
      userId: existingUser.id,
    },
    include: {
      event: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};

const updateReview = async (reviewId: string, payload: any) => {
  console.log({ reviewId });
  console.log({ payload });
};

const deleteReview = async (reviewId: string) => {
  console.log({ reviewId });
};

export const ReviewService = {
  createReview,
  getReviewsByUserId,
  updateReview,
  deleteReview,
};
