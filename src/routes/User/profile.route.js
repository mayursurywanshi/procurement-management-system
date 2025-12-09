const express = require("express")
const router = express.Router()
const { authentication } = require("../../middlewares/Auth/auth")
const { profile } = require("../../controllers/Users/profile.controller")

router.route("/profile").get(authentication, profile)

module.exports=router
