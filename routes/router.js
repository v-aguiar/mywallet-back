import { Router } from "express";
import cors from "cors";

import authRouter from "./authRouter.js";
import transactionsRouter from "./transactionsRouter.js";

const router = Router();

router.use(cors());

router.use(authRouter);
router.use(transactionsRouter);

export default router;
