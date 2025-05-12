import {
  EventCategory,
  ParticipantStatus,
  PaymentStatus,
  UserRole,
} from "@prisma/client";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { TAuthUser } from "../../interfaces/common";

// TODO: Maybe no need. Refector later
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
      // status: ParticipantStatus.JOINED,
    },
    include: {
      event: true,
    },
  });

  let join;

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

  return categoryCounts;
};

// Role based get Participations
const getAllParticipations = async (user: TAuthUser) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: user?.email,
    },
  });

  if (!userData) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  let participants;

  if (
    userData.role === UserRole.ADMIN ||
    userData.role === UserRole.SUPER_ADMIN
  ) {
    // Admins see all participants
    participants = await prisma.participant.findMany({
      include: {
        event: true,
      },
    });
  } else if (userData.role === UserRole.USER) {
    // Regular users see only their own participations
    participants = await prisma.participant.findMany({
      where: {
        userId: userData.id,
      },
      include: {
        event: {
          select: {
            title: true,
            category: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            photo: true,
          },
        },
      },
    });
  } else {
    throw new AppError(StatusCodes.FORBIDDEN, "Unauthorized access");
  }

  if (!participants || participants.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, "No Paricipation Found");
  }

  return participants;
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
      payments: true,
    },
  });

  if (!eventData) {
    throw new AppError(StatusCodes.NOT_FOUND, "Event Not Found");
  }

  //  Prevent creator from joining their own event
  if (eventData.ownerId === userData.id) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You cannot join your own event."
    );
  }

  if (eventData.isPaid) {
    if (!eventData?.payments) {
      throw new AppError(StatusCodes.FORBIDDEN, "Event is not paid yet");
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
    let status: ParticipantStatus;

    if (eventData.isPublic && !eventData.isPaid) {
      // Public + Free → Instant join
      status = ParticipantStatus.JOINED;
    } else {
      // All others → Request first (payment handled elsewhere)
      status = ParticipantStatus.REQUESTED;
    }

    const result = await prisma.participant.create({
      data: {
        eventId,
        userId: userData.id,
        status,
      },
      include: {
        event: true,
        user: {
          select: {
            name: true,
            email: true,
            photo: true,
          },
        },
      },
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

const bannedParticipation = async (id: string, user: TAuthUser) => {
  // Get the user from DB
  const userData = await prisma.user.findUnique({
    where: {
      email: user?.email,
    },
  });

  if (!userData) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  // Get the participant record
  const participant = await prisma.participant.findUnique({
    where: {
      id,
    },
    include: {
      event: true,
    },
  });

  if (!participant) {
    throw new AppError(StatusCodes.NOT_FOUND, "You haven't participated yet");
  }

  if (participant.status === ParticipantStatus.BANNED) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Participant is already banned"
    );
  }

  // Check if the logged-in user is the owner of the event
  if (participant.event.ownerId !== userData.id) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Only the event creator can ban participants"
    );
  }

  // Update the participant's status to BANNED
  const updatedParticipant = await prisma.participant.update({
    where: {
      id,
    },
    data: {
      status: ParticipantStatus.BANNED,
    },
  });

  return updatedParticipant;
};

const participantStatusUpdate = async (id: string, req: any) => {
  const user = req.user;
  const payload = req.body;
  // console.log({id, user, payload})

  // Get the user from DB
  const userData = await prisma.user.findUnique({
    where: {
      email: user?.email,
    },
  });

  if (!userData) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  // Get the participant record
  const participant = await prisma.participant.findUnique({
    where: {
      id,
    },
    include: {
      event: true,
    },
  });

  if (!participant) {
    throw new AppError(StatusCodes.NOT_FOUND, "You haven't participated yet");
  }

  if (participant.status === ParticipantStatus.BANNED) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Participant is already banned"
    );
  }

  // Check if the logged-in user is the owner of the event
  if (participant.event.ownerId !== userData.id) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Event creator can not be a participant"
    );
  }

  if (participant?.event?.isPaid) {
    const paymentData = await prisma.payment.findFirst({
      where: {
        userId: participant.userId,
        eventId: participant?.event?.id,
        status: {
          in: [PaymentStatus.SUCCESS, PaymentStatus.COMPLETED],
        },
      },
    });

    if (!paymentData) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "You didn't complete your payment"
      );
    }
  }

  // Update the participant's status to BANNED
  const updatedParticipant = await prisma.participant.update({
    where: {
      id,
      status: ParticipantStatus.REQUESTED,
    },
    data: {
      status: payload.status,
    },
  });

  return updatedParticipant;
};

export const participantService = {
  getJoinedEventsByUser,
  getAllParticipations,
  getJoinedEventCategoryCount,
  createParticipation,
  cancelParticipation,
  bannedParticipation,
  participantStatusUpdate,
};
