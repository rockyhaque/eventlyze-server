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

const getallInvitations = async () => {
  const allinvitations = await prisma.invite.findMany();
  return allinvitations;
};

const gethostallInvtiations = async (payload: TAuthUser) => {
  const isExistuser = await prisma.user.findUnique({
    where: {
      email: payload?.email,
    },
  });

  if (!isExistuser) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found.");
  }

  const allinvitations = await prisma.invite.findMany({
    where: {
      hostId: isExistuser?.id,
    },
  });
  return allinvitations;
};

export const InvitationsService = {
  createInvitations,
  updateStatus,
  getallInvitations,
  gethostallInvtiations,
};
