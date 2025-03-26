// PACKAGES IMPORTS
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import nodemailer from "nodemailer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fetchEmails from "./Controllers/imapService.js";
import Imap from "imap";
import { simpleParser } from "mailparser";
import bodyParser from "body-parser";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";

//FILES IMPORTS
import connectDB from "./Config/Mongodb.js";
import AuthRoutes from "./Routes/AuthRoutes.js";
import DashboardRoutes from "./Routes/DashboardRoutes.js";
import taskRoutes from "./Routes/taskRoutes.js";
import leadRoutes from "./Routes/leadRoutes.js";
import projectRoutes from "./Routes/projectRoutes.js";
import EventRoutes from "./Routes/EventRoutes.js";
import serviceTypeRoutes from "./Routes/serviceTypeRoutes.js";
import Email from "./Models/EmailModel.js";
import User from "./Models/UserModel.js";
import { verifyToken } from "./Middlewares/AuthMiddleware.js";
import attendanceRoutes from "./Routes/attendanceRoutes.js";
import DocumentRoutes from "./Routes/DocumentRoutes.js";

dotenv.config();

// App Config
const PORT = process.env.PORT || 8000;
const app = express();
connectDB();
const upload = multer({ dest: "uploads/" });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, "uploads"));
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Middlewares
app.use(express.json());

// Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// WhatsApp API credentials
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const WHATSAPP_BUSINESS_ID = process.env.WHATSAPP_BUSINESS_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// API Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/dashboard", DashboardRoutes);
app.use("/api", taskRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/newproject", projectRoutes);
app.use("/api", EventRoutes);
app.use("/api", EventRoutes);
app.use("/api", serviceTypeRoutes);
app.use("/api/docs", DocumentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const transporter = nodemailer.createTransport({
  host: "smtppro.zoho.com",
  port: 465,
  secure: true, //
  auth: {
    user: process.env.ZOHO_USER,
    pass: process.env.ZOHO_PASS,
  },
  tls: {
    rejectUnauthorized: true,
  },
});

// Endpoint for uploading images to be embedded in the email body
app.post(
  "/upload-image",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;

      res.status(200).json({ url: imageUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  }
);

app.post(
  "/api/docs/folders/:folderId/images",
  upload.array("images"),
  async (req, res) => {
    try {
      const { folderId } = req.params;
      const files = req.files;

      // Save file metadata to the database
      const images = files.map((file) => ({
        folderId,
        filename: file.originalname,
        path: file.path,
      }));

      const savedImages = await Image.insertMany(images);
      res.status(201).json(savedImages);
    } catch (error) {
      res.status(500).json({ error: "Failed to upload images" });
    }
  }
);
// Verify SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Connected Successfully!");
  }
});

app.post(
  "/send-email",
  verifyToken,
  upload.array("attachments"),
  async (req, res) => {
    try {
      // Getting user from the database
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).send("User not found");
      }

      const { to, subject, text } = req.body;
      const attachments = req.files.map((file) => ({
        filename: file.originalname,
        path: `uploads/${file.filename}`,
      }));

      const mailOptions = {
        from: `"${user.username}" <${process.env.ZOHO_USER}>`,
        to,
        subject,
        text,
        attachments: req.files.map((file) => ({
          filename: file.originalname,
          path: file.path,
        })),
      };

      const info = await transporter.sendMail(mailOptions);

      // Saving email to the database
      const newEmail = new Email({
        to,
        subject,
        text,
        attachments,
        sender: user.username,
      });

      await newEmail.save();

      res.status(200).send("Email sent: " + info.response);
    } catch (error) {
      console.error("Error in /send-email:", error);
      res.status(500).send(error.toString());
    }
  }
);

// prompt to generate email
app.post("/generate-email", async (req, res) => {
  const { prompt } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(
      `Create a professional email: ${prompt}`
    );

    console.log("Gemini API response:", JSON.stringify(result, null, 2));

    const generatedText = await result.response.text();
    res.status(200).json({ text: generatedText });
  } catch (error) {
    console.error("Gemini Error:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
    });

    res.status(error.response?.status || 500).json({
      error: "Email generation failed",
      details: error.message,
    });
  }
});

// api to get all mails
app.get("/api/sent-emails", async (req, res) => {
  try {
    const emails = await Email.find().sort({ sentAt: -1 });
    res.status(200).json(emails);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch emails" });
  }
});

//  WHATSAPP API STARTS HERE
// Verify Webhook
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Fetch WhatsApp Templates
app.get("/templates", async (req, res) => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v22.0/${WHATSAPP_BUSINESS_ID}/message_templates`,
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching templates:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch templates" });
  }
});

// Send Template Message
app.post("/send-template", async (req, res) => {
  const { to, templateName } = req.body;

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: templateName,
          language: { code: "en_US" },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error sending template:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to send template" });
  }
});

// Send Custom Message
app.post("/send-custom", async (req, res) => {
  const { to, message } = req.body;

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error sending custom message:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to send custom message" });
  }
});

// END

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
