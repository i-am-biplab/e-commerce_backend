const { DataTypes } = require("sequelize");
const sequelize = require("../db/conn");


const Address = sequelize.define("Address", {
    addr_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    full_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mob_no: {
        type: DataTypes.STRING,
        allowNull: false
    },
    line1: {
        type: DataTypes.STRING,
        allowNull: false
    },
    line2: {
        type: DataTypes.STRING,
        allowNull: false
    },
    landmark: {
        type: DataTypes.STRING
    },
    zipCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^[0-9]{6}$/ // Ensure zipCode is exactly 6 digits
        }
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
{
    paranoid: true
});

module.exports = Address;