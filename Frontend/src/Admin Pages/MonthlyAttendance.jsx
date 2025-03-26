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
  Typography,
  Container,
  Box,
} from "@mui/material";

const MonthlyAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchMonthlyAttendance();
  }, [month, year]);

  const fetchMonthlyAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/attendance/monthly-attendance", {
        params: { month, year },
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Response:", response.data); // Log the response
      setAttendance(response.data);
    } catch (error) {
      console.error("Failed to fetch monthly attendance", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Monthly Attendance
      </Typography>
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Month"
          type="number"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          sx={{ mr: 2 }}
        />
        <TextField
          label="Year"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendance.map((record) => (
              <TableRow key={record._id}>
                <TableCell>
                  {record.userId ? record.userId.username : "Unknown User"}
                </TableCell>
                <TableCell>
                  {new Date(record.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{record.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default MonthlyAttendance;
