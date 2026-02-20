import { Router } from "express";
import {
  createPatient,
  deletePatient,
  getPatient,
  listPatients,
  updatePatient,
} from "../controllers/patientController.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.use(requireAuth);

router.post("/", asyncHandler(createPatient));
router.get("/", asyncHandler(listPatients));
router.get("/:id", asyncHandler(getPatient));
router.put("/:id", asyncHandler(updatePatient));
router.delete("/:id", asyncHandler(deletePatient));

export default router;
