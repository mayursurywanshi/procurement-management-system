const Checklist = require("../../models/checklist.model");
const User = require("../../models/Auth/user");

// ✅ Create Checklist (Procurement Manager)
const createChecklist = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== "procurementManager") {
      return res.status(403).json({ message: "Only procurement manager can create checklist", status: false });
    }

    const { title, questions } = req.body;
    const checklist = await Checklist.create({
      title,
      questions,
      createdBy: req.userId,
    });

    res.status(201).json({ status: true, message: "Checklist created", data: checklist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// ✅ Get All Checklists (Admin, Procurement)
const getAllChecklists = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!["admin", "procurementManager"].includes(user.role)) {
      return res.status(403).json({ message: "Access denied", status: false });
    }

    const checklists = await Checklist.find({}).populate("createdBy", "name role");
    res.status(200).json({ status: true, data: checklists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

module.exports = { createChecklist, getAllChecklists };
