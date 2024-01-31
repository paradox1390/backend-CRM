import { prisma } from "../prisma.js";

import { verify } from "argon2";
import asyncHandler from "express-async-handler";
import {
  mailer,
  successRegistrationMsg,
  sendConfirmedCodeMsg,
} from "../utils/email.js";

import {
  isHaveUser,
  createUser,
  getUserById,
  createConfirmedCode,
  deleteConfirmedCode,
  confirmedUser,
  getConfirmedCode,
} from "../services/authServices.js";

import { generateToken, decodedToken } from "../utils/utils.js";

export const registrationUserHandler = asyncHandler(async (req, res) => {
  console.log(req.body);
  if (await isHaveUser(req.body)) {
    res.status(409);
    throw Error("User already exists");
  }

  const user = await createUser(req.body);

  const message = successRegistrationMsg(user.email, user.password);

  const infoMailer = await mailer(message);

  const token = generateToken(user.id);

  res.json({ ...user, token });
});

export const sendConfirmedCode = asyncHandler(async (req, res) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    const decoded = decodedToken(token);
    const user = await getUserById(decoded.userId);

    if (!user) {
      res.status(401);
      throw new Error("Token failed");
    }

    if (user.confirmed) {
      res.status(200);
      res.json({ status: "user was already confirmed" });
      return;
    }
    const { confirmedCode } = await createConfirmedCode(user.id);
    const message = sendConfirmedCodeMsg(user.email, confirmedCode);
    await mailer(message);

    setTimeout(async () => {
      await deleteConfirmedCode(user.id);
    }, 1000 * 60 * 20);
    res.json({ status: "code was sent user email" });
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized. You do not have token");
  }
});

export const confirmUserHandler = asyncHandler(async (req, res) => {
  let token;
  const { code } = req.body;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    const decoded = decodedToken(token);
    const user = await getUserById(decoded.userId);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const userConfirmedCode = await getConfirmedCode(user.id);
    if (!userConfirmedCode) {
      res.status(404);
      throw new Error("Confirm code not found");
    }

    if (Number(code) === userConfirmedCode.confirmedCode) {
      const confirmUser = await confirmedUser(user.id);
      if (confirmUser.confirmed) {
        res.status(200);
        res.json({ ...confirmUser, status: "user was confirmed" });
      }
    } else {
      res.status(401);
      throw new Error("Confirm code was wrong");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized. You do not have token");
  }
});

export const loginUserHandler = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    res.status(404);
    throw new Error("email or password are not correct");
  }

  const isValidPassword = await verify(user.password, password);
  if (user && isValidPassword) {
    const token = generateToken(user.id);
    res.json({ ...user, token });
  } else {
    res.status(401);
    throw new Error("email or password are not correct");
  }
});

export const getUserHandler = asyncHandler(async (req, res) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    const decoded = decodedToken(token);
    const user = await getUserById(decoded.userId);
    console.log(user);
    if (!user) {
      res.status(401);
      throw new Error("Token failed");
    }
    res.status(200);
    res.json(user);
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized. You do not have token");
  }
});
