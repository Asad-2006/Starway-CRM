import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "../Manager Pages/Home";
import ClosedLeads from "../Manager Pages/ClosedLeads";
import NewLeads from "../Manager Pages/NewLeads";
import NavBar_Manager from "../Components Manager/NavBar_Manager";

const DeveloperDashboard = () => {
  const [dashboardData, setDashboardData] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:7000/api/dashboard", {
          headers: { "auth-token": token },
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
      <NavBar_Manager />
      <div className="mx-">
        <Routes>
          <Route index element={<Home />} />
          <Route path="new-leads" element={<NewLeads />} />
          <Route path="leads-closed" element={<ClosedLeads />} />
          {/* <Route path="to-do-list" element={<ToDoList />} /> */}
        </Routes>
        <Outlet />
      </div>{" "}
    </div>
  );
};

export default DeveloperDashboard;
