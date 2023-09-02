import express from "express";
import { Product } from "../models/product.model";
import isAdmin from "../middlewares/isAdmin";
import isAuth from "../middlewares/isAuth";
import loggedUser from "../middlewares/loggedUser";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    return res.status(200).json(products);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Erro ao carregar produtos." });
  }
});

router.get("/:category", async (req, res) => {
  try {
    const { category } = req.params;

    const reg = new RegExp(category.slice(0, -1), "i");
    const products = await Product.find({ type: { $regex: reg } });
    console.log(products);
    return res.status(200).json(products);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.post("/create", isAuth, loggedUser, isAdmin, async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      type,
      style,
      size,
      stones,
      model,
      closure,
      newCollection,
      inStock,
      image,
    } = req.body;
    const productData = {
      name,
      price,
      description,
      type,
      style,
      size,
      stones,
      model,
      closure,
      newCollection,
      inStock,
      image,
    };

    for (const prop in productData) {
      if (productData[prop] === undefined) {
        delete productData[prop];
      }
    }

    const product = await Product.create(productData);

    return res.status(201).json(product);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Erro ao criar produto" });
  }
});

router.patch("/:id", isAuth, loggedUser, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const {
      name,
      price,
      description,
      type,
      style,
      size,
      stones,
      model,
      closure,
      newCollection,
      inStock,
      discount,
    } = req.body;
    const productData = {
      name,
      price,
      description,
      type,
      style,
      size,
      stones,
      model,
      closure,
      newCollection,
      inStock,
      discount,
    };
    for (const prop in productData) {
      if (productData[prop] === undefined) {
        delete productData[prop];
      }
    }

    const updated = await Product.findByIdAndUpdate(id, productData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Erro ao editar produto." });
  }
});

router.delete("/:id", isAuth, loggedUser, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);

    return res.status(204).json();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Erro ao deletar produto." });
  }
});
export default router;
