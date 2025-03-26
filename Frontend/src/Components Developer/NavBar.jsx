import React, { useState, useEffect } from "react";
import assets from "../assets/assets";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Sidebar from "react-sidebar";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import AssignmentLateOutlinedIcon from "@mui/icons-material/AssignmentLateOutlined";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const NavBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [username, setUsername] = useState("Admin");
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(`${API_BASE}/api/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsername(response.data.username);
      } catch (error) {
        console.error("Failed to fetch user details", error);
      }
    };

    fetchUser();
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <header className="p-4 lg:px-9 sticky top-0 flex justify-between items-center bg-white z-50 shadow-md relative">
        <div className="flex items-center space-x-2">
          <MenuOpenIcon
            className="text-indigo-800 cursor-pointer text-6xl"
            onClick={() => setSidebarOpen(true)}
          />
          <img
            className="w-30 h-10 sm:ml-3 sm:hover:scale-120 transition duration-300 ease-in-out"
            src={assets.logo}
            alt="Logo"
          />
        </div>
        <p className="hidden sm:block md:text-xl lg:text-2xl font-medium text-indigo-800 absolute left-1/2 -translate-x-1/2">
          Hey! {username}, Sup ?
        </p>
        <div className="hidden md:block">
          <button
            onClick={handleLogout}
            className="w-22 h-10 rounded-sm cursor-pointer text-white bg-[#2636ee] hover:bg-indigo-500 px-4 hover:bg-red-500 hover:text-white hover:scale-110 transition duration-300 ease-in-out"
          >
            Logout
          </button>
        </div>
      </header>

      <Sidebar
        sidebar={
          <SidebarContent
            setSidebarOpen={setSidebarOpen}
            onLogout={handleLogout}
          />
        }
        open={sidebarOpen}
        onSetOpen={setSidebarOpen}
        styles={{
          sidebar: {
            background: "#f8fafc",
            width: "290px",
            padding: "20px",
            boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
            borderRadius: "8px 0 0 8px",
            zIndex: 60,
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            overflowY: "auto",
          },
          overlay: {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
            zIndex: 50,
          },
        }}
      />
    </>
  );
};

const SidebarContent = ({ setSidebarOpen, onLogout }) => {
  const [projectDropdown, setProjectDropdown] = useState(false);
  const [isMailingOpen, setMailingOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMailingDropdown = () => {
    setMailingOpen(!isMailingOpen);
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{
        overflowY: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <div className="sticky top-0 flex justify-between items-center mb-6 border-b pb-4 bg-[#f8fafc]">
        <h2 className="text-xl font-semibold text-indigo-800">Dashboard</h2>
        <CloseIcon
          className="cursor-pointer text-indigo-800"
          onClick={() => setSidebarOpen(false)}
        />
      </div>
      <ul className="space-y-4">
        <li
          className={`${
            isActive("/dashboard-developer")
              ? "bg-indigo-100 text-indigo-600"
              : "text-gray-700 hover:text-indigo-600"
          } cursor-pointer p-2 rounded-md hover:bg-gray-200`}
        >
          <Link
            to="/dashboard-developer"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center"
          >
            <WidgetsOutlinedIcon className="mr-1" /> Home
          </Link>
        </li>
        <li
          className={`${
            isActive("/dashboard-developer/one-time")
              ? "bg-indigo-100 text-indigo-600"
              : "text-gray-700 hover:text-indigo-600"
          } cursor-pointer p-2 rounded-md hover:bg-gray-200`}
        >
          <Link
            to="/dashboard-developer/one-time"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center"
          >
            <AccountTreeOutlinedIcon className="mr-1" /> One-Time Projects
          </Link>
        </li>
        <li
          className={`${
            isActive("/dashboard-developer/subscription")
              ? "bg-indigo-100 text-indigo-600"
              : "text-gray-700 hover:text-indigo-600"
          } cursor-pointer p-2 rounded-md hover:bg-gray-200`}
        >
          <Link
            to="/dashboard-developer/subscription"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center"
          >
            <AccountTreeOutlinedIcon className="mr-1" /> Subscription Based
          </Link>
        </li>
        <li
          className={`${
            isActive("/dashboard-developer/website-based")
              ? "bg-indigo-100 text-indigo-600"
              : "text-gray-700 hover:text-indigo-600"
          } cursor-pointer p-2 rounded-md hover:bg-gray-200`}
        >
          <Link
            to="/dashboard-developer/website-based"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center"
          >
            <AccountTreeOutlinedIcon className="mr-1" /> Website Based
          </Link>
        </li>

        <li
          className={`${
            isActive("/dashboard-developer/compose")
              ? "bg-indigo-100 text-indigo-600"
              : "text-gray-700 hover:text-indigo-600"
          } cursor-pointer p-2 rounded-md hover:bg-gray-200`}
        >
          <Link
            to="/dashboard-developer/compose"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center"
          >
            <MailOutlineIcon className="mr-1" /> Compose Mail
          </Link>
        </li>
        <li
          className={`${
            isActive("/dashboard-developer/calendar")
              ? "bg-indigo-100 text-indigo-600"
              : "text-gray-700 hover:text-indigo-600"
          } cursor-pointer p-2 rounded-md hover:bg-gray-200`}
        >
          <Link
            to="/dashboard-developer/calender"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center"
          >
            <CalendarMonthOutlinedIcon className="mr-1" /> Calendar
          </Link>
        </li>
        <li
          className={`${
            isActive("/dashboard-developer/to-do-list")
              ? "bg-indigo-100 text-indigo-600"
              : "text-gray-700 hover:text-indigo-600"
          } cursor-pointer p-2 rounded-md hover:bg-gray-200`}
        >
          <Link
            to="/dashboard-Developer/to-do-list"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center"
          >
            <InventoryOutlinedIcon className="mr-1" /> To Do List
          </Link>
        </li>
        <li className="text-gray-700 hover:text-red-600 cursor-pointer p-2 rounded-md hover:bg-gray-200">
          <button
            onClick={onLogout}
            className="flex items-center w-full text-left"
          >
            <LogoutOutlinedIcon className="mr-1" /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default NavBar;
