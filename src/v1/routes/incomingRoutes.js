import { Router } from "express";

import { postIncomingHandler } from "../../controllers/incomingController.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.post("/incoming", postIncomingHandler);

export default router;
