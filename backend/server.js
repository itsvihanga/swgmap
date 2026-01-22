const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔍 Debug env loading
console.log("MONGO_URI:", process.env.MONGO_URI);

// ✅ MongoDB connection (SAFE)
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:");
    console.error(err.message);
    process.exit(1);
  });

// ✅ Routes
const projectRoutes = require("./routes/projects");
app.use("/api/projects", projectRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
