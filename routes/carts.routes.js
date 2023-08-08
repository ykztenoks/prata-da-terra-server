import express from "express";
import Cart from "../models/cart.model.js";
const route = express.Router();

route.get("/", async (req, res) => {
  try {
    const carts = await Cart.find();

    return res.status(200).json(carts);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ msg: "Erro no servidor" });
  }
});

route.post("/create", async (req, res) => {
  try {
    const { code, items } = req.body;

    const price = items.reduce((acc, item) => {
      return (acc += item.price * item.quantity);
    }, 0);

    const created = await Cart.create({ code, price, items });

    return res.status(201).json(created);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "erro ao criar carrinho" });
  }
});

route.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { code, price } = req.body;

    const cart = await Cart.findById(id);

    if (!cart) {
      return res.status(404).json("Carrinho não encontrado");
    }

    cart.code = code;
    cart.price = price;

    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

route.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const cart = Cart.findById(id);

    if (!cart) {
      return res.status(404).json({ msg: "carrinho não encontrado" });
    }

    await cart.deleteOne();

    return res.status(200).json({ msg: "carrinho deletado" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "erro ao deletar carrinho" });
  }
});

export default route;
