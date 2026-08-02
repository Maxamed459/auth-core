import { Document, Schema, Types, model } from "mongoose";

interface UserDocuments extends Document {
  display_name: string;
  email: string;
  avatar?: string;
  last_login_at?: string;
  is_email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}
interface OAuthAccountDocument extends Document {
  userId: Types.ObjectId;
  provider: "password" | "google" | "github" | "facebook";
  // Only for password authentication
  passwordHash?: string;
  // Only for OAuth providers
  providerUserId?: string;
  createdAt: Date;
  updated_at: Date;
}

const userSchema = new Schema(
  {
    display_name: { type: String, required: true },
    emai: { type: String, required: true },
    avater: { type: String, required: false },
    last_login_at: { type: Date, required: false },
    is_email_verified: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  },
);

const oathAccountSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: String,
      enum: ["password", "google", "github", "apple"],
      required: true,
    },
    passwordHash: {
      type: String,
      required: function () {
        return this.provider === "password";
      },
    },
    providerUserId: {
      type: String,
      required: function () {
        return this.provider !== "password";
      },
    },
  },
  {
    timestamps: true,
  },
);

export const userModel = model<UserDocuments>("User", userSchema);
export const oathaccount = model<OAuthAccountDocument>(
  "OAuthAccount",
  oathAccountSchema,
);
