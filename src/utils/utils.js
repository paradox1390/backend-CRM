import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.SECRET_TOKEN, { expiresIn: "1d" });
};

export const decodedToken = (token) => {
  return jwt.verify(token, process.env.SECRET_TOKEN);
};

export const generateCode = (min = 100000, max = 999999) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const defaultReturnUserField = {
  id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  phone: true,
  email: true,
  confirmed: true,
};
