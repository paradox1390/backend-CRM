import { Router } from "express";
import {
  loginUserHandler,
  registrationUserHandler,
  confirmUserHandler,
  sendConfirmedCode,
} from "../../controllers/authController.js";

const router = Router();

router.post("/registration", registrationUserHandler);
router.post("/send-code", sendConfirmedCode);
router.post("/confirm", confirmUserHandler);
router.post("/login", loginUserHandler);

export default router;
