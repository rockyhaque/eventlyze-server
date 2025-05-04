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

// get all for admin
const getAllReviewForAdmin = async (user: JwtPayload) => {
  const email = user?.email;

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, role: true },
  });

  if (!existingUser) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (existingUser.role !== "ADMIN") {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Only admin can view all reviews"
    );
  }

  const allReviews = await prisma.review.findMany({
    include: {
      event: {
        select: {
          id: true,
          title: true,
          description: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return allReviews;
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

const updateReview = async (
  reviewId: string,
  payload: any,
  user: JwtPayload
) => {
  const email = user?.email;

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!existingUser) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const existingReview = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!existingReview) {
    throw new AppError(StatusCodes.NOT_FOUND, "Review not found");
  }

  if (existingReview.userId !== existingUser.id) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You can only update your own review"
    );
  }

  const updateReview = await prisma.review.update({
    where: {
      id: existingReview.id,
    },
    data: {
      content: payload.content,
      rating: payload.rating,
      updatedAt: new Date(),
    },
  });

  return updateReview;
};

const deleteReview = async (reviewId: string, user: JwtPayload) => {
  const email = user?.email;

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, role: true },
  });

  if (!existingUser) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (existingUser.role !== "ADMIN") {
    throw new AppError(StatusCodes.FORBIDDEN, "Only admin can delete a review");
  }

  const existingReview = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!existingReview) {
    throw new AppError(StatusCodes.NOT_FOUND, "Review not found");
  }

  await prisma.review.delete({
    where: { id: reviewId },
  });
};

export const ReviewService = {
  createReview,
  getReviewsByUserId,
  getAllReviewForAdmin,
  updateReview,
  deleteReview,
};
