import { Router } from "express";

import {
  addTransaction,
  getTransactions,
} from "../controllers/transactionController.js";
import validateSession from "../middlewares/sessionMiddlewares.js";

const transactionsRouter = Router();

transactionsRouter.post("/transactions", validateSession, addTransaction);
transactionsRouter.get("/transactions", validateSession, getTransactions);

export default transactionsRouter;
