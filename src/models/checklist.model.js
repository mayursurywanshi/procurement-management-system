const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    type: { type: String, enum: ["boolean", "single", "multiple", "text", "image"], required: true },
    options: [String], // for dropdown / multiple choice
    required: { type: Boolean, default: false },
});

const checklistSchema = new mongoose.Schema({
    title: { type: String, required: true },
    questions: [questionSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Checklist", checklistSchema);
