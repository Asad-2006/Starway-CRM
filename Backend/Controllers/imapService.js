import Imap from "imap";
import { simpleParser } from "mailparser";
import dotenv from "dotenv";

dotenv.config();

const fetchEmails = () => {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: process.env.GMAIL_USER,
      password: process.env.GMAIL_PASS,
      host: "imap.gmail.com",
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
    });

    imap.once("ready", () => {
      imap.openBox("INBOX", false, (err, box) => {
        if (err) {
          reject(err);
          return;
        }

        const emails = [];
        const fetch = imap.seq.fetch("1:10", { bodies: "" });

        fetch.on("message", (msg) => {
          let emailData = {};
          msg.on("body", (stream) => {
            simpleParser(stream, async (err, parsed) => {
              if (err) {
                console.error("Parsing error:", err);
              } else {
                emailData = {
                  subject: parsed.subject,
                  from: parsed.from.text,
                  date: parsed.date,
                  text: parsed.text,
                  html: parsed.html,
                };
                emails.push(emailData);
              }
            });
          });
        });

        fetch.once("end", () => {
          imap.end();
          resolve(emails);
        });
      });
    });

    imap.once("error", (err) => {
      reject(err);
    });

    imap.connect();
  });
};

export default fetchEmails;
