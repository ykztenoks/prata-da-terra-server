import Cart from "../models/cart.model.js";
import { Transaction } from "../models/transaction.model.js";
import { v4 as uuidv4 } from "uuid";
import orderProcess from "../providers/PagSeguroProvider.js";

async function TransactionService(
  cartCode,
  paymentType,
  installments,
  customerName,
  customerEmail,
  customerMobile,
  customerDocument,
  billingAddress,
  billingNumber,
  billingCity,
  billingState,
  billingZipCode,
  billingNeighborhood,
  billingComplement,
  creditCardNumber,
  creditCardExpiration,
  creditCardCvv,
  creditCardHolderName,
  cartItems
) {
  try {
    const cart = await Cart.findOne({ code: cartCode });

    if (!"price" in cart) {
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
      billingComplement,
    });

    await orderProcess({
      transactionCode: transaction.code,
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
      billingComplement,
      creditCardCvv,
      creditCardExpiration,
      creditCardHolderName,
      creditCardNumber,
      total: transaction.total,
      cartItems,
    });

    return transaction;
  } catch (error) {
    console.log("error in transaction service", error);
  }
}

export default TransactionService;
