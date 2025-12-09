const joi = require("joi");
const registerSchema = joi.object({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().optional(),
    mobile: joi.string().pattern(new RegExp("^[0-9]{10}$")).optional(),
    password: joi.string().min(6).max(20).required(),
    role: joi.string().valid("admin", "procurementManager", "inspectionManager", "client").required(),
    createdBy: joi.string().optional()
})
const loginSchema=joi.object({
    email:joi.string().optional(),
    mobile:joi.string().optional(),
    password:joi.string().required()
})
module.exports = { registerSchema,loginSchema }