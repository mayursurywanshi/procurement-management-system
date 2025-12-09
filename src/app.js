const express = require("express");
const cors = require("cors")
const cookiesParser = require('cookie-parser')
const router = require("./routes/Auth/user.routes")
const userRouter = require("./routes/User/profile.route")
const allRouter = require("./routes/orders/all.routes")
const orderRouter = require("./routes/orders/order.route")
const app = express();
app.use(cors());
app.use(express.json({ limit: '16kb' }));
app.use(cookiesParser());
app.use("/api/v1", router)
app.use("/api/v1", userRouter)
app.use("/api/v1", allRouter)
app.use("/api/v1", orderRouter)
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static('public'))

module.exports = { app }