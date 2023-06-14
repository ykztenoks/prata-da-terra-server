import express from "express";
import cors from "cors";
import "dotenv/config";

import connect from "../db/config.db.js";
import cartRoutes from "../routes/carts.routes.js";
import transactionRoutes from "../routes/transaction.routes.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/carts", cartRoutes);
app.use("/transaction", transactionRoutes);

app.listen(process.env.PORT, () => {
  console.clear();
  console.log(`Server running on port: ${process.env.PORT}`);
  connect();
});
