import { parsePhoneNumber } from "libphonenumber-js";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const brazilStates = [
  { state: "acre", code: "AC" },
  { state: "alagoas", code: "AL" },
  { state: "amapa", code: "AP" },
  { state: "amazonas", code: "AM" },
  { state: "bahia", code: "BA" },
  { state: "ceara", code: "CE" },
  { state: "distrito federal", code: "DF" },
  { state: "espirito santo", code: "ES" },
  { state: "goias", code: "GO" },
  { state: "maranhao", code: "MA" },
  { state: "mato grosso", code: "MT" },
  { state: "mato grosso do sul", code: "MS" },
  { state: "minas gerais", code: "MG" },
  { state: "para", code: "PA" },
  { state: "paraiba", code: "PB" },
  { state: "parana", code: "PR" },
  { state: "pernambuco", code: "PE" },
  { state: "piaui", code: "PI" },
  { state: "rio de janeiro", code: "RJ" },
  { state: "rio grande do norte", code: "RN" },
  { state: "rio grande do sul", code: "RS" },
  { state: "rondonia", code: "RO" },
  { state: "roraima", code: "RR" },
  { state: "santa catarina", code: "SC" },
  { state: "sao paulo", code: "SP" },
  { state: "sergipe", code: "SE" },
  { state: "tocantins", code: "TO" },
];

async function orderProcess({
  transactionCode,
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
  total,
  cartItems,
}) {
  const formattedPhone = parsePhoneNumber(customerMobile, "BR").format("E.164");

  const regionCode = brazilStates.filter(
    (element) =>
      element.state ===
      billingState
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
  )[0].code;

  const customerParams = {
    customer: {
      name: customerName,
      email: customerEmail,

      phones: [
        {
          country: formattedPhone.slice(1, 3),
          area: formattedPhone.slice(3, 5),
          number: formattedPhone.slice(5),
          type: "mobile",
        },
      ],
      tax_id: customerDocument.replace(/[^?0-9]/g, ""),
    },
  };

  const itemsParams = {
    items: cartItems?.map((item) => {
      return {
        name: item?.name,
        unit_amount: item?.price,
        quantity: item?.quantity || 1,
      };
    }),
  };

  const shippingParams = {
    shipping: {
      address: {
        street: billingAddress,
        number: billingNumber,
        complement: billingComplement,
        locality: billingNeighborhood,
        city: billingCity,
        region_code: regionCode,
        country: "BRA",
        postal_code: billingZipCode,
      },
    },
  };

  const today = new Date();
  today.setDate(today.getDate() + 7);

  const boletoParams = {
    boleto: {
      due_date: today,
    },
    payment_method: "BOLETO",
    amount: total,
    installments: 1,
  };

  const creditCardParams = {
    charges: [
      {
        reference_id: await uuidv4(),
        description: `charge regarding transaction #${transactionCode}`,
        amount: {
          value: total * 100,
          currency: "BRL",
        },
        payment_method: {
          type: "CREDIT_CARD",
          installments: installments,
          capture: true,
          soft_descriptor: customerName,
          card: {
            number: creditCardNumber?.replace(/[^?0-9]/g, ""),
            exp_month: creditCardExpiration?.slice(0, 2),
            exp_year: creditCardExpiration?.slice(3),
            security_code: creditCardCvv,
            store: false,
            holder: {
              name: creditCardHolderName,
            },
          },
        },
      },
    ],
  };

  let paymentParams;

  switch (paymentType) {
    case "credit_card":
      paymentParams = creditCardParams;
      break;
    case "boleto":
      paymentParams = boletoParams;
      break;
    default:
      throw `Payment type ${paymentType} not found.`;
  }

  const metadataParams = {
    metadata: {
      transaction_code: transactionCode,
    },
  };

  const transactionParams = {
    reference_id: transactionCode,
    ...customerParams,
    ...itemsParams,
    ...shippingParams,
    // postback_url: "",
    ...paymentParams,
  };

  try {
    const createOrder = await axios.post(
      `https://sandbox.api.pagseguro.com/orders`,
      transactionParams,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAGSEGURO_TOKEN}`,
          accept: "application/json",
          "content-type": "application/json",
        },
      }
    );
    console.log("createdOrder -> 💻", createOrder.data);
  } catch (error) {
    console.log("error in axios call to pagseguro 😖", error.response.data);
  }
}

export default orderProcess;
