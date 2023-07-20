import cartModel from "../models/cart.model";
import { Transaction } from "../models/transaction.model";
import { v4 as uuidv4 } from "uuid";
import orderProcess from "../providers/PagSeguroProvider";

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
  creditCardNumber,
  creditCardExpiration,
  creditCardCvv,
  creditCardHolderName
) {
  try {
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
      creditCardCvv,
      creditCardExpiration,
      creditCardHolderName,
      creditCardNumber,
      total: transaction.total,
    });

    return transaction;
  } catch (error) {
    console.log("error in transaction service", error);
  }
}

export default TransactionService;
