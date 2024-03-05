const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const crypto = require('crypto');
const User = require("../models/user");
const Address = require("../models/address");
const sequelize = require("../db/conn");
const { Op } = require("sequelize");

// controller for signup
const signupUser = async (req, res) => {
    try {
        const { name, email, mob, passwd, conpasswd } = req.body;

        if (name && email && mob && passwd && conpasswd) {
            if (passwd === conpasswd) {
                const hashedPasswd = await bcrypt.hash(passwd, 12);

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
            const user = await User.findOne({
                where: {
                    [Op.or]: [{ email: identifier }, { mobile: identifier }]
                },
                attributes: ["uid", "passwd", "is_blocked"]
            });

            if (user !== null) {
                if (user.is_blocked === true) {
                    return res.status(403).json({message: "The User is blocked"});
                }
                const uid = user.uid;
                const hashedPasswd = user.passwd;

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

// controller for updating user
const updateUser = async (req, res) => {
    const email = req.body.email || null;
    const mob = req.body.mob || null;
    const passwd = req.body.passwd || null;
    
    if (email && !mob && !passwd) {
        try {
            const exist = await User.findOne({
                attributes: ["email"],
                where: {
                    email: email
                }
            });

            if (exist !== null){
                return res.status(409).json({isupdated: false, error: "Email already registered"});
            }

            const affectedRow = await User.update({
                email: email
            },
            {
                where: {
                    uid: req.uid
                }
            });

            if (affectedRow[0] === 1) {
                res.status(200).json({ isupdated: true, message: "User email updated successfully" });
            }
            else {
                res.status(500).json({ isupdated: false, message: "User email updation failed" });
            }
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
            console.log(error);
        }
    }
    else if (!email && mob && !passwd) {
        try {
            const exist = await User.findOne({
                attributes: ["mobile"],
                where: {
                    mobile: mob
                }
            });

            if (exist !== null){
                return res.status(409).json({isupdated: false, error: "Mobile already registered"});
            }

            const affectedRow = await User.update({
                mobile: mob
            },
            {
                where: {
                    uid: req.uid
                }
            });

            if (affectedRow[0] === 1) {
                res.status(200).json({ isupdated: true, message: "User mobile updated successfully" });
            }
            else {
                res.status(500).json({ isupdated: false, message: "User mobile updation failed" });
            }
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
            console.log(error);
        }
    }
    else if (!email && !mob && passwd) {
        try {
            const hashedPasswd = await bcrypt.hash(passwd, 12);

            const affectedRow = await User.update({
                passwd: hashedPasswd
            },
            {
                where: {
                    uid: req.uid
                }
            });

            if (affectedRow[0] === 1) {
                res.status(200).json({ isupdated: true, message: "User password updated successfully" });
            }
            else {
                res.status(500).json({ isupdated: false, message: "User password updation failed" });
            }
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
            console.log(error);
        }
    }
}

const showAllAddr = async (req, res) => {
    const uid = req.uid;

    try {
        const result = await Address.findAll({
            attributes: ['addr_id', 'full_name', 'mob_no', 'line1', 'line2', 'landmark', 'zipCode', 'city', 'state'],
            where: {
                user_id: uid
            }
        });

        if (result.length === 0) {
            res.status(404).json({message: "No addresses were found"});
        }
        else {
            res.status(200).json({result});
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
}

const addNewAddr = async (req, res) => {
    const uid = req.uid;
    const { 
        name = null,
        mob = null,
        addrLine1 = null,
        addrLine2 = null,
        landmark = null,
        zip = null,
        city = null,
        state = null
    } = req.body ?? {};

    if (name === null || mob === null || addrLine1 === null || addrLine2 === null || zip === null || city === null || state === null) {
        res.status(400).json({error: "No field should be null (only landmark optional)"});
    } else {
        try {
            const addr = await Address.create({
                user_id: uid,
                full_name: name,
                mob_no: mob,
                line1: addrLine1,
                line2: addrLine2,
                landmark: landmark,
                zipCode: zip,
                city: city,
                state: state
            });

            res.status(201).json({message: "Address added successfully"});
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
            console.log(error);
        }
    }
}

const updateAddr = async (req, res) => {

}

const delAddr = async (req, res) => {

}

module.exports = { signupUser, loginUser, updateUser, showAllAddr, addNewAddr, updateAddr, delAddr }