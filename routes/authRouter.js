import { Router } from "express";
import { signIn, signUp } from "../controllers/authController.js";

import { validateUserInput } from "../middlewares/validateUserMiddleware.js";

const authRouter = Router();

authRouter.post("/sign-up", validateUserInput, signUp);
authRouter.post("/sign-in", signIn);

export default authRouter;
