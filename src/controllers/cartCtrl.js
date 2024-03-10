const sequelize = require("../db/conn");
const Cart = require("../models/cart");
const Product = require("../models/product");

// controller for showing product in cart
const showCart = async (req, res) => {
    const uid = req.uid;
    
    try {
        const items = await Cart.findAll({
            attributes: ['cart_id',
                        [sequelize.literal('Product.title'), 'title'],
                        [sequelize.literal('Product.desc'), 'desc'],
                        [sequelize.literal('Product.prod_img'), 'prod_img'],
                        [sequelize.literal('Product.categories'), 'categories'],
                        [sequelize.literal('Product.size'), 'size'],
                        [sequelize.literal('Product.color'), 'color'],
                        [sequelize.literal('Product.price'), 'price'],
                        'quantity'],
            include: {
                model: Product,
                attributes: [],
            },
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

// controller for adding product to cart
const addToCart = async (req, res) => {
    const uid = req.uid;
    const pid = req.params.pid;
    
    try {
        const product = await Product.findOne({
            where: {
                prod_id: pid
            }
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const cartItem = await Cart.findOne({
            where: {
                user_id: uid,
                prod_id: pid
            }
        });

        if (cartItem === null && product.stock > 0) {
            await Cart.create({
                user_id: uid,
                prod_id: pid,
            });
    
            res.status(201).json({ iscreated: true, message: "Cart item added successfully" });
        }
        else if (cartItem !== null && cartItem.quantity < product.stock) {
            await Cart.update({
                quantity: sequelize.literal('quantity + 1')
            },
            {
                where: {
                    user_id: uid,
                    cart_id: cartItem.cart_id
                }
            });
            res.status(200).json({ isincremented: true, message: "Quantity incremented successfully" });
        }
        else {
            res.status(400).json({ message: "Product stock is insufficient" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
}

// controller for incrementing product qty in cart
const incQty = async (req, res) => {
    const uid = req.uid;
    const cid = req.params.cid;

    try {
        const item = await Cart.findByPk(cid);

        if (!item) {
            return res.status(404).json({ isincremented: false, message: "Item not found" });
        }

        const product = await Product.findByPk(item.prod_id);

        if (!product) {
            return res.status(404).json({ isincremented: false, message: "Product not found" });
        }

        if (item.quantity < product.stock) {
            await Cart.update({
                quantity: sequelize.literal('quantity + 1')
            },
            {
                where: {
                    user_id: uid,
                    cart_id: cid
                }
            });
            res.status(200).json({ isincremented: true, message: "Quantity incremented successfully" });
        }
        else {
            res.status(400).json({ isincremented: false, message: "Product stock is insufficient" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
}

// controller for decrementing product qty in cart
const decQty = async (req, res) => {
    const uid = req.uid;
    const cid = req.params.cid;

    try {
        const item = await Cart.findByPk(cid);

        if (item) {
            await Cart.decrement('quantity',
            {
                by: 1,
                where: {
                    user_id: uid,
                    cart_id: cid
                }
            });
            
            const updatedRow = await Cart.findByPk(cid);

            if (updatedRow.quantity === 0) {
                const deletedRow = await Cart.destroy({
                    where: {
                        user_id: uid,
                        cart_id: cid
                    }
                });
        
                if (deletedRow === 1) {
                    res.status(200).json({ isremoved: true, message: "Cart item removed successfully" });
                }
                else {
                    res.status(500).json({ isremoved: false, message: "Cart item removation failed" });
                }
            }
            else {
                res.status(200).json({ isdecremented: true, message: "Quantity decremented successfully" });
            }
        }
        else {
            res.status(500).json({ isdecremented: false, message: "Item not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
}

// controller for removing particular product from cart
const rmFromCart = async (req, res) => {
    const uid = req.uid;
    const cid = req.params.cid;

    try {
        const deletedRow = await Cart.destroy({
            where: {
                user_id: uid,
                cart_id: cid
            }
        });

        if (deletedRow === 1) {
            res.status(200).json({ isremoved: true, message: "Cart item removed successfully" });
        }
        else {
            res.status(500).json({ isremoved: false, message: "Cart item removation failed" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
}

// controller for deleting the whole cart
const delCart = async (req, res) => {
    const uid = req.uid;
    
    try {
        const deletedRow = await Cart.destroy({
            where: {
                user_id: uid
            }
        });

        if (deletedRow >= 1) {
            res.status(200).json({ isdeleted: true, message: "Cart deleted successfully" });
        }
        else {
            res.status(500).json({ isdeleted: false, message: "Cart deletion failed" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
}

module.exports = { showCart, addToCart, incQty, decQty, rmFromCart, delCart }