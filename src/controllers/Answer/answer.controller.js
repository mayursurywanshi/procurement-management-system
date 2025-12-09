const Answer = require("../../models/answer.model");
const Checklist = require("../../models/checklist.model");
const Order = require("../../models/order.model");
const User = require("../../models/Auth/user");

// ✅ Submit Answers (Inspection Manager)
const submitAnswers = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== "inspectionManager") {
      return res.status(403).json({ message: "Only inspection manager can submit answers", status: false });
    }

    const { orderId, answers } = req.body;
    const order = await Order.findById(orderId).populate("checklistId");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // ✅ Validate required fields
    const checklist = order.checklistId;
    for (const q of checklist.questions) {
      if (q.required && !answers.find(a => String(a.questionId) === String(q._id))) {
        return res.status(400).json({ message: `Missing required question: ${q.questionText}` });
      }
    }

    const answerDoc = await Answer.create({
      orderId,
      inspectionManagerId: req.userId,
      answers,
    });

    order.status = "inProgress";
    await order.save();

    res.status(201).json({ status: true, message: "Answers submitted", data: answerDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

module.exports = { submitAnswers };
