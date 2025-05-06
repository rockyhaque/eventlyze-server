import { EventCategory, ParticipantStatus, PaymentStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";

const getJoinedEventsByUser = async (user: any) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });

  if (!userData) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const joinedEvents = await prisma.participant.findMany({
    where: {
      userId: userData.id,
      status: ParticipantStatus.JOINED,
    },
    include: {
      event: true,
    },
  });

  if (joinedEvents.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, "You haven't joined any event");
  }

  return joinedEvents;
};

const getJoinedEventCategoryCount = async () => {
  const joinedParticipants = await prisma.participant.findMany({
    where: {
      status: ParticipantStatus.JOINED,
    },
    select: {
      event: {
        select: {
          category: true,
        },
      },
    },
  });

  // Initialize all categories with 0
  const categoryCounts: Record<string, number> = {};
  for (const category of Object.values(EventCategory)) {
    categoryCounts[category] = 0;
  }

  // Count actual participants per category
  joinedParticipants.forEach((p) => {
    const category = p.event.category;
    categoryCounts[category]++;
  });

  return categoryCounts
};

const getJoinedAllEventsByAdmin = async () => {
  const joinedAllEvents = await prisma.participant.findMany({
    include: {
      event: true,
    },
  });

  if (joinedAllEvents.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, "No Paricipation Found");
  }

  return joinedAllEvents;
};

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
    include: {
      payment: true,
    },
  });

  // console.log("event", eventData);

  if (!eventData) {
    throw new AppError(StatusCodes.NOT_FOUND, "Event Not Found");
  }

  // if (!eventData.payment) {
  //   throw new AppError(StatusCodes.NOT_FOUND, "Payment Info Not Found");
  // }

  if (eventData.isPaid) {
    if (
      eventData.isPaid &&
      eventData?.payment?.status !== PaymentStatus.SUCCESS
    ) {
      switch (eventData.payment?.status) {
        case PaymentStatus.PENDING:
          throw new Error("Event is not paid yet");

        case PaymentStatus.FAILED:
          throw new Error("Event payment failed");

        case PaymentStatus.CANCELLED:
          throw new Error("Event payment cancelled");
      }
    }
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

const cancelParticipation = async (id: any) => {
  const participationData = await prisma.participant.findUnique({
    where: {
      id,
      status: {
        in: [ParticipantStatus.JOINED, ParticipantStatus.APPROVED],
      },
    },
  });

  // console.log(participationData);

  if (!participationData) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "No active participation found to cancel"
    );
  }

  const result = await prisma.participant.update({
    where: {
      id,
    },
    data: {
      status: ParticipantStatus.CANCELLED,
    },
  });
  return result;
};

export const participantService = {
  getJoinedEventsByUser,
  getJoinedAllEventsByAdmin,
  createParticipation,
  cancelParticipation,
  getJoinedEventCategoryCount,
};
