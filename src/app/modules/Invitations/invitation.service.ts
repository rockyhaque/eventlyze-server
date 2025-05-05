import { JwtHeader } from "jsonwebtoken";
import { TAuthUser } from "../../interfaces/common";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { InviteStatus } from "@prisma/client";

const createInvitations = async (data:any,host:TAuthUser) => {
  const {email,eventId} = data;
   const isExist = await prisma.user.findMany({
     where:{
      AND:[
        {
         email:host?.email
        },
        {
          Event: {
            some:{
              id:eventId,
            }
          }
        },
      ]
     },
   })


  
    console.log("isExist",isExist.length )
   if(isExist.length === 0){
    throw new AppError(StatusCodes.NOT_FOUND,"You have not created any events yet.")
   }

   const invitation = await prisma.$transaction(async (prismaClient) => {

      const newinvition = await prismaClient.invite.create({
        data:{
          email,
          eventId,
          hostId:isExist[0].id,
        }
      })

      return newinvition;
     
   })
 
  return invitation;
}

const updateStatus = async(payload:any,receverUser:TAuthUser) => {
   const isExist = await prisma.invite.findFirst({
    where:{
      id:payload.invitationId,
      email:receverUser?.email,
    },
   })

   if(!isExist){
    throw new AppError(StatusCodes.NOT_FOUND,"Invitation not found.")
   }

   const updateInvitation = await prisma.invite.update({
    where:{
      id:payload.invitationId,
      email:receverUser?.email,
    },
    data:{
      status:payload.status,
    }
   })
   return updateInvitation;
}

const getallInvitations = async() => {
  const allinvitations = await  prisma.invite.findMany();
  return allinvitations;
}

const gethostallInvtiations = async(payload:TAuthUser) => {
  const isExistuser = await  prisma.user.findUnique({
    where:{
      email:payload?.email
    }
  })

  if(!isExistuser) {
    throw new AppError(StatusCodes.NOT_FOUND,"User not found.")
  }

  const allinvitations = await  prisma.invite.findMany({
    where:{
      hostId:isExistuser?.id
    }
  });
  return allinvitations;
}



export const InvitationsService = {
  createInvitations ,
  updateStatus,
  getallInvitations,
  gethostallInvtiations,
}