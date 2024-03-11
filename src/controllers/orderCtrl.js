const sequelize = require("../db/conn");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Order = require("../models/order");

// controller for checking out products in cart
const checkoutOrder = async (req, res) => {
    try {
        const userId = req.uid;
        const { addressId, paymentMode } = req.body;

        if (!addressId || !paymentMode) {
            return res.status(400).json({message: 'Address id and payment mode are required'});
        }

        const cartItems = await Cart.findAll({
            where: {
                user_id: userId
            },
            include: {
                model: Product
            }
        });

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        console.log('Cart Items:', cartItems);

        function generateRandomOrderNumber() {
            const randomNumber = Math.floor(Math.random() * 90000000) + 10000000;
            
            const randomODNumber = "OD" + randomNumber.toString();
            
            return randomODNumber;
        }

        const order = await Order.create({
            orderNumber: generateRandomOrderNumber(),
            user_id: userId,
            totalAmount: 0,     // initialize total amount
            addr_id: addressId,
            pay_mode: paymentMode
        });

        // calculate total amount for the order and associate products with quantity
        let totalAmount = 0;
        for (const item of cartItems) {
            const quantity = item.quantity;
            const price = item.Product.price;
            totalAmount += quantity * price;
            await order.addProduct(item.Product, {through: { quantity }}); // Associate product with quantity
        }

        // Update total amount for the order
        await order.update({ totalAmount });

        await Cart.destroy({
            where: { user_id: userId }
        });

        res.status(200).json({ message: "Order placed successfully", order });
    } catch (error) {
        res.status(500).json({ error: "Failed to place order" });
        console.error("Error while checking out:", error);
    }
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