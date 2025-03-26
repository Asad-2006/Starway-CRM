import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "../Components Caller/NavBar_Caller";
import AddLeads from "../Caller Pages/AddLeads";
import ClosedLeads from "../Caller Pages/ClosedLeads";
import Home from "../Caller Pages/Home";
import AllLeads from "../Caller Pages/AllLeads";
import ToDoList from "../Caller Pages/ToDoList";
import Calendar from "../Caller Pages/Calender";
import Compose from "../Mailing System/Compose";
import Sent from "../Mailing System/Sent";

const CallerDashboard = () => {
  const [dashboardData, setDashboardData] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:7000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardData(res.data.dashboard);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="mx-">
        <Routes>
          <Route index element={<Home />} />
          <Route path="add-leads" element={<AddLeads />} />
          <Route path="all-leads" element={<AllLeads />} />
          <Route path="leads-closed" element={<ClosedLeads />} />
          <Route path="to-do-list" element={<ToDoList />} />
          <Route path="calender" element={<Calendar />} />
          <Route path="compose" element={<Compose />} />
          {/* <Route path="sent" element={<Sent />} /> */}
        </Routes>
        <Outlet />
      </div>
    </div>
  );
};

export default CallerDashboard;
