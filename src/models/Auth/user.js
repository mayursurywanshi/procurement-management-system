const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {type:String},
    email: { type: String, unique: true, sparse: true },
    mobile: { type: String, unique: true, sparse: true },
    password: { type: String },
    role: { type: String, enum: ["admin", "procurementManager", "inspectionManager", "client"], required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" }
}, { timestamps: true });
module.exports = mongoose.model("User", userSchema)


