const JWT = require("jsonwebtoken")
require("dotenv").config()

const checkAuth = async (req, res, next) => {
    const token = req.header("x-auth-token")

    if (!token) {
        return res.status(400).json({ message: "No token found" })
    }

    try {
        const userDetails = await JWT.verify(token, process.env.JWT_PRIVATE_KEY)

        const { address } = userDetails

        if (!address) {
            return res.status(400).json({ message: "Invalid token" })
        }

        req.userDetails = userDetails
        next()
    } catch (err) {
        res.status(400).json({ message: "Invalid token" })
    }
}

module.exports = checkAuth