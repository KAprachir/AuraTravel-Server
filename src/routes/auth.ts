import { Router } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../config/auth.js";

const authRouter = Router();

authRouter.all("*", toNodeHandler(auth));

export default authRouter;
