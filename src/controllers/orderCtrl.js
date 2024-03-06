const sequelize = require("../db/conn");
const Cart = require("../models/cart");
const Order = require("../models/order");

// controller for checking out products in cart
const checkoutOrder = async (req, res) => {
    const uid = req.uid;
    
}

// controller for showing all orders
const showOrders = async (req, res) => {
    const uid = req.uid;

}

// controller for showing order details
const orderDetails = async (req, res) => {
    const uid = req.uid;

}

// controller for cancelling order
const cancelOrder = async (req, res) => {
    const uid = req.uid;
    const ordNo = req.params.ordr_num;

    try {
        const updatedRow = await Order.update({
            status: "cancelled"
        },
        {
            where: {
                orderNumber: ordNo,
                user_id: uid
            }
        });

        if (updatedRow[0] === 1) {
            res.status(200).json({ iscancelled: true, message: "Order cancelled successfully" });
        }
        else {
            res.status(500).json({ iscancelled: false, message: "Order cancellation failed" });
        }

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
}

module.exports = { checkoutOrder, showOrders, orderDetails, cancelOrder }