import { useState, useEffect } from "react";
import {
  BarChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ScatterChart,
  Scatter,
} from "recharts";
import {
  ArrowUpIcon,
  UsersIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaUser } from "react-icons/fa";

function App() {
  const [totalLeads, setTotalLeads] = useState(0);
  const [closedLeads, setClosedLeads] = useState(0);
  const [newLeads, setNewLeads] = useState(0);
  const [activeProjectsCount, setActiveProjectsCount] = useState(0);
  const [leadData, setLeadData] = useState([]);
  const [userLeads, setUserLeads] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [recentLeads, setRecentLeads] = useState([]);
  const [closedLeadsData, setClosedLeadsData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState("");
  const [closedLeadsByDate, setClosedLeadsByDate] = useState([]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000";

  useEffect(() => {
    const fetchClosedLeads = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/leads/closed-leads-count`
        );
        if (!response.ok) throw new Error("Failed to fetch closed leads count");
        const data = await response.json();
        setClosedLeadsData(data);

        const months = Object.keys(data);
        if (months.length > 0) setSelectedMonth(months[0]);
      } catch (error) {
        console.error("Error fetching closed leads count:", error);
        setClosedLeadsData({});
      }
    };

    fetchClosedLeads();
  }, []);

  useEffect(() => {
    const fetchClosedLeadsByDate = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/leads/closed-leads-by-date`
        );
        if (!response.ok)
          throw new Error("Failed to fetch closed leads by date");
        const data = await response.json();
        setClosedLeadsByDate(data);
      } catch (error) {
        console.error("Error fetching closed leads by date:", error);
      }
    };

    fetchClosedLeadsByDate();
  }, []);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/leads/recent-leads`);
        const data = await response.json();
        setRecentLeads(data);
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };

    fetchLeads();
  }, []);

  useEffect(() => {
    const fetchActiveProjects = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/newproject/active-projects`
        );
        const data = await response.json();
        setActiveProjects(data);
      } catch (error) {
        console.error("Error fetching active projects:", error);
      }
    };

    fetchActiveProjects();
  }, []);

  useEffect(() => {
    const fetchLeadsByUser = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/leads/leads-by-user`);
        const data = await response.json();

        const formattedData = data.map((item) => ({
          user: item._id || "Unknown",
          leads: item.count,
        }));

        setUserLeads(formattedData);
      } catch (error) {
        console.error("Error fetching leads by user:", error);
      }
    };

    fetchLeadsByUser();
  }, []);

  useEffect(() => {
    const fetchLeadTrends = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/leads/lead-trends`);
        const data = await response.json();

        const formattedData = data.map((item) => ({
          name: item._id,
          leads: item.count,
        }));

        setLeadData(formattedData);
      } catch (error) {
        console.error("Error fetching lead trends:", error);
      }
    };

    fetchLeadTrends();
  }, []);

  useEffect(() => {
    const fetchTotalLeads = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/leads/total-leads`);
        setTotalLeads(response.data.totalLeads);
      } catch (error) {
        console.error("Error fetching total leads:", error);
      }
    };

    fetchTotalLeads();
  }, []);

  useEffect(() => {
    const fetchClosedLeads = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/leads/total-closed-leads`
        );
        setClosedLeads(response.data.totalClosedLeads);
      } catch (error) {
        console.error("Error fetching closed leads:", error);
      }
    };

    fetchClosedLeads();
  }, []);

  useEffect(() => {
    const fetchNewLeads = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/leads/new-leads-this-month`
        );
        setNewLeads(response.data.totalNewLeads);
      } catch (error) {
        console.error("Error fetching new leads this month:", error);
      }
    };

    fetchNewLeads();
  }, []);

  useEffect(() => {
    const fetchActiveProjectsCount = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/newproject/active-projects-count`
        );
        const data = await response.json();
        setActiveProjectsCount(data.count);
      } catch (error) {
        console.error("Error fetching active projects count:", error);
      }
    };

    fetchActiveProjectsCount();
  }, []);

  const displayedData = closedLeadsData[selectedMonth]
    ? [{ date: selectedMonth, count: closedLeadsData[selectedMonth] }]
    : [];

  const closedLeadsChart = (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg mb-1">
      <h3 className="text-xl font-bold text-indigo-900 mb-4 md:mb-6">
        Closed Leads
      </h3>
      {closedLeadsByDate.length === 0 ? (
        <p className="text-gray-500 text-center">
          No closed leads data available.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="date"
              stroke="#4B5563"
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis dataKey="count" stroke="#4B5563" domain={[0, "auto"]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #E2E8F0",
                borderRadius: "0.5rem",
              }}
              formatter={(value, name, props) => [
                `${value} lead${value !== 1 ? "s" : ""} closed`,
                `Date: ${props.payload.date}`,
              ]}
            />
            <Scatter data={closedLeadsByDate} fill="#4F46E5" shape="circle" />
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-indigo-900">
          Dashboard Overview
        </h1>
        <p className="text-indigo-600">Welcome back, Admin</p>
      </div>

      {/* card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-4 md:p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-indigo-200">Total Leads</p>
              <p className="text-3xl md:text-4xl font-bold mt-2">
                {totalLeads.toLocaleString()}
              </p>
            </div>
            <UsersIcon className="h-10 w-10 md:h-12 md:w-12 text-indigo-300" />
          </div>
          <div className="mt-4 flex items-center text-indigo-200">
            <ArrowUpIcon className="h-4 w-4 mr-1" />
            <Link to="/dashboard-admin/new-leads">
              <span className="hover:text-white hover:border-b">
                View Leads
              </span>
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 md:p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-orange-100">Closed Leads</p>
              <p className="text-3xl md:text-4xl font-bold mt-2">
                {closedLeads}
              </p>
            </div>
            <CheckCircleIcon className="h-10 w-10 md:h-12 md:w-12 text-orange-300" />
          </div>
          <div className="mt-4 flex items-center text-orange-100">
            <ArrowUpIcon className="h-4 w-4 mr-1" />
            <Link to="/dashboard-admin/closed-leads">
              <span className="hover:text-white hover:border-b">
                View Closed Leads
              </span>
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 p-4 md:p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-indigo-200">New This Month</p>
              <p className="text-3xl md:text-4xl font-bold mt-2">{newLeads}</p>
            </div>
            <ChartBarIcon className="h-10 w-10 md:h-12 md:w-12 text-indigo-300" />
          </div>
          <div className="mt-4 flex items-center text-indigo-200">
            <ArrowUpIcon className="h-4 w-4 mr-1" />
            <Link to="/dashboard-admin/new-leads">
              <span className="hover:text-white hover:border-b">
                View Leads
              </span>
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 md:p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-red-100">Active Projects</p>
              <p className="text-3xl md:text-4xl font-bold mt-2">
                {activeProjectsCount}
              </p>
            </div>
            <CurrencyDollarIcon className="h-10 w-10 md:h-12 md:w-12 text-red-300" />
          </div>
          <div className="mt-4 flex items-center text-red-100">
            <ArrowUpIcon className="h-4 w-4 mr-1" />
            <Link to="/dashboard-admin/projects">
              <span className="hover:text-white hover:border-b">
                View Projects
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-indigo-900 mb-4 md:mb-6">
            Lead Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={leadData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#4B5563" />
              <YAxis stroke="#4B5563" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #E2E8F0",
                  borderRadius: "0.5rem",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="leads"
                stroke="#4F46E5"
                strokeWidth={3}
                dot={{ fill: "#4F46E5", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-indigo-900 mb-4 md:mb-6">
            Leads by User
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userLeads}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="user" stroke="#4B5563" />
              <YAxis stroke="#4B5563" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #E2E8F0",
                  borderRadius: "0.5rem",
                }}
              />
              <Legend />
              <Bar
                dataKey="leads"
                fill="url(#colorGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F97316" />
                  <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* project table  */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-4 md:p-6 rounded-3xl shadow-xl border border-gray-200">
          <h3 className="text-xl font-bold text-indigo-900 mb-4 md:mb-4">
            Active Projects
          </h3>
          <div className="overflow-x-auto">
            <div className="max-h-84 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <table className="min-w-full border-collapse">
                <thead className="sticky top-0 bg-gray-100">
                  <tr className="text-left text-gray-600 text-sm uppercase">
                    <th className="px-4 py-3 font-semibold">Project</th>
                    <th className="px-4 py-3 font-semibold">Assigned To</th>
                    <th className="px-4 py-3 font-semibold">Subscription</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Created By</th>
                  </tr>
                </thead>
                <tbody>
                  {activeProjects.map((project, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-all border-b border-gray-200"
                    >
                      <td className="px-4 py-4 font-medium text-gray-800">
                        {project.projectName}
                      </td>
                      <td className="px-4 py-4 flex items-center space-x-2 text-gray-700">
                        <FaUser className="text-gray-500" />
                        <span>
                          {project.assignedDeveloper?.username || "Unassigned"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        {project.subscriptionType || "N/A"}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            project.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : project.status === "At Risk"
                              ? "bg-red-100 text-red-700"
                              : project.status === "Closed"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-700">
                        {project.createdBy || "Unknown"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* new leads table  */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-indigo-900 mb-4 md:mb-6">
            Recent Leads
          </h3>
          <div className="max-h-[350px] overflow-y-auto rounded-lg">
            <table className="w-full">
              <thead className="sticky top-0 bg-indigo-50 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                    Lead Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                    Lead Owner
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-100">
                {recentLeads.map((lead) => (
                  <tr
                    key={lead._id}
                    className="hover:bg-indigo-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-4 flex items-center">
                      <FaUserCircle className="h-8 w-8 text-indigo-400 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {lead.leadName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {lead.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          lead.leadType === "Hot Lead"
                            ? "bg-red-100 text-red-800"
                            : lead.leadType === "New Lead"
                            ? "bg-green-200 text-green-800"
                            : lead.leadType === "Contacted"
                            ? "bg-yellow-100 text-yellow-800"
                            : lead.leadType === "Callback"
                            ? "bg-yellow-100 text-yellow-800"
                            : lead.leadType === "Contact in Future"
                            ? "bg-purple-200 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {lead.leadType}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {lead.leadOwner}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* closed lead chart */}
      {/* <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg mb-8">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h3 className="text-xl font-bold text-indigo-900">
            Closed Leads Count
          </h3>
          <select
            className="px-4 py-2 rounded-lg border border-indigo-200 text-indigo-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {Object.keys(closedLeadsData).map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        {displayedData.length === 0 ? (
          <p className="text-gray-500 text-center">
            No closed leads data available.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={displayedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" stroke="#4B5563" />
              <YAxis stroke="#4B5563" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #E2E8F0",
                  borderRadius: "0.5rem",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#4F46E5"
                strokeWidth={3}
                dot={{ fill: "#4F46E5", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div> */}
      <div className=" p-4 md:p-8">{closedLeadsChart}</div>
    </div>
  );
}

export default App;
