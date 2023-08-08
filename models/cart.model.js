import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
      min: 20,
    },
    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, min: 5, required: true },
        quantity: { type: Number, min: 1 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Cart", schema);
