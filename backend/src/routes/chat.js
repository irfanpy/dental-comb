import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getChatHistory, sendChat } from "../controllers/chatController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.use(requireAuth);

router.post("/", asyncHandler(sendChat));
router.get("/patients/:id", asyncHandler(getChatHistory));

export default router;
