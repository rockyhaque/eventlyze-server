import { JwtHeader } from "jsonwebtoken";
import { TAuthUser } from "../../interfaces/common";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";

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

const updateStatus = async (payload: any, receverUser: TAuthUser) => {
  const isExist = await prisma.invite.findFirst({
    where: {
      id: payload.invitationId,
      email: receverUser?.email,
    },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Invitation not found.");
  }

  const updateInvitation = await prisma.invite.update({
    where: {
      id: payload.invitationId,
      email: receverUser?.email,
    },
    data: {
      status: payload.status,
    },
  });
  return updateInvitation;
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
