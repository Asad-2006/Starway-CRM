import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import NavBar from "../Components Admin/NavBar";
import Home from "../Admin Pages/Home";
import Users from "../Admin Pages/Users";
import CreateUser from "../Admin Pages/CreateUser";
import NewLeads from "../Admin Pages/NewLeads";
import ClosedLeads from "../Admin Pages/ClosedLeads";
import CreateProject from "../Admin Pages/CreateProject";
import Projects from "../Admin Pages/Projects";
import Calendar from "../Admin Pages/Calendar";
import ToDoList from "../Admin Pages/ToDoList";
import AssignedLeads from "../Admin Pages/AssignedLeads";
import Compose from "../Mailing System/Compose";
import Sent from "../Mailing System/Sent";
import Inbox from "../Mailing System/Inbox";
import Whatsapp from "../Components Global/Whatsapp";
import Attendances from "../Admin Pages/Attendance";
import Docs from "../Admin Pages/Docs";
import Monthly from "../Admin Pages/MonthlyAttendance";

const AdminDashboard = () => {
  const activeMenu = true;

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
    <div className="">
      <NavBar />
      <div className="">
        <Routes>
          <Route index element={<Home />} />
          <Route path="users" element={<Users />} />
          <Route path="create-user" element={<CreateUser />} />
          <Route path="new-leads" element={<NewLeads />} />
          <Route path="closed-leads" element={<ClosedLeads />} />
          <Route path="assigned-leads" element={<AssignedLeads />} />
          <Route path="create-project" element={<CreateProject />} />
          <Route path="projects" element={<Projects />} />
          <Route path="compose" element={<Compose />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="whatsapp" element={<Whatsapp />} />
          <Route path="sent" element={<Sent />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="to-do-list" element={<ToDoList />} />
          <Route path="employee-attendances" element={<Attendances />} />
          <Route path="monthly-attendances" element={<Monthly />} />
          <Route path="employee-docs" element={<Docs />} />
        </Routes>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
