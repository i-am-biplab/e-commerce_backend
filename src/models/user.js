const { DataTypes } = require("sequelize");
const sequelize = require("../db/conn");


const User = sequelize.define("User", {
    uid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: "Please enter a valid email address" // Custom error message
            }
        }
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isTenDigits(value) {
                if (value && value.length !== 10) {
                    throw new Error('Mobile number must be of 10 digits.');
                }
            }
        }
    },
    passwd: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user',
        allowNull: false
    },
    is_blocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull:  false
    }
},
{
    paranoid: true
});

module.exports = User;