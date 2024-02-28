const { DataTypes } = require("sequelize");
const sequelize = require("../db/conn");


const Cart = sequelize.define("Cart", {
    cart_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    prod_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 1
    }
},
{
    paranoid: true
});

module.exports = Cart;