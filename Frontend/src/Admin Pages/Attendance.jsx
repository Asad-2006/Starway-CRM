import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  Typography,
  Container,
  Box,
  Button,
} from "@mui/material";

const AttendanceManager = () => {
  const [users, setUsers] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceStatus, setAttendanceStatus] = useState({}); // Store status for each user

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:7000/api/attendance/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(response.data);

      // Initialize attendance status for each user
      const initialStatus = {};
      response.data.forEach((user) => {
        initialStatus[user._id] = "present"; // Default status
      });
      setAttendanceStatus(initialStatus);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const handleStatusChange = (userId, status) => {
    setAttendanceStatus((prevStatus) => ({
      ...prevStatus,
      [userId]: status,
    }));
  };

  const markAttendance = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const status = attendanceStatus[userId];
      await axios.post(
        "http://localhost:7000/api/attendance/mark-attendance",
        { userId, date, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Attendance marked successfully");
    } catch (error) {
      console.error("Failed to mark attendance", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Manage Attendance
      </Typography>
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    value={attendanceStatus[user._id] || "present"}
                    onChange={(e) =>
                      handleStatusChange(user._id, e.target.value)
                    }
                    fullWidth
                  >
                    <MenuItem value="present">Present</MenuItem>
                    <MenuItem value="absent">Absent</MenuItem>
                    <MenuItem value="on leave">On Leave</MenuItem>
                    <MenuItem value="holiday">Holiday</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => markAttendance(user._id)}
                  >
                    Save
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AttendanceManager;
