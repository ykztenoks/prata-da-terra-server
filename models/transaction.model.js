import mongoose, { Schema, Types, model } from "mongoose";

const schema = new Schema({
  cartCode: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: [
      "started",
      "processing",
      "pending",
      "approved",
      "refused",
      "refunded",
      "chargeback",
      "error",
    ],
    reuired: true,
  },
  paymentType: {
    type: String,
    enum: ["credit_card", "boleto", "pix"],
  },
  installments: {
    type: Number,
  },
  total: {
    type: Number,
  },
  transactionId: {
    type: String,
  },
  processorResponse: {
    type: String,
  },
  customerEmail: {
    type: String,
  },
  customerName: {
    type: String,
  },
  customerMobile: {
    type: String,
  },
  customerDocument: {
    type: String,
  },
  billingAddress: {
    type: String,
  },
  billingCity: {
    type: String,
  },
  billingNeighborhood: {
    type: String,
  },
  billingState: {
    type: String,
  },
  billingZipCode: {
    type: String,
  },
  billingNumber: {
    type: String,
  },
});

export const Transaction = model("Transaction", schema);
