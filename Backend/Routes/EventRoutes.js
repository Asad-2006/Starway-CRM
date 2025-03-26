import express from "express";
import { verifyToken } from "../Middlewares/AuthMiddleware.js";
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} from "../Controllers/EventController.js";

const router = express.Router();

router.post("/events", verifyToken, createEvent);

router.get("/events", verifyToken, getEvents);

router.put("/events/:id", verifyToken, updateEvent);

router.delete("/events/:id", verifyToken, deleteEvent);

export default router;
