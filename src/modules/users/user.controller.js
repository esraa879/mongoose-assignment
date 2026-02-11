import { Router } from "express";
import * as US from "./user.service.js";
import { auth } from "../../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.post("/signup", US.signUp);
userRouter.post("/login", US.login);

userRouter.patch("/", auth, US.updateUser);
userRouter.delete("/", auth, US.deleteUser);
userRouter.get("/", auth, US.getUser);

export default userRouter;
