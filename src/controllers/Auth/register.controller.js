const userModel = require("../../models/Auth/user")
const bcrypt = require("bcrypt")
const { registerSchema } = require("../../validation/user.validation")
const register = async (req, res) => {
    try {
        const { error, value } = registerSchema.validate(req.body)
        if (error) {
            return res.status(400).json({ statusCode: 400, message: error.details[0].message, status: false })
        }

        const { name, email, mobile, password, role, createdBy } = value;
        const existingUser = await userModel.findOne({ $or: [{ email: email }, { mobile: mobile }] })
        if (existingUser) {
            return res.status(400).json({ statusCode: 400, message: `User with this email or mobile already exists`, status: false })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            name: name, email: email, mobile: mobile, password: hashedPassword, role: role, createdBy: createdBy
        })
        return res.status(201).json({
            statusCode: 201, message: `User registered successfully`, status: true, data: newUser
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ statusCode: 500, message: `Internal server error`, status: false })
    }
}

const createUser = async (req, res) => {
    try {
        const { error, value } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                statusCode: 400,
                message: error.details[0].message,
                status: false,
            });
        }

        const { name, email, mobile, password, role, createdBy } = value;



        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create new user
        const newUser = await userModel.create({
            name,
            email,
            mobile,
            password: hashedPassword,
            role,
            createdBy,
        });

        return res.status(201).json({
            statusCode: 201,
            message: "User registered successfully",
            status: true,
            data: newUser,
        });
    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error",
            status: false,
        });
    }
}
module.exports = { register, createUser }