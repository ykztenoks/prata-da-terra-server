import mongoose, { Schema, Types, model } from "mongoose";

const schema = new Schema(
  {
    firstName: {
      type: String,
      minLength: 3,
      maxLength: 18,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 18,
      required: true,
      trim: true,
    },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    address: {
      street: String,
      number: Number,
      city: String,
      neighborhood: String,
      state: String,
      zipCode: Number,
      complement: String,
    },
    orders: [{ type: Types.ObjectId, ref: "Transaction" }],
    wishlist: [{ type: Types.ObjectId, ref: "Product" }],
    cart: { type: Types.ObjectId, ref: "Cart" },
    role: {
      type: String,
      required: true,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);

export const User = model("User", schema);
