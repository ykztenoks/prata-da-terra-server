import express from "express";
import * as Yup from "yup";
import parsePhoneNumber from "libphonenumber-js";
import { cpf, cnpj } from "cpf-cnpj-validator";
import cartModel from "../models/cart.model.js";
import TransactionService from "../service/transaction.service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      cartCode,
      paymentType,
      installments,
      customerName,
      customerEmail,
      customerMobile,
      customerDocument,
      billingAddress,
      billingNumber,
      billingNeighborhood,
      billingCity,
      billingState,
      billingZipCode,
      billingComplement,
      creditCardNumber,
      creditCardExpiration,
      creditCardHolderName,
      creditCardCvv,
    } = req.body;

    const cart = await cartModel.findOne({ code: cartCode });
    if (!cart) {
      return res.status(404).json({ msg: "carrinho não encontrado" });
    }

    const yupValidate = Yup.object({
      cartCode: Yup.string().required(),
      paymentType: Yup.mixed()
        .oneOf(["credit_card", "boleto", "pix"])
        .required(),
      installments: Yup.number()
        .min(1)
        .when("paymentType", (paymentType, schema) => {
          paymentType === "credit_card" ? schema.max(12) : schema.max(1);
        }),
      customerName: Yup.string()
        .required()
        .min(3)
        .test("nome-sobrenome", "Digite o nome completo", (value) => {
          if (!value) {
            return false;
          }

          return value.trim().split(" ").length > 1;
        }),
      customerEmail: Yup.string()
        .email()
        .required()
        .test("email-valido", "O e-mail informado é inválido", (value) => {
          if (!value) return true;

          return Yup.string().email().isValid();
        }),
      customerMobile: Yup.string()
        .required()
        .test("is-valid-mobile", "${path}não é um número válido", (value) =>
          parsePhoneNumber(value, "BR").isValid()
        ),
      customerDocument: Yup.string()
        .required()
        .test(
          "is-valid-document",
          "${path}não é um CPF/CPNJ válido",
          (value) => cpf.isValid(value) || cnpj.isValid(value)
        ),
      billingAddress: Yup.string().required(),
      billingNumber: Yup.string().required(),
      billingNeighborhood: Yup.string().required(),
      billingCity: Yup.string().required(),
      billingState: Yup.string().required(),
      billingZipCode: Yup.string().required(),
      billingComplement: Yup.string().required(),
      creditCardNumber: Yup.string().when("paymentType", {
        is: "credit_card",
        then: () =>
          Yup.string().required("O número do cartão de crédito é obrigatório"),
        otherwise: () => Yup.string().notRequired(),
      }),

      creditCardExpiration: Yup.string().when("paymentType", {
        is: "credit_card",
        then: () =>
          Yup.string().required(
            "A data de validade do cartão de crédito é obrigatória"
          ),
        otherwise: () => Yup.string().notRequired(),
      }),

      creditCardHolderName: Yup.string().when("paymentType", {
        is: "credit_card",
        then: () =>
          Yup.string().required(
            "O nome do titular do cartão de crédito é obrigatório"
          ),
        otherwise: () => Yup.string().notRequired(),
      }),

      creditCardCvv: Yup.string().when("paymentType", {
        is: "credit_card",
        then: () =>
          Yup.string().required("O CVV do cartão de crédito é obrigatório"),
        otherwise: () => Yup.string().notRequired(),
      }),
    });

    await yupValidate.validate(req.body, { abortEarly: false });

    const transaction = await TransactionService(
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
      cart.items
    );

    return res.status(201).json(transaction);
  } catch (error) {
    console.log(error);
    if (error instanceof Yup.ValidationError) {
      const errors = {};

      error.inner.forEach((err) => {
        errors[err.path] = err.message;
      });

      res.status(400).json({ errors });
    } else {
      return res.status(500).json({ msg: "erro ao criar transação" });
    }
  }
});

export default router;
