const sequelize = require("../db/conn");
// const Blog = require("./blog");
const User = require("./user");

// Blog.belongsTo(User, {foreignKey: "uid"});

(async () => {
    await sequelize.sync({force: false});
})();