import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    name: { type: String, trim: true, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String, trim: true, required: true },
    type: {
      type: String,
      trim: true,
      required: true,
      enum: [
        "anel",
        "berloque",
        "bracelete",
        "brinco",
        "colar",
        "corrente",
        "pingente",
        "piercing",
        "pulseira",
        "tornozeleira",
      ],
    },
    style: { type: String, trim: true, required: true },
    size: { type: Number, trim: true },
    stones: { type: String, trim: true },
    model: { type: String, trim: true },
    closure: { type: String, trim: true },
    newCollection: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
    discount: { type: Number },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", schema);
