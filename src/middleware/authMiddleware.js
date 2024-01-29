import asyncHandler from "express-async-handler";
import { prisma } from "../prisma.js";
import { decodedToken, defaultReturnUserField } from "../utils/utils.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    const decoded = decodedToken(token);

    const userFound = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: defaultReturnUserField,
    });

    if (!userFound.confirmed) {
      res.status(401);
      throw new Error("Not authorized. User not confirmed");
    }

    if (userFound) {
      req.user = userFound;
      next();
    } else {
      res.status(401);
      throw new Error("Not authorized. token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized. You do not have token");
  }
});
