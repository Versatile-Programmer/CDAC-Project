import {Router} from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js"
const mainRouter = Router();

mainRouter.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
});

mainRouter.use("/api/v1/auth", authRoutes);
mainRouter.use("/api/users",userRoutes);
export default mainRouter;