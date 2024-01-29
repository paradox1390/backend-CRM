import { Router } from "express";

import authRouter from "./authRoutes.js";
import incomingRouter from "./incomingRoutes.js";

const router = Router();

router.route("/").get((req, res) => {
  res.send(`<h2>Hello from ${req.baseUrl}</h2>`);
});

router.use("/api/v1", authRouter);
router.use("/api/v1", incomingRouter);

export default router;
