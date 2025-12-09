const Order = require("../../models/order.model");
const Checklist = require("../../models/checklist.model");
const User = require("../../models/Auth/user");

// ✅ Create Order (Procurement Manager)
const createOrder = async (req, res) => {
  try {
    const { clientId, inspectionManagerId, checklistId } = req.body;
    const user = await User.findById(req.userId);

    if (user.role !== "procurementManager") {
      return res.status(403).json({ message: "Only procurement manager can create orders", status: false });
    }

    const order = await Order.create({
      clientId,
      procurementManagerId: req.userId,
      inspectionManagerId,
      checklistId,
    });

    res.status(201).json({ status: true, message: "Order created", data: order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// ✅ Update Order Status (Admin, Procurement, Inspection)
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.status(200).json({ status: true, message: "Order status updated", data: order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// ✅ View Single Order
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("clientId", "name email")
      .populate("procurementManagerId", "name email")
      .populate("inspectionManagerId", "name mobile")
      .populate("checklistId");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ status: true, data: order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

module.exports = { createOrder, updateStatus, getOrder };
