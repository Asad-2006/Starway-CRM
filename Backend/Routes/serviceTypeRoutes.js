import express from "express";
import {
  createServiceType,
  getServiceTypes,
  deleteServiceType,
} from "../Controllers/serviceTypeController.js";

const router = express.Router();

router.post("/servicetypes", createServiceType);
router.get("/servicetypes", getServiceTypes);
router.delete("/servicetypes/:name", deleteServiceType);

export default router;
