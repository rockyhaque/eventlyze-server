import { User, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";

const getAdminStats = async (user: any) => {
  
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  console.log("user", userData)
}

const permanentDeleteUser = async (id: string): Promise<User | null> => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id,
      status: UserStatus.ACTIVE,
    },
  });

  const result = await prisma.user.delete({
    where: {
      email: userData.email,
    }
  });

  return result;
};

const softUserDelete = async (id: string): Promise<User | null> => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id,
      status: UserStatus.ACTIVE,
    },
  });

  const result = await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      status: UserStatus.DELETED,
    },
  });

  return result;
};

export const AdminService = {
  getAdminStats,
  softUserDelete,
  permanentDeleteUser
};
