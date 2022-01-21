const express = require("express");
const logger = require("morgan");
const cors = require("cors");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs/promises");
// const { v4 } = require("uuid");
require("dotenv").config();

const authRouter = require("./routes/api/auth");
const contactsRouter = require("./routes/api/contacts");
const usersRouter = require("./routes/api/users");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/auth", authRouter);
app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

// === file processing =======
// const tempDir = path.join(__dirname, "temp");
// const contactsDir = path.join(__dirname, "public/contacts");

// const multerConfig = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, tempDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
//   limits: {
//     fileSize: 2048,
//   },
// });

// const upload = multer({
//   storage: multerConfig,
// });

// const contacts = [];
// app.get("/api/products", async (req, res, next) => {
//   res.json(contacts);
// });

// app.post("/api/contacts", upload.single("image"), async (req, res, next) => {
//   try {
//     const { path: tempUpload, filename } = req.file;
//     const fileUpload = path.join(contactsDir, filename);
//     await fs.rename(tempUpload, fileUpload);
//     const image = path.join("contacts", filename);
//     const contact = { ...req.body, _id: v4(), image };
//     contacts.push(contact);
//     res.status(201).json(contact);
//   } catch (error) {
//     await fs.unlink(tempUpload);
//   }
// });
// ================================

module.exports = app;
