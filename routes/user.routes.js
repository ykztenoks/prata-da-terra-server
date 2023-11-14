import express from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import Cart from "../models/cart.model.js";
import isAuth from "../middlewares/isAuth.js";
import loggedUser from "../middlewares/loggedUser.js";
import { generateToken } from "../config/jwt.config.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    if (!email || !password || !firstName || !lastName) {
      return res
        .status(500)
        .json({ msg: "Todos os campos devem ser preenchidos." });
    }
    if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      return res
        .status(500)
        .json({ msg: "Você deve informar um email válido." });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({ msg: "Usuário já está registrado" });
    }
    if (
      !/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$$/.test(password)
    ) {
      return res.status(400).json({
        msg: "A senha deve conter no mínimo 8 caracteres, um caractere especial e um número.",
      });
    }
    const salts = await bcrypt.genSalt(12);
    const passwordHashed = await bcrypt.hash(password, salts);

    const user = await User.create({
      email,
      password: passwordHashed,
      firstName,
      lastName,
    });
    delete user._doc.password;
    await Cart.create({ owner: user._id, items: [] });

    return res.status(201).json({ msg: "Usuário criado com sucesso!", user });
  } catch (error) {
    console.log("erro ao criar usuário ❌", error);
    if (error.code === 11000) {
      return res.status(409).json({ msg: "Usuário já está registrado" });
    }
    return res.status(500).json({ msg: `Erro ao criar usuário` });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(404)
        .json({ msg: "Usuário não existe, verifique o email." });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = generateToken(user);

      return res.status(200).json({
        user: {
          name: user.firstName,
          email: user.email,
          _id: user._id,
          role: user.role,
        },
        token: token,
      });
    } else {
      return res.status(401).json({ msg: "Email ou senha invalidos." });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.get("/profile", isAuth, loggedUser, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }
    return res.status(200).json(req.user);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Erro ao buscar usuário" });
  }
});

router.patch("/profile", isAuth, loggedUser, async (req, res) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "email",
    "password",
    "street",
    "number",
    "city",
    "neighborhood",
    "state",
    "zipCode",
    "complement",
  ];

  const addressFields = [
    "street",
    "number",
    "city",
    "neighborhood",
    "state",
    "zipCode",
    "complement",
  ];

  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }
    if (
      req.body.password &&
      !/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(
        req.body.password
      )
    ) {
      return res.status(400).json({
        msg: "A senha deve conter no mínimo 8 caracteres, um caractere especial e um número.",
      });
    }

    if (
      req.body.email &&
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        req.body.email
      )
    ) {
      return res
        .status(500)
        .json({ msg: "Você deve informar um email válido." });
    }

    for (const field of allowedFields) {
      if (req.body[field]) {
        if (field === "password") {
          const salts = bcrypt.genSaltSync(12);
          const hashed = bcrypt.hashSync(req.body["password"], salts);
          user.password = hashed;
        } else if (addressFields.includes(field)) {
          user.address[field] = req.body[field];
        } else {
          user[field] = req.body[field];
        }
      }
    }

    await user.save();
    delete user._doc.password;
    res.status(200).json({ msg: "Usuário atualizado com sucesso!", user });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ msg: "Usuário já está registrado" });
    }
    console.log("erro ao editar o usuário ❌", error);
    return res.status(400).json({ msg: "Erro ao editar usuário." });
  }
});

router.delete("/profile", isAuth, loggedUser, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }
    await User.findByIdAndDelete(req.user._id);
    return res.status(200).json("Conta excluída com sucesso.");
  } catch (error) {
    console.log("erro ao deletar o usuário", error);
    return res.status(500).json({ msg: "Erro ao deletar conta." });
  }
});

export default router;
