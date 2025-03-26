// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   CircularProgress,
//   Box,
// } from "@mui/material";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import axios from "axios";
// import { debounce } from "lodash"; // Import debounce from lodash

// const EmailInbox = () => {
//   const [emails, setEmails] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedEmail, setSelectedEmail] = useState(null);
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     fetchEmails();
//   }, []); // Run once on mount

//   // Debounced fetchEmails function
//   const fetchEmails = debounce(async () => {
//     setLoading(true);
//     setError(null); // Reset error state
//     try {
//       const response = await axios.get(
//         "http://localhost:7000/api/inbox-emails"
//       ); // Corrected port to 8000
//       console.log("Received emails:", response.data.emails);
//       setEmails(response.data.emails || []); // Use empty array as fallback
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching emails:", error);
//       setError("Failed to load emails. Please try again.");
//       setEmails([]); // Set empty array on error
//       setLoading(false);
//     }
//   }, 1000); // 1-second debounce delay

//   const handleOpenDialog = (email) => {
//     setSelectedEmail(email);
//     setOpen(true);
//   };

//   const handleCloseDialog = () => {
//     setOpen(false);
//     setSelectedEmail(null);
//   };

//   const renderEmailBody = (email) => {
//     if (email.html) {
//       return <div dangerouslySetInnerHTML={{ __html: email.html }} />;
//     }
//     return <p>{email.text}</p>;
//   };

//   return (
//     <Box sx={{ padding: 2 }}>
//       <Button
//         onClick={fetchEmails}
//         disabled={loading}
//         variant="contained"
//         sx={{ mb: 2 }}
//       >
//         Refresh Emails
//       </Button>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>From</TableCell>
//               <TableCell>To</TableCell>
//               <TableCell>Subject</TableCell>
//               <TableCell>Date</TableCell>
//               <TableCell>Action</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={5} align="center">
//                   <CircularProgress />
//                 </TableCell>
//               </TableRow>
//             ) : error ? (
//               <TableRow>
//                 <TableCell colSpan={5} align="center" sx={{ color: "red" }}>
//                   {error}
//                 </TableCell>
//               </TableRow>
//             ) : emails.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={5} align="center">
//                   No emails found
//                 </TableCell>
//               </TableRow>
//             ) : (
//               emails.map((email, index) => (
//                 <TableRow key={email.id || index}>
//                   {" "}
//                   {/* Use id if available */}
//                   <TableCell>{email.from}</TableCell>
//                   <TableCell>{email.to}</TableCell>
//                   <TableCell>{email.subject}</TableCell>
//                   <TableCell>{new Date(email.date).toLocaleString()}</TableCell>
//                   <TableCell>
//                     <IconButton onClick={() => handleOpenDialog(email)}>
//                       <VisibilityIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
//         <DialogTitle>Email Details</DialogTitle>
//         <DialogContent>
//           {selectedEmail && (
//             <div>
//               <p>
//                 <strong>From:</strong> {selectedEmail.from}
//               </p>
//               <p>
//                 <strong>To:</strong> {selectedEmail.to}
//               </p>
//               <p>
//                 <strong>Subject:</strong> {selectedEmail.subject}
//               </p>
//               <p>
//                 <strong>Date:</strong>{" "}
//                 {new Date(selectedEmail.date).toLocaleString()}
//               </p>
//               <div>
//                 <strong>Body:</strong> {renderEmailBody(selectedEmail)}
//               </div>
//             </div>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog}>Close</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default EmailInbox;

import React from "react";

const Inbox = () => {
  return <div>Inbox</div>;
};

export default Inbox;
