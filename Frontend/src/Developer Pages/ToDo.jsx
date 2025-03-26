import React, { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useDrag, useDrop } from "react-dnd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const ItemTypes = {
  TASK: "task",
};

const Task = ({ id, text, column, deleteTask }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { id, column },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className="bg-white p-3 rounded shadow mb-3"
      style={{
        cursor: "move",
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <div className="flex justify-between items-center">
        <span>{text}</span>
        <Button
          onClick={() => deleteTask(column, id)}
          startIcon={<DeleteIcon />}
          color="error"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

const Column = ({
  column,
  tasks,
  addTask,
  deleteTask,
  handleInputChange,
  newTaskTexts,
}) => {
  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item) => {
      console.log(`Task ${item.id} dropped into column ${column}`);
      moveTask(item.id, item.column, column);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      item: monitor.getItem(),
    }),
  });

  return (
    <div ref={drop} className="w-full md:w-1/3 bg-gray-100 p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-4">{column}</h2>
      {tasks.map((task) => (
        <Task
          key={task._id}
          id={task._id}
          text={task.text}
          column={column}
          deleteTask={deleteTask}
        />
      ))}
      <div className="mt-4">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Add a new task"
          sx={{ mb: 2 }}
          value={newTaskTexts[column]}
          onChange={(e) => handleInputChange(column, e.target.value)}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: "#2636ee",
            "&:hover": {
              bgcolor: "#212ec5",
            },
          }}
          onClick={() => addTask(column)}
          fullWidth
        >
          Add Task
        </Button>
      </div>
    </div>
  );
};

const TaskBoard = ({ userId }) => {
  const [tasks, setTasks] = useState({ TODO: [], DOING: [], DONE: [] });
  const [newTaskTexts, setNewTaskTexts] = useState({
    TODO: "",
    DOING: "",
    DONE: "",
  });

  useEffect(() => {
    fetchTasks();
  }, [userId]);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      const tasks = response.data.reduce(
        (acc, task) => {
          acc[task.column].push(task);
          return acc;
        },
        { TODO: [], DOING: [], DONE: [] }
      );
      setTasks(tasks);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  const deleteTask = async (column, id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prevTasks) => ({
        ...prevTasks,
        [column]: prevTasks[column].filter((task) => task._id !== id),
      }));
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  const addTask = async (column) => {
    if (newTaskTexts[column].trim() === "") return;

    try {
      const response = await api.post("/tasks", {
        column,
        text: newTaskTexts[column],
      });
      setTasks((prevTasks) => ({
        ...prevTasks,
        [column]: [...prevTasks[column], response.data],
      }));
      setNewTaskTexts((prevTexts) => ({
        ...prevTexts,
        [column]: "",
      }));
    } catch (error) {
      console.error("Error adding task", error);
    }
  };

  const handleInputChange = (column, value) => {
    setNewTaskTexts((prevTexts) => ({
      ...prevTexts,
      [column]: value,
    }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col md:flex-row gap-3 p-4">
        {Object.keys(tasks).map((column) => (
          <Column
            key={column}
            column={column}
            tasks={tasks[column]}
            addTask={addTask}
            deleteTask={deleteTask}
            handleInputChange={handleInputChange}
            newTaskTexts={newTaskTexts}
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default TaskBoard;
