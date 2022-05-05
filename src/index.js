import express, { json } from "express";

import cors from "cors";
import dotenv from "dotenv";
import chalk from "chalk";

import { signUp, signIn } from "./controllers/authController.js";
import {
  addTransaction,
  getTransactions,
} from "./controllers/transactionController.js";

dotenv.config();

const app = express();
app.use(json());
app.use(cors());

// Authentication routes
app.post("/sign-up", signUp);
app.post("/sign-in", signIn);

// Transaction routes
app.post("/transactions", addTransaction);
app.get("/transactions", getTransactions);

app.listen(process.env.PORT || 5000, () => {
  console.log(
    chalk.bold.greenBright("\n🚀 Server is running!") +
      chalk.bold.cyanBright("\n\nListening on port 5000...\n") +
      chalk.bold.magenta("http://localhost:5000\n")
  );
});
