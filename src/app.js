import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "dotenv/config";

import connect from "../db/config.db.js";

import cartRoutes from "../routes/carts.routes.js";
import transactionRoutes from "../routes/transaction.routes.js";
import userRoutes from "../routes/user.routes.js";
import productRoutes from "../routes/product.routes.js";

const app = express();
app.use(helmet());
app.use(morgan());
app.use(express.json());
app.use(cors());

app.use("/user", userRoutes);
app.use("/carts", cartRoutes);
app.use("/transaction", transactionRoutes);
app.use("/products", productRoutes);

app.listen(process.env.PORT, () => {
  console.clear();
  console.log(`Server running on port: ${process.env.PORT}`);
  connect();
});
