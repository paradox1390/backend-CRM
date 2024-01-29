import { prisma } from "../prisma.js";
import asyncHandler from "express-async-handler";

export const postIncomingHandler = asyncHandler(async (req, res) => {
  res.json({ incoming: "access" });
});
