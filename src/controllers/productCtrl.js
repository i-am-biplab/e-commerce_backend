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
    const filepath = req.file ? req.file.path : null;

    console.log({ title, desc, categories, size, color, price});
    
    // size = (size) ? size : null;
    // color = (color) ? color : null;

    if (!filepath) {
        res.status(500).json({message: "No image uploaded"});
    }
    else {
        try {
            const [product, created] = await Product.findOrCreate({
                where: { title },
                defaults: {
                    desc,
                    prod_img: filepath,
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
}

// controller for adding product image
// const addProductImg = async (req, res) => {
//     const filepath = req.file ? req.file.path : null;
//     console.log({ filepath });

//     if (!filepath) {
//         res.status(500).json({message: "No file uploaded"});
//     }
//     else {
//         try {
            
//         } catch (error) {
//             res.status(500).json({ message: "Internal Server Error" });
//             console.log(error);
//         }
//     }
// }

// controller for updating product title
const updateProductTitle = async (req, res) => {
    const prodId = req.params.id;
    const { title } = req.body;

    try {
        const match = await Product.findOne({
            where: {title: title}
        });

        if (match !== null) {
            return res.status(200).json({message: "Title already exists"});
        }
        else {
            const affectedRow = await Product.update({
                title
            },
            {
                where: {
                    pid: prodId
                }
            });

            if (affectedRow[0] === 1) {
                res.status(200).json({ isupdated: true, message: "Product title updated successfully" });
            }
            else {
                res.status(500).json({ isupdated: false, message: "Product title updation failed" });
            }
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
}

// controller for updating product details
const updateProductDetails = async (req, res) => {
    const prodId = req.params.id;
    const { desc, categories, size, color, price } = req.body;
    const filepath = req.file ? req.file.path : null;

    console.log({ desc, categories, size, color, price});

    if (filepath) {
        try {
            const affectedRow = await Product.update({
                desc,
                prod_img: filepath,
                categories,
                size,
                color,
                price
            },
            {
                where: {
                    pid: prodId
                }
            });

            if (affectedRow[0] === 1) {
                res.status(200).json({ isupdated: true, message: "Product details updated successfully" });
            }
            else {
                res.status(500).json({ isupdated: false, message: "Product details updation failed" });
            }
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
            console.log(error);
        }
    }
    else {
        try {
            const affectedRow = await Product.update({
                desc,
                categories,
                size,
                color,
                price
            },
            {
                where: {
                    pid: prodId
                }
            });

            if (affectedRow[0] === 1) {
                res.status(200).json({ isupdated: true, message: "Product details updated successfully" });
            }
            else {
                res.status(500).json({ isupdated: false, message: "Product details updation failed" });
            }
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
            console.log(error);
        }
    }
}

// controller for deleting product
const deleteProduct = async (req, res) => {
    const prodId = req.params.d;

    try {
        const deletedRow = await Product.destroy({
            where: {
                pid: prodId
            }
        });
    
        if (deletedRow === 1) {
            res.status(200).json({ isdeleted: true, message: "Product deleted successfully" });
        }
        else {
            res.status(500).json({ isdeleted: false, message: "Product deletion failed" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
}

module.exports = { showProduct, searchProduct, addProduct, updateProductTitle, updateProductDetails, deleteProduct }