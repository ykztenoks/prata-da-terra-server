import cartModel from "../models/cart.model";
import { Transaction } from "../models/transaction.model";
import { v4 as uuidv4 } from "uuid";

async function TransactionService(
  cartCode,
  paymentType,
  installments,
  customerName,
  customerEmail,
  customerDocument,
  customerMobile,
  billingAddress,
  billingNumber,
  billingNeighborhood,
  billingState,
  billingCity,
  billingZipCode,
  creditCard
) {
  const cart = cartModel.findOne({ cartCode });

  if (!cart) {
    throw `Cart ${cartCode} was not found`;
  }

  const transaction = await Transaction.create({
    cartCode,
    code: await uuidv4(),
    total: cart.price,
    paymentType,
    installments,
    status: "started",
    customerName,
    customerEmail,
    customerDocument,
    customerMobile,
    billingAddress,
    billingNumber,
    billingNeighborhood,
    billingState,
    billingCity,
    billingZipCode,
  });

  return transaction;
}

export default TransactionService;
