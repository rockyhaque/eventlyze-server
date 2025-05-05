import { JwtHeader } from "jsonwebtoken";
import { TAuthUser } from "../../interfaces/common";

const createInvitations = (data:any,host:TAuthUser) => {
  

 
  return data;
}

const updateStatus = async() => {
   console.log("updateStatus")
}

export const InvitationsService = {
  createInvitations ,
  updateStatus,
}