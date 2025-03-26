import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/Admindashboard";
import CallerDashboard from "./pages/CallerDashboard";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";

// ProtectedRoute component checks if a user is authenticated and authorized
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/" />;
  }

  // If allowedRoles is specified and user's role isn't included, redirect to login
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  // If checks pass, render the protected content
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard-admin/*"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard-caller/*"
          element={
            <ProtectedRoute allowedRoles={["caller"]}>
              <CallerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard-developer/*"
          element={
            <ProtectedRoute allowedRoles={["developer"]}>
              <DeveloperDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard-team-manager/*"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
