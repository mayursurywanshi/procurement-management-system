const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    clientId: {
  type: String,
  required: true
},

    procurementManagerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    inspectionManagerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    checklistId: { type: mongoose.Schema.Types.ObjectId, ref: "Checklist" },
    status: { type: String, enum: ["pending", "inProgress", "completed"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
