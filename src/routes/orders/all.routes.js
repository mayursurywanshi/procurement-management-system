const express = require("express");
const { authentication, updateOrderStatus } = require("../../middlewares/Auth/auth");
const { createOrder, updateStatus, getOrder } = require("../../controllers/Orders/order.controller");
const { createChecklist, getAllChecklists } = require("../../controllers/CheckIst/checklistController");
const { submitAnswers } = require("../../controllers/Answer/answer.controller");

const router = express.Router();

// Orders
router.post("/order/create", authentication, createOrder);
router.patch("/order/:id/status", authentication, updateOrderStatus, updateStatus);
router.get("/order/:id", authentication, getOrder);

// Checklists
router.post("/checklist/create", authentication, createChecklist);
router.get("/checklist/all", authentication, getAllChecklists);

// Answers
router.post("/answer/submit", authentication, submitAnswers);

module.exports = router;
