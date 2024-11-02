const jwt = require('jsonwebtoken');
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        // console.log("token", token);
        
        if (token) {
            // If the token is valid, the verified variable will contain the decoded payload (means the data associated to that token) of the token.
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            if (verified) {
                // If the token is successfully verified, the middleware attempts to find a user in the database with the `_id` obtained from the token's payload (`verified._id`)
                const user = await User.findOne({ _id: verified._id });
                if (user) {
                    // If a user is found, it attaches the user object to the request object (req.user = user) and calls the next function to pass control to the next middleware or route handler
                    req.user = user;
                    next();
                }
                else {
                    res.status(401).send("Access denied1");
                }
            }
            else {
                res.status(401).send("Access denied2");
            }
        }
        else {
            res.status(401).send("Access denied3");
        }
    }
    catch (err) {
        next(err);
    }
}

module.exports = authMiddleware