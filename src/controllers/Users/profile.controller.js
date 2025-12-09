const userModel = require("../../models/Auth/user")

const profile = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId).select({ password: 0 })
        return res.status(200).json({ statusCode: 200, message: 'user profile', data: user, status: true })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ statusCode: 500, message: 'Internal server error ', status: false })
    }
}
module.exports = { profile }