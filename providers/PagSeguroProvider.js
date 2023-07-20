import { cpf } from "cpf-cnpj-validator";
import { parsePhoneNumber } from "libphonenumber-js";
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
console.log(process.env.PAGSEGURO_TOKEN);
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
  creditCardCvv,
  creditCardExpiration,
  creditCardHolderName,
  creditCardNumber,
  total,
}) {
  const boletoParams = {
    payment_method: "BOLETO",
    amount: total,
    installments: 1,
  };

  const creditCardParams = {
    payment_method: "CREDIT_CARD",
    amount: total,
    installments,
    card_number: creditCardNumber.replace(/[^?0-9]/g, ""),
    card_expiration_date: creditCardExpiration.replace(/[^?0-9]/g, ""),
    credit_card_holderName: creditCardHolderName,
    card_cvv: creditCardCvv,
    capture: true,
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

  const formattedPhone = parsePhoneNumber(customerMobile, "BR").format("E.164");

  const customerParams = {
    customer: {
      external_id: customerEmail,
      name: customerName,
      email: customerEmail,
      type: cpf.isValid(customerDocument) ? "individual" : "corporation",
      country: "br",
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

  const regionCode = brazilStates.filter(
    (element) =>
      element.state ===
      billingState
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
  )[0].code;

  const shippingParams = {
    shipping: {
      address: {
        street: billingAddress,
        number: billingNumber,
        complement: "casa",
        locality: billingNeighborhood,
        city: billingCity,
        region_code: regionCode,
        country: "BRA",
        postal_code: billingZipCode,
      },
    },
  };

  // const itemsParams =
  //   items?.length > 0
  //     ? {
  //         items: items.map((item) => {
  //           return {
  //             id: item?.id.toString(),
  //             title: item?.title,
  //             unit_price: item?.amount,
  //             quantity: item?.quantity || 1,
  //             tangible: false,
  //           };
  //         }),
  //       }
  //     : {
  //         items: [
  //           {
  //             id: 1,
  //             title: `t-${transactionCode}`,
  //             unit_price: total * 100,
  //             quantity: 1,
  //             tangible: false,
  //           },
  //         ],
  //       };

  const metadataParams = {
    metadata: {
      transaction_code: transactionCode,
    },
  };

  const transactionParams = {
    reference_id: transactionCode,
    // postback_url: "",
    // ...paymentParams,
    ...customerParams,
    ...shippingParams,
    items: [
      {
        reference_id: "12341",
        name: "nome do item",
        quantity: 1,
        unit_amount: 12,
      },
    ],

    // ...itemsParams,
    // ...metadataParams,
  };

  console.log(
    "TRANSACTION PARAMS 💳",
    transactionParams,
    "transaction shipping",
    transactionParams.shipping
  );
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
    console.log("createdOrder -> 💻", createOrder);
  } catch (error) {
    console.log("error in axios call to pagseguro 😖", error.response.data);
  }
}

export default orderProcess;
