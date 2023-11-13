import express from "express";
import isAuth from "../middlewares/isAuth";
import isAdmin from "../middlewares/isAdmin";
import loggedUser from "../middlewares/loggedUser";
import { uploadImage } from "../config/cloudinary.config.js";

const router = express.Router();

router.post(
  "/image/:category",
  isAuth,
  loggedUser,
  isAdmin,
  uploadImage.single("picture", 5),
  async (req, res) => {
    try {
      if (!req.file || !req.file.path) {
        return res.status(500).json({ msg: "Erro ao fazer upload de imagem" });
      }

      return res
        .status(200)
        .json({ msg: "Upload completo", url: req.file.path });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Erro ao fazer upload da imagem" });
    }
  }
);

export default router;
