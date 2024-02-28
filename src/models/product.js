const { DataTypes } = require("sequelize");
const sequelize = require("../db/conn");


const Product = sequelize.define("Product", {
    pid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    desc: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prod_img: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categories: {
        type: DataTypes.JSON,
        defaultValue: [], // Default value can be an empty array
        get() {
            const value = this.getDataValue('categories');
            return Array.isArray(value) ? value : JSON.parse(value || '[]');
        },
        set(value) {
            this.setDataValue('categories', JSON.stringify(value));
        },
    },
    size: {
        type: DataTypes.STRING
    },
    color: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    
},
{
    paranoid: true
});

module.exports = Product;