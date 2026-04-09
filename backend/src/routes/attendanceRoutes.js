const express = require("express");
const mongoose = require("mongoose");
const Attendance = require("../models/Attendance");
const User = require("../models/User");

const router = express.Router();
const allowedStatuses = ["Present", "Absent", "Late"];

function normalizeDate(dateInput) {
  const parsedDate = new Date(dateInput);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return new Date(Date.UTC(parsedDate.getUTCFullYear(), parsedDate.getUTCMonth(), parsedDate.getUTCDate()));
}

function normalizeStatus(statusValue) {
  if (typeof statusValue !== "string") {
    return null;
  }
  const value = statusValue.trim().toLowerCase();
  if (value === "present") {
    return "Present";
  }
  if (value === "absent") {
    return "Absent";
  }
  if (value === "late") {
    return "Late";
  }
  return null;
}

router.post("/", async (req, res) => {
  try {
    const records = Array.isArray(req.body.records)
      ? req.body.records
      : req.body.user_id
        ? [req.body]
        : [];

    if (records.length === 0) {
      return res.status(400).json({ message: "No attendance records provided." });
    }

    const invalidRecords = [];
    const duplicateRecords = [];
    const docsToInsert = [];
    const payloadKeys = new Set();

    for (const record of records) {
      const normalizedStatus = normalizeStatus(record.status);
      const normalizedDate = normalizeDate(record.date);
      const { user_id: userId, check_in: checkIn, check_out: checkOut } = record;

      if (!userId || !normalizedStatus || !normalizedDate || !allowedStatuses.includes(normalizedStatus)) {
        invalidRecords.push(record);
        continue;
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        invalidRecords.push(record);
        continue;
      }

      const payloadKey = `${userId}:${normalizedDate.toISOString()}`;
      if (payloadKeys.has(payloadKey)) {
        duplicateRecords.push({ ...record, reason: "duplicate_in_payload" });
        continue;
      }
      payloadKeys.add(payloadKey);

      const duplicate = await Attendance.findOne({ userId, date: normalizedDate });
      if (duplicate) {
        duplicateRecords.push(record);
        continue;
      }

      docsToInsert.push({
        userId,
        date: normalizedDate,
        status: normalizedStatus,
        checkIn: checkIn || null,
        checkOut: checkOut || null
      });
    }

    let insertedCount = 0;
    if (docsToInsert.length > 0) {
      await Attendance.insertMany(docsToInsert, { ordered: false });
      insertedCount = docsToInsert.length;
    }

    return res.status(201).json({
      message: "Attendance processed.",
      insertedCount,
      duplicateCount: duplicateRecords.length,
      invalidCount: invalidRecords.length,
      duplicates: duplicateRecords,
      invalid: invalidRecords
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to save attendance records.",
      error: error.message
    });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { month } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format." });
    }

    const user = await User.findById(userId).lean();

    const query = { userId };

    if (month && /^\d{4}-\d{2}$/.test(month)) {
      const [year, monthIndex] = month.split("-").map(Number);
      const startDate = new Date(Date.UTC(year, monthIndex - 1, 1));
      const endDate = new Date(Date.UTC(year, monthIndex, 1));
      query.date = { $gte: startDate, $lt: endDate };
    }

    const records = await Attendance.find(query).sort({ date: -1 }).lean();

    const stats = records.reduce(
      (acc, item) => {
        if (item.status === "Present") {
          acc.present += 1;
        } else if (item.status === "Absent") {
          acc.absent += 1;
        } else if (item.status === "Late") {
          acc.late += 1;
        }
        acc.total += 1;
        return acc;
      },
      { total: 0, present: 0, absent: 0, late: 0 }
    );

    const attendancePercentage = stats.total ? Math.round((stats.present / stats.total) * 100) : 0;

    return res.json({
      user: {
        id: user?._id || userId,
        name: user?.name || `User ${userId}`,
        userCode: user?.userCode || "UNREGISTERED",
        department: user?.department || "",
        className: user?.className || ""
      },
      stats: {
        ...stats,
        attendancePercentage
      },
      records: records.map((item) => ({
        id: item._id,
        date: item.date.toISOString(),
        status: item.status,
        checkIn: item.checkIn,
        checkOut: item.checkOut
      }))
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch attendance history.",
      error: error.message
    });
  }
});

module.exports = router;
