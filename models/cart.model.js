import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    code: {
      type: String,
      unique: true,
    },
    price: {
      type: Number,
      min: 20,
    },
    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, min: 5, required: true },
        quantity: { type: Number, min: 1 },
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Cart", schema);
