const { Op } = require("sequelize");
const Product = require("../models/product");

// controller for showing product
const showProduct = async (req, res) => {
    const filter = (req.query.category) ? req.query.category : null;
    console.log(filter);
    
    if (filter) {
        try {
            const products = await Product.findAll({
                attributes: ["pid", "categories", "title", "desc", "prod_img", "size", "color", "price"],
                where: {
                    categories: {
                        [Op.like]: `%${filter}%`
                    }
                }
            });

            res.status(200).json({products});
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
            console.log(error);
        }
    }
    else {
        try {
            const products = await Product.findAll({
                attributes: ["pid", "categories", "title", "desc", "prod_img", "size", "color", "price"]
            });

            res.status(200).json({products});
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
            console.log(error);
        }
    }
}

// controller for searching product
const searchProduct = async (req, res) => {
    const search = (req.query.q) ? req.query.q : null;
    console.log(search);

    if (search === null) {
        res.status(500).json({ message: "No search query passed" });
    }
    else {
        try {
            const products = await Product.findAll({
                attributes: ["pid", "categories", "title", "desc", "prod_img", "size", "color", "price"],
                where: {
                    [Op.or]: {
                        categories: {
                            [Op.like]: `%${search}%`
                        },
                        title: {
                            [Op.like]: `%${search}%`
                        },
                        desc: {
                            [Op.like]: `%${search}%`
                        },
                        size: {
                            [Op.like]: `%${search}%`
                        },
                        color: {
                            [Op.like]: `%${search}%`
                        }
                    }
                }
            });

            res.status(200).json({products});
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
            console.log(error);
        }
    }
}

// controller for adding product
const addProduct = async (req, res) => {
    const { title, desc, categories, size, color, price } = req.body;
    console.log({ title, desc, categories, size, color, price});
    
    // size = (size) ? size : null;
    // color = (color) ? color : null;

    try {
        const [product, created] = await Product.findOrCreate({
            where: { title },
            defaults: {
                desc,
                prod_img: "prodImg\\1709291426036_amazon_logo.png",
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

// controller for adding product image
const addProductImg = async (req, res) => {
    const filepath = req.file ? req.file.path : null;
    console.log({ filepath });

    if (!filepath) {
        res.status(500).json({message: "No file uploaded"});
    }
    else {
        try {
            
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
            console.log(error);
        }
    }
}

// controller for updating product
const updateProduct = async (req, res) => {
    
}

// controller for deleting product
const deleteProduct = async (req, res) => {
    
}


module.exports = { showProduct, searchProduct, addProduct, addProductImg, updateProduct, deleteProduct }