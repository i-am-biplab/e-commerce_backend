const Product = require("../models/product");

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

// controller for adding product
const addProduct = async (req, res) => {
    const { title, desc, prod_img, categories, size, color, price } = req.body;
    
    // size = (size) ? size : null;
    // color = (color) ? color : null;

    try {
        const [product, created] = await Product.findOrCreate({
            where: { title },
            defaults: {
                desc,
                prod_img,
                categories,
                size,
                color,
                price
            }
        });

        if (created !== true) {
            res.status(409).json({message: "Product title already exists"});
        }
        else {
            res.status(201).json({message: "Product added successfully"});
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
}

// controller for updating product
const updateProduct = async (req, res) => {
    
}

// controller for deleting product
const deleteProduct = async (req, res) => {
    
}


module.exports = { showProduct, searchProduct, addProduct, updateProduct, deleteProduct }