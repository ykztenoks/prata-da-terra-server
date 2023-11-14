import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import chalk from "chalk";

import "dotenv/config";

import connect from "./db/config.db.js";

import cartRoutes from "./routes/carts.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import uploadRouter from "./routes/uploadimage.routes.js";
const app = express();
app.use(helmet());
app.use(
  morgan((tokens, req, res) => {
    return [
      chalk.hex("#F96C39").bold(tokens.method(req, res)),
      chalk.hex("#ffb142").bold(tokens.status(req, res)),
      chalk.hex("#759438").bold(tokens.url(req, res)),
      chalk.hex("#2ed573").bold(tokens["response-time"](req, res) + " ms"),
      // chalk.hex("#f78fb3").bold("@ " + tokens.date(req, res)),
      // chalk.yellow(tokens["remote-addr"](req, res)),
      chalk.hex("#FBB337").bold("from " + tokens.referrer(req, res)),
    ];
  })
);
app.use(express.json());
app.use(cors());

app.use("/user", userRoutes);
app.use("/carts", cartRoutes);
app.use("/transaction", transactionRoutes);
app.use("/products", productRoutes);
app.use("/upload", uploadRouter);
app.listen(process.env.PORT, () => {
  console.clear();
  console.log(`Server running on port: ${process.env.PORT}`);
  connect();
});
