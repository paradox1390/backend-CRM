import { generate } from "generate-password";
import { hash } from "argon2";

import { prisma } from "../prisma.js";
import { defaultReturnUserField, generateCode } from "../utils/utils.js";

export const isHaveUser = async (body) => {
  const { email, phone } = body;

  const user = await prisma.user.findUnique({
    where: {
      email,
      phone,
    },
  });
  return user;
};

export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: defaultReturnUserField,
  });
  return user;
};

export const createUser = async (body) => {
  const { phone, email, name } = body;

  const password = generate({
    length: 10,
    numbers: true,
  });

  const user = await prisma.user.create({
    data: {
      email,
      phone,
      name,
      password: await hash(password),
      confirmed: false,
    },
    select: defaultReturnUserField,
  });

  return { ...user, password };
};

export const createConfirmedCode = async (userId) => {
  let confirmedCode = await getConfirmedCode(userId);

  if (!confirmedCode) {
    confirmedCode = await prisma.confirm.create({
      data: {
        userId: Number(userId),
        confirmedCode: generateCode(),
      },
    });
  }

  return confirmedCode;
};

export const deleteConfirmedCode = async (userId) => {
  const deleteCode = await prisma.confirm.delete({
    where: {
      userId: userId,
    },
  });

  return deleteCode;
};

export const getConfirmedCode = async (userId) => {
  const userConfirmedCode = await prisma.confirm.findUnique({
    where: {
      userId: userId,
    },
  });

  return userConfirmedCode;
};

export const confirmedUser = async (userId) => {
  const updateUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      confirmed: true,
    },
  });

  return updateUser;
};
