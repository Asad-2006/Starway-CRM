// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Eye } from "lucide-react";

// const ClosedLeads = () => {
//   const [closedLeads, setClosedLeads] = useState([]);

//   useEffect(() => {
//     const fetchClosedLeads = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:7000/api/leads/closed",
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         console.log("API Response:", response.data);
//         setClosedLeads(Array.isArray(response.data) ? response.data : []);
//       } catch (error) {
//         console.error("Error fetching closed leads:", error);
//         setClosedLeads([]);
//       }
//     };

//     fetchClosedLeads();
//   }, []);

//   return (
//     <div className="container mx-auto p-8">
//       <input
//         type="text"
//         placeholder="Search Leads"
//         className="w-full px-4 py-2 border rounded-md mb-4"
//       />
//       {closedLeads.length > 0 ? (
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           {closedLeads.map((lead) => (
//             <div
//               key={lead._id}
//               className="flex items-center p-4 border-b last:border-b-0"
//             >
//               <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold uppercase mr-4">
//                 {lead.leadName ? lead.leadName[0] : "?"}
//               </div>
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-800">
//                   {lead.leadName}
//                 </h2>
//                 <div className="text-gray-600 text-sm">
//                   Email: {lead.email}
//                   <br />
//                   Phone: {lead.phoneNumber}
//                   <br />
//                   Location: USA
//                 </div>
//               </div>
//               <div className="ml-auto">
//                 <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
//                   <Eye className="mr-2 h-5 w-5" />
//                   View
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="text-gray-500 italic">No closed leads found.</div>
//       )}
//     </div>
//   );
// };

// export default ClosedLeads;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { User } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   Avatar,
//   Typography,
//   TextField,
// } from "@mui/material";

// const ClosedLeads = () => {
//   const [closedLeads, setClosedLeads] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedLead, setSelectedLead] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     const fetchClosedLeads = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:7000/api/leads/closed",
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         setClosedLeads(response.data || []);
//       } catch (error) {
//         console.error("Error fetching closed leads:", error);
//         setClosedLeads([]);
//       }
//     };

//     fetchClosedLeads();
//   }, []);

//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const handleViewClick = (lead) => {
//     console.log("View button clicked"); // Debugging log
//     setSelectedLead(lead);
//     setIsModalOpen(true); // Open the modal
//   };

//   const handleClose = () => {
//     setIsModalOpen(false);
//     setSelectedLead(null);
//   };

//   const filteredLeads = closedLeads.filter((lead) =>
//     lead.leadName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="container mx-auto px-4">
//       <TextField
//         label="Search Lead Name"
//         variant="outlined"
//         fullWidth
//         margin="normal"
//         onChange={handleSearch}
//         value={searchTerm}
//       />
//       {filteredLeads.length > 0 ? (
//         <div className="grid pt-4 rounded-xl grid-cols-1 gap-6">
//           {filteredLeads.map((lead) => (
//             <Card
//               key={lead._id}
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 width: "100%",
//                 boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
//                 transition: "transform 0.3s",
//                 padding: "10px",
//               }}
//             >
//               <Avatar sx={{ width: 60, height: 60, margin: 2 }}>
//                 <User />
//               </Avatar>
//               <CardContent sx={{ flex: "1 0 auto", textAlign: "left" }}>
//                 <Typography component="div" variant="h6">
//                   {lead.leadName}
//                 </Typography>
//                 <Typography variant="subtitle1" color="text.secondary">
//                   {lead.email}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   {lead.phoneNumber}
//                 </Typography>
//                 <Typography variant="body2" color="text.primary">
//                   <strong>Assigned To:</strong>{" "}
//                   {lead.assignedTo ? lead.assignedTo.username : "Not Assigned"}
//                 </Typography>
//                 <Typography variant="body2" color="text.primary">
//                   <strong>Assigned By:</strong>{" "}
//                   {lead.assignedBy ? lead.assignedBy.username : "Unknown"}
//                 </Typography>
//               </CardContent>
//               <button
//                 onClick={() => handleViewClick(lead)}
//                 className="mr-8 bg-indigo-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//               >
//                 View
//               </button>
//             </Card>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-8">
//           <p className="text-gray-500">No closed leads found.</p>
//         </div>
//       )}

//       {/* Modal */}
//       {isModalOpen && selectedLead && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-xl font-semibold">Lead Details</h2>
//             <div className="mt-4">
//               <p className="text-lg font-bold">{selectedLead.leadName}</p>
//               <p>Email: {selectedLead.email}</p>
//               <p>Phone: {selectedLead.phoneNumber}</p>
//               <p>Website: {selectedLead.website || "N/A"}</p>
//               <p>Designation: {selectedLead.designation || "N/A"}</p>
//               <p>Country: {selectedLead.country}</p>
//               <p>Lead Type: {selectedLead.leadType}</p>
//               <p>Packages: {selectedLead.packages.join(", ")}</p>
//               <p>Note: {selectedLead.note}</p>
//               <p>Pitched Amount: ${selectedLead.pitchedAmount}</p>
//               <p>
//                 Assigned To:{" "}
//                 {selectedLead.assignedTo
//                   ? selectedLead.assignedTo.username
//                   : "Not Assigned"}
//               </p>
//               <p>
//                 Assigned By:{" "}
//                 {selectedLead.assignedBy
//                   ? selectedLead.assignedBy.username
//                   : "Unknown"}
//               </p>
//               <p>Status: {selectedLead.status}</p>
//             </div>
//             <div className="flex justify-end mt-4">
//               <button
//                 onClick={handleClose}
//                 className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ClosedLeads;
