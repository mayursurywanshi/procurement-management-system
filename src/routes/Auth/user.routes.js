const express = require("express")
const { register } = require("../../controllers/Auth/register.controller")
const { authentication, accountCreateAuth } = require("../../middlewares/Auth/auth")
const { createUser } = require("../../controllers/Auth/register.controller")
const { login } = require("../../controllers/Auth/login.controller")
const router = express.Router()

router.route("/register").post(register)

router.route("/account/create").post(authentication, accountCreateAuth, createUser)
router.route("/login").post(login)
module.exports = router