import { UserStatus } from "@prisma/client";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";
import bcrypt from "bcryptjs";
import config from "../../../config";
import emailSender from "../../../utils/emailSender";
import { Secret } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.access_secret as string,
    config.jwt.access_secret_expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refresh_secret as string,
    config.jwt.refresh_secret_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      process.env.JWT_REFRESH_SECRET as string
    );
  } catch (error) {
    throw new Error("You are not authorized!");
  }
  //  user exists or not
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.access_secret as string,
    config.jwt.access_secret_expires_in as string
  );

  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
      status: UserStatus.ACTIVE,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: "Password changed successfully",
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const resetPassToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.reset_pass_secret as Secret,
    config.jwt.reset_pass_secret_expires_in as string
  );

  const resetPassLink =
    config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; background-color: #1f1b2e; border-radius: 12px; border: 1px solid #3d2f59; color: #e0e0f0;">
      <h2 style="color: #d6b1ff; text-align: center;">🔐 Password Reset Request</h2>
      <p style="font-size: 16px; margin-bottom: 20px;">Hello <strong>${
        userData.name || "User"
      }</strong>,</p>
      <p style="font-size: 15px; line-height: 1.6;">
        We received a request to reset your password. To proceed, please click the button below:
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetPassLink}" style="text-decoration: none;">
          <button style="background-color: #8a4fff; color: #ffffff; padding: 14px 28px; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer;">
            Reset Password
          </button>
        </a>
      </div>

      <p style="font-size: 14px; color: #c2b8e3;">
        If you didn’t request this, you can safely ignore this email.
      </p>

      <hr style="border: none; border-top: 1px solid #3d2f59; margin: 30px 0;" />

      <p style="font-size: 14px; text-align: center;">
        Need help? Contact us at <a href="${
          config.CLIENT_URL
        }/contact" style="color: #a472f4; text-decoration: underline;">support</a><br/>
        <strong>— The Eventlyze Team</strong>
      </p>
    </div>
`;

  await emailSender(
    userData.email,
    "Password Reset Request",
    "Click the link to reset your password",
    htmlContent
  );

  // console.log(resetPassLink);
};

const resetPassword = async (
  token: string,
  payload: { id: string; newPassword: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });
  const isValidToken = jwtHelpers.verifyToken(
    token,
    config.jwt.access_secret as Secret
  );

  if (!isValidToken) {
    throw new AppError(StatusCodes.FORBIDDEN, "Access Denied. Sorry...");
  }

  // hash pass
  const hashedPassword: string = await bcrypt.hash(
    payload.newPassword,
    config.bcrypt.salt_round
  );

  // update into db
  await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: {
      password: hashedPassword,
    },
  });
};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
