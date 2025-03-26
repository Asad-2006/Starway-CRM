import React, { useState } from "react";
import assets from "../assets/assets";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import CloseIcon from "@mui/icons-material/Close";
import Sidebar from "react-sidebar";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <header className="p-4 lg:px-9 sticky top-0 flex justify-between items-center bg-white z-50 shadow-md relative">
        <div className="flex items-center space-x-2">
          <MenuOpenIcon
            className="text-indigo-800 cursor-pointer text-5xl"
            onClick={() => setSidebarOpen(true)}
          />
          <img className="w-30 h-10" src={assets.logo} alt="Logo" />
        </div>
        <p className="hidden sm:block md:text-xl lg:text-2xl font-medium text-indigo-800 absolute left-1/2 -translate-x-1/2">
          Hey! Manager, Sup ?
        </p>
        <div className="hidden md:block">
          <button className="w-22 h-10 rounded-2xl cursor-pointer text-white bg-indigo-600 hover:bg-indigo-500 px-4">
            Logout
          </button>
        </div>
      </header>

      <Sidebar
        sidebar={<SidebarContent setSidebarOpen={setSidebarOpen} />}
        open={sidebarOpen}
        onSetOpen={setSidebarOpen}
        styles={{
          sidebar: {
            background: "#f8fafc",
            width: "260px",
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
            backdropFilter: "blur(5px)",
            zIndex: 50,
          },
        }}
      />
    </>
  );
};

const SidebarContent = ({ setSidebarOpen }) => {
  const [projectDropdown, setProjectDropdown] = useState(false);

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
        <li className="text-gray-700 hover:text-indigo-600 cursor-pointer p-2 rounded-md hover:bg-gray-200">
          <Link
            to="/dashboard-team-manager"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center"
          >
            <WidgetsOutlinedIcon /> Home
          </Link>
        </li>

        <li className="text-gray-700 hover:text-indigo-600 cursor-pointer p-2 rounded-md hover:bg-gray-200">
          <Link
            to="/dashboard-team-manager/new-leads"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center"
          >
            <CalendarTodayOutlinedIcon /> New Leads
          </Link>
        </li>

        <li className="text-gray-700 hover:text-indigo-600 cursor-pointer p-2 rounded-md hover:bg-gray-200">
          <Link
            to="/dashboard-team-manager/leads-closed"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center"
          >
            <EventAvailableOutlinedIcon /> Closed Leads
          </Link>
        </li>

        {/* <li className="text-gray-700 hover:text-indigo-600 cursor-pointer p-2 rounded-md hover:bg-gray-200">
          <Link
            to="/dashboard-caller/to-do-list"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center"
          >
            <InventoryOutlinedIcon /> To Do List
          </Link>
        </li> */}

        <li className="text-gray-700 hover:text-indigo-600 cursor-pointer p-2 rounded-md hover:bg-gray-200">
          <Link
            to="/logout"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center"
          >
            <LogoutOutlinedIcon /> Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default NavBar;
