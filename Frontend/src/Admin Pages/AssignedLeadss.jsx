// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Eye, ChevronDown, User } from "lucide-react";

// const AssignedLeads = () => {
//   const [assignedLeads, setAssignedLeads] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("all");

//   useEffect(() => {
//     fetchAssignedLeads();
//     fetchUsers();
//   }, []);

//   const fetchAssignedLeads = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         "http://localhost:7000/api/leads/assigned",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setAssignedLeads(response.data);
//     } catch (error) {
//       console.error("Error fetching assigned leads:", error);
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         "http://localhost:7000/api/auth/admins-managers",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setUsers(response.data);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   const handleUnassign = async (leadId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(
//         `http://localhost:7000/api/leads/unassign/${leadId}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchAssignedLeads();
//     } catch (error) {
//       console.error("Error unassigning lead:", error);
//     }
//   };

//   const handleView = (leadId) => {
//     // Implement view functionality
//     console.log("Viewing lead:", leadId);
//   };

//   const getInitials = (name) => {
//     return (
//       name
//         ?.split(" ")
//         .map((n) => n[0])
//         .join("")
//         .toUpperCase() || "?"
//     );
//   };

//   const getStatusColor = (status) => {
//     return status === "ongoing"
//       ? "bg-blue-100 text-blue-800"
//       : "bg-gray-100 text-gray-800";
//   };

//   return (
//     <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-semibold text-gray-800">Assigned Leads</h2>
//         <div className="flex gap-4">
//           {/* Status Filter */}
//           <select
//             className="border rounded-lg px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={selectedStatus}
//             onChange={(e) => setSelectedStatus(e.target.value)}
//           >
//             <option value="all">All Status</option>
//             <option value="ongoing">Ongoing</option>
//             <option value="closed">Closed</option>
//           </select>

//           {/* User Filter */}
//           <select
//             className="border rounded-lg px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={selectedUser}
//             onChange={(e) => setSelectedUser(e.target.value)}
//           >
//             <option value="">All Users</option>
//             {users.map((user) => (
//               <option key={user._id} value={user._id}>
//                 {user.username}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Leads Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Lead Name
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Email
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Assigned To
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Assigned By
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {assignedLeads
//               .filter((lead) =>
//                 selectedUser ? lead.assignedTo?._id === selectedUser : true
//               )
//               .filter((lead) =>
//                 selectedStatus !== "all" ? lead.status === selectedStatus : true
//               )
//               .map((lead) => (
//                 <tr key={lead._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="h-10 w-10 flex-shrink-0">
//                         <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
//                           {getInitials(lead.leadName)}
//                         </div>
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">
//                           {lead.leadName || "N/A"}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {lead.email || "N/A"}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
//                         <User className="h-4 w-4 text-gray-500" />
//                       </div>
//                       <span className="ml-2 text-sm text-gray-900">
//                         {lead.assignedTo?.username || "Not Assigned"}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
//                         <User className="h-4 w-4 text-gray-500" />
//                       </div>
//                       <span className="ml-2 text-sm text-gray-900">
//                         {lead.assignedBy?.username || "Unknown"}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
//                         lead.status
//                       )}`}
//                     >
//                       {lead.status || "N/A"}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => handleView(lead._id)}
//                         className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                       >
//                         <Eye className="h-4 w-4 mr-1" />
//                         View
//                       </button>
//                       <button
//                         onClick={() => handleUnassign(lead._id)}
//                         className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                       >
//                         Unassign
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AssignedLeads;
