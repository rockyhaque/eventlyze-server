import { TAuthUser } from "../../interfaces/common";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { InviteStatus, ParticipantStatus } from "@prisma/client";

const createInvitations = async (
  email: string,
  eventId: string,
  host: TAuthUser
) => {
  // Get the user from DB
  const hostData = await prisma.user.findUnique({
    where: {
      email: host?.email,
    },
  });

  if (!hostData) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    select: {
      ownerId: true,
    },
  });

  if (!event) {
    throw new AppError(StatusCodes.NOT_FOUND, "Event not found.");
  }

  if (event.ownerId !== hostData?.id) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Only the event creator can send invitations."
    );
  }

  // Optional: check if invitation already exists
  const existingInvite = await prisma.invite.findFirst({
    where: {
      email,
      eventId,
    },
  });

  if (existingInvite) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "This user has already been invited to the event."
    );
  }

  const invitation = await prisma.invite.create({
    data: {
      email,
      eventId,
      hostId: hostData.id,
    },
  });

  return invitation;
};

// update status and paticipation creation automatically without any payment confirmation
const updateStatus = async (payload: any, receiverUser: TAuthUser) => {
  const hostUser = await prisma.user.findUnique({
    where: {
      email: receiverUser?.email,
    },
  });

  if (!hostUser) {
    throw new AppError(StatusCodes.NOT_FOUND, "Event Creator not found.");
  }

  const invitationData = await prisma.invite.findUnique({
    where: {
      id: payload.invitationId,
    },
  });

  if (!invitationData) {
    throw new AppError(StatusCodes.NOT_FOUND, "Invitation not found.");
  }

  if (invitationData.hostId !== hostUser.id) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You are not allowed to update this invitation."
    );
  }

  if (invitationData.status === InviteStatus.ACCEPTED) {
    throw new AppError(StatusCodes.FORBIDDEN, "Already invitation accepted.");
  }

  // finding invited user id by email
  const invitedUserInfo = await prisma.user.findUnique({
    where: {
      email: invitationData.email,
    },
  });

  if (!invitedUserInfo) {
    throw new AppError(StatusCodes.NOT_FOUND, "Invited user not found.");
  }

  // Use transaction if status is ACCEPTED
  if (payload.status === InviteStatus.ACCEPTED) {
    const result = await prisma.$transaction(async (tx) => {
      const updateInvitation = await tx.invite.update({
        where: { id: payload.invitationId },
        data: { status: payload.status },
      });

      const createdParticipant = await tx.participant.create({
        data: {
          eventId: invitationData.eventId,
          userId: invitedUserInfo?.id,
          status: ParticipantStatus.JOINED,
        },
      });

      return {
        updateInvitation,
        createdParticipant,
      };
    });

    return result;
  }

  // Otherwise, just update status
  const updateInvitation = await prisma.invite.update({
    where: { id: payload.invitationId },
    data: { status: payload.status },
  });

  return { updateInvitation };
};

// For Admin
const getallInvitations = async () => {
  const allinvitations = await prisma.invite.findMany();
  return allinvitations;
};

// For Host
const getHostAllInvitations = async (payload: TAuthUser) => {
  const isExistUser = await prisma.user.findUnique({
    where: {
      email: payload?.email,
    },
  });

  if (!isExistUser) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found.");
  }

  // Get all invitations where user is host
  const allInvitations = await prisma.invite.findMany({
    where: {
      hostId: isExistUser.id,
    },
  });

  // Extract eventIds from invites
  const eventIds = allInvitations.map((invite) => invite.eventId);

  // Fetch all matching events in a single query
  const events = await prisma.event.findMany({
    where: {
      id: {
        in: eventIds,
      },
    },
  });

  // Map each invite to its corresponding event
  const invitationsWithEvent = allInvitations.map((invite) => {
    const event = events.find((e) => e.id === invite.eventId);
    return {
      ...invite,
      event,
    };
  });

  return invitationsWithEvent;
};

// For Participant
const getParticipantAllInvtiations = async (user: TAuthUser) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: user?.email,
    },
  });

  if (!userData) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found.");
  }

  // Get all invitations for the user
  const allInvitations = await prisma.invite.findMany({
    where: {
      email: userData.email,
    },
  });

  // Get all event IDs from the invitations
  const eventIds = allInvitations.map((invite) => invite.eventId);

  // Fetch all events related to the invitations in one query
  const events = await prisma.event.findMany({
    where: {
      id: {
        in: eventIds,
      },
    },
  });

  // collect unique host IDs from invites or events
  const hostIds = [...new Set(allInvitations.map((invite) => invite.hostId))];

  // fetch host details from User model
  const hosts = await prisma.user.findMany({
    where: {
      id: {
        in: hostIds,
      },
    },
  });

  // Map each invite with its corresponding event
  const invitationsWithEvent = allInvitations.map((invite) => {
    const event = events.find((e) => e.id === invite.eventId);
    const host = hosts.find((h) => h.id === invite.hostId);
    return {
      ...invite,
      event,
      host: host
        ? {
            name: host.name,
            email: host.email,
            photo: host.photo,
          }
        : null,
    };
  });

  return invitationsWithEvent;
};

export const InvitationsService = {
  createInvitations,
  updateStatus,
  getallInvitations,
  getHostAllInvitations,
  getParticipantAllInvtiations,
};
