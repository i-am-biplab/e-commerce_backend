const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const crypto = require('crypto');
const User = require("../models/user");
// const Blog = require("../models/blog");
const sequelize = require("../db/conn");
const { Op } = require("sequelize");

// controller for signup
const signupUser = async (req, res) => {
    try {
        const { name, email, mob, passwd, conpasswd } = req.body;

        if (name && email && mob && passwd && conpasswd) {
            if (passwd === conpasswd) {
                hashedPasswd = await bcrypt.hash(passwd, 12);

                const [user, created] = await User.findOrCreate({
                    where: { 
                        [Op.or]: {
                            email: email,
                            mobile: mob
                        }
                    },
                    defaults: {
                        name: name,
                        email: email,
                        mobile: mob,
                        passwd: hashedPasswd
                    }
                });
                if (created != true) {
                    res.status(409).json({message: "Email or Mobile already registered"});
                }
                else {
                    const uid = user.uid;
                    const token = jwt.sign({ uid: uid }, process.env.SECRET_KEY);
                    console.log(token);

                    res.status(201).json({issignedup: true,
                                            message: "Signed Up Successfully",
                                            token: token
                    });
                }
            }
            else {
                res.status(401).json({message: "Password not matching"});
            }
        }
        else {
            res.status(400).json({ message: "All required fields are mandatory" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
}

// controller for login
const loginUser = async (req, res) => {
    try {
        const { identifier, passwd } = req.body;
        if (identifier && passwd) {
            const user = await User.findAll({
                where: {
                    [Op.or]: [{ email: identifier }, { mobile: identifier }]
                },
                attributes: ["uid", "passwd"]
            });

            if (user.length > 0) {
                const uid = user[0].uid;
                const hashedPasswd = user[0].passwd;

                try {
                    const isMatch = await bcrypt.compare(passwd, hashedPasswd);
    
                    if (isMatch) {
                        const token = jwt.sign({ uid: uid }, process.env.SECRET_KEY);
                        console.log(token);

                        res.status(200).json({isloggedin: true, 
                                                message: "Logged In successfully",
                                                token: token});
                    }
                    else {
                        res.status(401).json({message: "Invalid Credentials"});
                    }
                } catch (bcryptError) {
                    res.status(500).json({message: "Internal Server Error"});
                    console.log("Error comparing passwords: ", bcryptError);
                }
            }
            else {
                res.status(404).json({message: "User not found"});
            }
        }
        else {
            res.status(400).json({ message: "All required fields are mandatory" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
}

module.exports = { signupUser, loginUser }