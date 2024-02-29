const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Middleware to verify JWT token

// for getting token from request header
const isSeller = (req, res, next) => {
    let token;
    const { authorization } = req.headers;
    console.log(authorization);

    try {
        if(authorization && authorization.startsWith('Bearer')) {
            token = authorization.split(' ')[1];
            if (!token) {
                return res.status(403).json({"isvalid": false, error: "No Token Found" });
            }

            jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
                if (err) {
                    return res.status(403).json({"isvalid": false, error: "Token Verification Error" });
                }
        
                const uid = decoded.uid;

                const user = await User.findOne({
                    attributes: ["role"],
                    where: { uid: uid }
                });

                if (user.length === 0) {
                    res.status(500).json({ error: "User not found in the database" });
                }
                else {
                    if (user.role === "seller") {
                        next();
                    }
                    else {
                        res.status(401).json({isseller: false, msg: "Attempt of Unauthorized Access"});
                    }
                }
            });
        }
        else {
            return res.status(403).json({"isvalid": false, error: "No Bearer Found in Header" });
        }
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = isSeller;