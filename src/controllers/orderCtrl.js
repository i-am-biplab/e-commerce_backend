const sequelize = require("../db/conn");
const Cart = require("../models/cart");

// controller for checking out products in cart
const checkoutOrder = async (req, res) => {
    const uid = req.uid;
    
    try {
        const items = await Cart.findAll({
            attributes: ['cart_id', 'prod_id', 'quantity'],
            where: {
                user_id: uid
            }
        });

        if (items.length === 0) {
            res.status(404).json({ isfound: false, message: "Cart is empty" });
        }
        else {
            res.status(200).json({ isfound: true, items });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
}

module.exports = { checkoutOrder }