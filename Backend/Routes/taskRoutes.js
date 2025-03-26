import express from "express";
import { verifyToken } from "../Middlewares/AuthMiddleware.js";
import Task from "../Models/TaskModel.js";

const router = express.Router();

//get all task
router.get("/tasks", verifyToken, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized access" });
  }
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});

// add a task
router.post("/tasks", verifyToken, async (req, res) => {
  const { column, text } = req.body;
  try {
    const newTask = new Task({
      userId: req.user.id,
      column,
      text,
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Error adding task", error });
  }
});

// delete a task
router.delete("/tasks/:id", verifyToken, async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;

  try {
    const task = await Task.findOneAndDelete({ _id: taskId, userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
});

export default router;
