const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    inspectionManagerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    answers: [
        {
            questionId: mongoose.Schema.Types.ObjectId,
            value: mongoose.Schema.Types.Mixed,
            imageUrl: String,
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model("Answer", answerSchema);
