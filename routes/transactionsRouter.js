import { Router } from "express";
import cors from "cors";

import {
  addTransaction,
  getTransactions,
} from "../controllers/transactionController.js";
import validateSession from "../middlewares/sessionMiddlewares.js";

const transactionsRouter = Router();

transactionsRouter.options("/transactions", cors());

transactionsRouter.post(
  "/transactions",
  cors(),
  validateSession,
  addTransaction
);
transactionsRouter.get(
  "/transactions",
  cors(),
  validateSession,
  getTransactions
);

export default transactionsRouter;
