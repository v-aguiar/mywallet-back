import { Router } from "express";
import cors from "cors";

import {
  addTransaction,
  getTransactions,
} from "../controllers/transactionController.js";
import validateSession from "../middlewares/sessionMiddlewares.js";

const transactionsRouter = Router();

transactionsRouter.use(cors());

transactionsRouter.post("/transactions", validateSession, addTransaction);
transactionsRouter.get("/transactions", validateSession, getTransactions);

export default transactionsRouter;
