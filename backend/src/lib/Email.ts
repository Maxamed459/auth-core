import { Resend } from "resend";
import { RESEND_API_KEY } from "../config/dotenv.js";
import { string } from "zod";
import { logger } from "../config/logger.js";

const resend = new Resend(RESEND_API_KEY);
const from = process.env.EMAIL_FROM || "Acme <onboarding@resend.dev>";

export const sendVerificationEmail = async (to: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      subject: "Hello from Resend!",
      html: "<h1>Welcome!</h1><p>This email was sent using Resend's Node.js SDK.</p>",
      text: "Welcome! This email was sent using Resend's Node.js SDK.",
    });
  } catch (error) {
    logger.info(error);
    process.exit(1);
  }
};
