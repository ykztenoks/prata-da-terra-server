import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    // code: {
    //   type: String,
    //   unique: true,
    // },
    price: {
      type: Number,
      min: 20,
    },
    items: [
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
        quantity: { type: Number, required: true, trim: true, min: 1 },
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
