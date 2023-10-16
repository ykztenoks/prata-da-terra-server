import express from "express";
import Cart from "../models/cart.model.js";
import isAuth from "../middlewares/isAuth.js";
import loggedUser from "../middlewares/loggedUser.js";
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

route.get("/:userId", isAuth, loggedUser, async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.findOne({ owner: userId });

    return res.status(200).json(cart);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ msg: "Erro no servidor" });
  }
});

route.post("/create", isAuth, loggedUser, async (req, res) => {
  try {
    const { items } = req.body;

    const price = items.reduce((acc, item) => {
      return (acc += item.price * item.quantity);
    }, 0);

    if (req.user) {
      const cartWithOwner = await Cart.create({
        price,
        items,
        owner: req.user._id,
      });
      return res.status(201).json(cartWithOwner);
    }
    const created = await Cart.create({ price, items });

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
