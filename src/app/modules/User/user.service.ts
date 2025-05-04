import { Request } from "express";
import bcrypt from "bcryptjs";
import { Prisma, User, UserRole, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { userSearchAbleFields } from "./user.constant";
import { TAuthUser } from "../../interfaces/common";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";

type TSafeUser = Omit<User, "password">;

const createUser = async (req: Request): Promise<TSafeUser> => {
  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);
  const userData = {
    email: req.body.email,
    password: hashedPassword,
    role: UserRole.USER,
    photo: req.body.photo,
    name: req.body.name,
    contactNumber: req.body.contactNumber,
    gender: req.body.gender,
  };

  const existingUser = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });

  if (existingUser) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "Email already exists. Please use another email."
    );
  }

  const createdUserData = await prisma.user.create({
    data: userData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      photo: true,
      contactNumber: true,
      gender: true,
      status: true,
      needPasswordChange: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return createdUserData;
};

const createAdmin = async (req: Request): Promise<TSafeUser> => {
  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);
  const userData = {
    email: req.body.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
    photo: req.body.photo,
  };

  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });

  if (existingAdmin) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "Email already exists. Please use another email."
    );
  }

  const createdAdminData = await prisma.user.create({
    data: userData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      photo: true,
      contactNumber: true,
      gender: true,
      status: true,
      needPasswordChange: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return createdAdminData;
};

const getAllUserFromDB = async (params: any, options: IPaginationOptions) => {
  // console.log(options)
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.UserWhereInput[] = [];

  //   console.log(filterData);

  if (params.searchTerm) {
    andConditions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  //   For spesific field filter
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const myProfile = async (user: TAuthUser) => {
  const userInfo = await prisma.user.findUnique({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
    },
  });

  let profileInfo;
  if (userInfo?.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.user.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo?.role === UserRole.ADMIN) {
    profileInfo = await prisma.user.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo?.role === UserRole.USER) {
    profileInfo = await prisma.user.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  }

  return { ...userInfo, ...profileInfo };
};

const changeProfileStatus = async (id: string, status: UserRole) => {
  prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data: status,
  });

  return updateUserStatus;
};

const updateRole = async (id: string, role: UserRole) => {
  prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updateRole = await prisma.user.update({
    where: {
      id,
    },
    data: role,
  });

  return updateRole;
};

const updateMyProfile = async (user: TAuthUser, req: Request) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
  });

  // According the role, data will update
  let profileInfo;

  if (userInfo?.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.user.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo?.role === UserRole.ADMIN) {
    profileInfo = await prisma.user.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo?.role === UserRole.USER) {
    profileInfo = await prisma.user.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  }

  return { ...profileInfo };
};

export const UserService = {
  createUser,
  createAdmin,
  getAllUserFromDB,
  myProfile,
  changeProfileStatus,
  updateRole,
  updateMyProfile,
};
