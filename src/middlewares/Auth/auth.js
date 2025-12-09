const JWT = require("jsonwebtoken")
const userModel = require("../../models/Auth/user")
const authentication = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']

        if (!authHeader) {
            return res.status(404).json({ statusCode: 404, message: 'token is not present', status: false })
        }
        const token = authHeader.split(" ")[1]
        if (!token) {
            return res.status(400).json({ statusCode: 400, message: 'token is invalid', status: false })
        }
        const decoded = JWT.decode(token, process.env.JWT_SECRET)
        req.userId = decoded.userId
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ statusCode: 500, message: 'Internal server error', status: false })
    }
}

/*** Middleware: Authorization before creating a new user ***/

const accountCreateAuth = async (req, res, next) => {
    try {
        const { email, mobile, role } = req.body;
        console.log(req.userId)
        // ✅ Validate creator existence
        const creator = await userModel.findById(req.userId);
        if (!creator) {
            return res.status(404).json({
                statusCode: 404,
                message: "Creator not found",
                status: false,
            });
        }

        // ✅ Role-based restrictions
        if (["client", "inspectionManager"].includes(creator.role)) {
            return res.status(403).json({
                statusCode: 403,
                message: "You are not authorized to create new users",
                status: false,
            });
        }

        // ✅ Role creation permissions
        const validRolesByCreator = {
            admin: ["procurementManager", "inspectionManager", "client"],
            procurementManager: ["inspectionManager", "client"],
        };

        if (!validRolesByCreator[creator.role]?.includes(role)) {
            return res.status(400).json({
                statusCode: 400,
                message: `As a ${creator.role}, you cannot create a user with role '${role}'`,
                status: false,
            });
        }

        // ✅ Check existing user
        const existingUser = await userModel.findOne({
            $or: [{ email }, { mobile }],
        });

        if (existingUser) {
            // Special case: procurementManager cannot recreate inspectionManager
            if (
                creator.role === "procurementManager" &&
                existingUser.role === "inspectionManager"
            ) {
                return res.status(400).json({
                    statusCode: 400,
                    message:
                        "Inspection Manager already exists. Please contact Admin for the same.",
                    status: false,
                });
            }

            return res.status(400).json({
                statusCode: 400,
                message: "User with this email or mobile already exists",
                status: false,
            });
        }

        // ✅ Attach creator info to request
        req.createdBy = creator._id;
        next(); // move to createUser
    } catch (error) {
        console.error("Account Create Auth Error:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error",
            status: false,
        });
    }
};

// ✅ Update Order Status (Admin, Procurement, Inspection)
const updateOrderStatus = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.userId);
          if (!user) {
      return res.status(404).json({
        statusCode: 404,
        status: false,
        message: "User not found",
      });
    }
        // ✅ Role-based restriction
        if (user.role === "client") {
            return res.status(403).json({
                statusCode: 403,
                status: false,
                message: "Unauthorized: Client cannot update order status",
            });
        }
        next()
    } catch (error) {

    }
}
module.exports = { authentication, accountCreateAuth, updateOrderStatus }