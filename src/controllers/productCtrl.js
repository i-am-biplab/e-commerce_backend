const Product = require("../models/product");
const { search } = require("../routes/authRoutes");

// controller for showing product
const showProduct = async (req, res) => {
    const filter = (req.query.category) ? req.query.category : null;
    console.log(filter);
    res.send("show product");

    // const { userId } = req.body;

    // const affectedRow = await User.update({
    //     is_blocked: true
    // },
    // {
    //     where: {
    //         uid: userId
    //     }
    // });

    // if (affectedRow[0] === 1) {
    //     res.status(200).json({ isblocked: true, message: "User blocked successfully" });
    // }
    // else {
    //     res.status(500).json({ isblocked: false, message: "User blocking failed" });
    // }
}

// controller for searching product
const searchProduct = async (req, res) => {
    const search = (req.query.q) ? req.query.q : null;

    if (search === null) {
        console.log("No search query passed");
    }
    else {
        console.log(search);
    }
    res.send("search product");

    // const { userId } = req.body;

    // const affectedRow = await User.update({
    //     is_blocked: true
    // },
    // {
    //     where: {
    //         uid: userId
    //     }
    // });

    // if (affectedRow[0] === 1) {
    //     res.status(200).json({ isblocked: true, message: "User blocked successfully" });
    // }
    // else {
    //     res.status(500).json({ isblocked: false, message: "User blocking failed" });
    // }
}

// controller for blocking user


module.exports = { showProduct, searchProduct }