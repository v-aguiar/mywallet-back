import { Router } from "express";
import cors from "cors";

import { signIn, signUp } from "../controllers/authController.js";
import { validateUserInput } from "../middlewares/validateUserMiddleware.js";

const authRouter = Router();

authRouter.post("/sign-up", cors(), validateUserInput, signUp);
authRouter.post("/sign-in", cors(), signIn);

export default authRouter;
