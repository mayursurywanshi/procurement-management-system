const userModel = require("../../models/Auth/user")
const JWT = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { loginSchema } = require("../../validation/user.validation")
const login = async (req, res) => {
   try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        statusCode: 400,
        message: error.details[0].message,
        status: false,
      });
    }

    const { email, mobile, password } = value;

    // ✅ CASE 1: Login via EMAIL
    if (email) {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({
          statusCode: 404,
          message: "User not found",
          status: false,
        });
      }

      // ✅ Only allowed roles for email login
      if (!["admin", "client", "procurementManager"].includes(user.role)) {
        return res.status(403).json({
          statusCode: 403,
          message: "This role cannot login with email",
          status: false,
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          statusCode: 400,
          message: "Invalid email or password",
          status: false,
        });
      }

      const token = JWT.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        statusCode: 200,
        message: "Login successful",
        status: true,
        data: user,
        token,
      });
    }

    // ✅ CASE 2: Login via MOBILE (Inspection Manager)
    if (mobile) {
      const user = await userModel.findOne({ mobile });
      if (!user) {
        return res.status(404).json({
          statusCode: 404,
          message: "User not found",
          status: false,
        });
      }

      if (user.role !== "inspectionManager") {
        return res.status(403).json({
          statusCode: 403,
          message: "Only Inspection Manager can login with mobile",
          status: false,
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          statusCode: 400,
          message: "Invalid mobile or password",
          status: false,
        });
      }

      const token = JWT.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        statusCode: 200,
        message: "Login successful",
        status: true,
        data: user,
        token,
      });
    }

    // ✅ If neither email nor mobile provided
    return res.status(400).json({
      statusCode: 400,
      message: "Please provide email or mobile number to login",
      status: false,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      status: false,
    });
  }
}
module.exports = { login }