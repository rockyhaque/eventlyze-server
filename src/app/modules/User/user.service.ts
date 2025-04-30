import { Request } from "express";
import { IFile } from "../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";
import bcrypt from "bcryptjs";
import { Prisma, User, UserRole, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { userSearchAbleFields } from "./user.constant";
import { TAuthUser } from "../../interfaces/common";

const createUser = async (req: Request): Promise<User> => {
  const file = req.file as IFile;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.user.photo = uploadToCloudinary?.secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);
  const userData = {
    email: req.body.user.email,
    password: hashedPassword,
    role: UserRole.USER,
    photo: req.body.user.photo,
  };

  const result = await prisma.$transaction(async (tx) => {
    const createdUserData = await tx.user.create({
      data: userData,
    });

    // const createdAdminData = await tx.admin.create({
    //   data: req.body.admin,
    // });

    return createdUserData;
  });

  return result;
};

const createAdmin = async (req: Request) => {
  const file = req.file as IFile;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.admin.photo = uploadToCloudinary?.secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);
  const userData = {
    email: req.body.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
    photo: req.body.admin.photo,
  };

  const result = await prisma.$transaction(async (tx) => {
    //   await tx.user.create({
    //     data: userData,
    //   });

    const createdAdminData = await tx.user.create({
      // data: req.body.admin,
      data: userData,
    });

    return createdAdminData;
  });

  return result;
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

export const UserService = {
  createUser,
  createAdmin,
  getAllUserFromDB,
  myProfile
};
