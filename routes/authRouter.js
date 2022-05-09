import { Router } from "express";
import cors from "cors";

import { signIn, signUp } from "../controllers/authController.js";
import { validateUserInput } from "../middlewares/validateUserMiddleware.js";

const authRouter = Router();
authRouter.use(cors());

authRouter.post("/sign-up", validateUserInput, signUp);
authRouter.post("/sign-in", signIn);

export default authRouter;
