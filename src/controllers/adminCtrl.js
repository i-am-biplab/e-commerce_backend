const User = require("../models/user");

// controller for blocking user
const blockUser = async (req, res) => {
    const { userId } = req.body;

    try {
        const affectedRow = await User.update({
            is_blocked: true
        },
        {
            where: {
                uid: userId
            }
        });
    
        if (affectedRow[0] === 1) {
            res.status(200).json({ isblocked: true, message: "User blocked successfully" });
        }
        else {
            res.status(500).json({ isblocked: false, message: "User blocking failed" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
}

// controller for blocking user
const unBlockUser = async (req, res) => {
    const { userId } = req.body;

    try {
        const affectedRow = await User.update({
            is_blocked: false
        },
        {
            where: {
                uid: userId
            }
        });
    
        if (affectedRow[0] === 1) {
            res.status(200).json({ is_unblocked: true, message: "User unblocked successfully" });
        }
        else {
            res.status(500).json({ is_unblocked: false, message: "User unblocking failed" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
}

// controller for deleting product
const deleteProduct = async (req, res) => {
    const prodId = req.params.d;

    try {
        const deletedRow = await Product.destroy({
            where: {
                pid: prodId
            }
        });
    
        if (deletedRow === 1) {
            res.status(200).json({ isdeleted: true, message: "Product deleted successfully" });
        }
        else {
            res.status(500).json({ isdeleted: false, message: "Product deletion failed" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
}

module.exports = { blockUser, unBlockUser, deleteProduct }