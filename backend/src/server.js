const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./config/db");
const attendanceRoutes = require("./routes/attendanceRoutes");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "attendance-api" });
});

app.use("/api/attendance", attendanceRoutes);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Attendance backend running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("DB connection failed:", error.message);
    process.exit(1);
  });

