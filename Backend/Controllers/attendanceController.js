import Employee from "../models/EmployeeModel.js";
import Attendance from "../models/Attendance.js";

export const addEmployee = async (req, res) => {
  try {
    const employee = new Employee({ name: req.body.name });
    await employee.save();
    res.status(201).send(employee);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.send(employees);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const addAttendance = async (req, res) => {
  try {
    const attendance = new Attendance(req.body);
    await attendance.save();
    res.status(201).send(attendance);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const getAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    const attendance = await Attendance.find({ date: new Date(date) }).populate(
      "employeeId"
    );
    res.send(attendance);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
