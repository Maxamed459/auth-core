import { AppError } from "../../lib/appError.js";
import { prisma } from "../../lib/prisma.js";

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
};

export const createNewUser = async (
  display_name: string,
  email: string,
  hashedPassword: string,
) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        display_name: display_name,
        email: email,
        is_email_verified: false,
      },
    });

    await prisma.oauthAccount.create({
      data: {
        userId: newUser.id,
        provider: "PASSWORD",
        passwordHash: hashedPassword,
      },
    });

    return newUser;
  } catch (error) {
    throw new AppError(500, "Failed to create user", error);
  }
};
