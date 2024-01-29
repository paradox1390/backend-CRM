import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./src/prisma.js";

import { errorHandler, notFound } from "./src/middleware/errorHandler.js";

import v1Router from "./src/v1/routes/index.js";

const app = express();
const PORT = process.env.PORT;

async function main() {
  app.use(cors());
  app.use(express.json());
  app.use(v1Router);
  app.use(notFound);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`server started on PORT ${PORT}`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    process.exit(1);
  });
