import { Request, Response } from "express";
import { logger } from "../../config/logger.js";
import { createNewUser, findUserByEmail } from "./auth.service.js";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "../../lib/Email.js";

export const register = async (req: Request, res: Response) => {
  const { display_name, email, password } = req.body;
  try {
    const isUserExists = await findUserByEmail(email);

    if (isUserExists) {
      return res.status(400).json({
        success: false,
        message: "this email already exists please login.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createNewUser(display_name, email, hashedPassword);

    await sendVerificationEmail(newUser.email);

    return res.status(201).json({
      success: true,
      message: "user created successfully",
      data: newUser,
    });
  } catch (error) {
    logger.info(error);
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};
