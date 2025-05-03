import { ParticipantStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";

const createParticipation = async (payload: any, user: any) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });

  if (!userData) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const { eventId } = payload;

  const eventData = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });


  if (!eventData) {
    throw new AppError(StatusCodes.NOT_FOUND, "Event Not Found");
  }

  //   TODO: APPLY YOUR PAYMENT LOGICS
  if (eventData.isPaid) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "This is a paid event. Please complete payment to participate."
    );
  }

  const existingParticipant = await prisma.participant.findFirst({
    where: {
      eventId,
      userId: userData.id,
    },
  });

  if (existingParticipant?.status === ParticipantStatus.JOINED) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "You have already joined this event."
    );
  }

  if (existingParticipant?.status === ParticipantStatus.REQUESTED) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "Your participation request is pending approval."
    );
  }

  if (existingParticipant?.status === ParticipantStatus.APPROVED) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "Your participation has already been approved."
    );
  }

  if (existingParticipant?.status === ParticipantStatus.REJECTED) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Your participation request was rejected."
    );
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const createdParticipant = await prisma.participant.create({
        data: {
          eventId,
          userId: userData.id,
        },
      });

      const updatedParticipantStatus = await tx.participant.update({
        where: {
          id: createdParticipant.id,
        },
        data: {
          status: ParticipantStatus.JOINED,
        },
        include: {
          event: true,
          user: true,
        },
      });
      return updatedParticipantStatus;
    });
    return result;
  } catch (error) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Error creating participant");
  }
};

export const participantService = {
  createParticipation,
};
