import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../Components Developer/NavBar";
import Home from "../Developer Pages/Home";
import OneTime from "../Developer Pages/OneTime";
import Subscription from "../Developer Pages/Subscription";
import Website from "../Developer Pages/Website";
import ToDoList from "../Developer Pages/ToDo";
import Calendar from "../Caller Pages/Calender";
import Compose from "../Mailing System/Compose";
import Sent from "../Mailing System/Sent";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

const DeveloperDashboard = () => {
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
      <NavBar />
      <div className="mx-">
        <Routes>
          <Route index element={<Home />} />
          <Route path="one-time" element={<OneTime />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="website-based" element={<Website />} />
          <Route path="to-do-list" element={<ToDoList />} />
          <Route path="calender" element={<Calendar />} />
          <Route path="compose" element={<Compose />} />
          <Route path="sent" element={<Sent />} />
        </Routes>
        <Outlet />
      </div>
    </div>
  );
};

export default DeveloperDashboard;
