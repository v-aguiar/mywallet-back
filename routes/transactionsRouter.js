import { Router } from "express";
import cors from "cors";

import {
  addTransaction,
  getTransactions,
} from "../controllers/transactionController.js";
import validateSession from "../middlewares/sessionMiddlewares.js";

const transactionsRouter = Router();

const corsOptions = {
  "Access-Control-Allow-Headers":
    "Content-Type,Content-Length, Authorization, Accept,X-Requested-With",
  "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS",
  "Access-Control-Allow-Origin": "*",
};

transactionsRouter.use(cors(corsOptions));

transactionsRouter.post("/transactions", validateSession, addTransaction);
transactionsRouter.get("/transactions", validateSession, getTransactions);

export default transactionsRouter;
