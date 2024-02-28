const sequelize = require("../db/conn");
const User = require("./user");
const Product = require("./product");
const Cart = require("./cart");
const Address = require("./address");
const Order = require("./order");

Cart.belongsTo(User, {foreignKey: "user_id"});
Cart.belongsTo(Product, {foreignKey: "prod_id"});
Address.belongsTo(User, {foreignKey: "user_id"});
Order.belongsTo(User, {foreignKey: "user_id"});
Order.belongsTo(Cart, {foreignKey: "cart_id"});
Order.belongsTo(Address, {foreignKey: "addr_id"});

(async () => {
    await User.sync({force: false});
    await Product.sync({force: false});
    await Cart.sync({force: false});
    await Address.sync({force: false});
    await Order.sync({force: false});
    // await sequelize.sync({force: false});
})();