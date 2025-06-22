const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");
const handleImageUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const url = `data:${req.file.mimetype};base64,${b64}`;
        const result = await imageUploadUtil(url);

        res.json({
            success: true,
            result,
        });
    } catch (err) {
        console.error("Image upload error:", err);
        res.status(500).json({
            success: false,
            message: "Error occurred while uploading the image",
        });
    }
};

// add product
const addProduct = async (req, res) => {
    try {
        const { image, title, description, category, brand, price, salePrice, totalStock, averageReview } = req.body;
        const newProduct = new Product({
            image,
            title,
            description,
            category,
            brand,
            price,
            salePrice,
            totalStock,
            averageReview
        });
        await newProduct.save();
        // Emit dashboard update
        req.app.get('io').emit('dashboardUpdate', { type: 'product', action: 'add' });
        // Emit lowStock event if stock is low
        if (newProduct.totalStock !== undefined && newProduct.totalStock <= 5) {
          req.app.get('io').emit('lowStock', {
            productId: newProduct._id,
            title: newProduct.title,
            stock: newProduct.totalStock
          });
        }
        // Emit newProduct event for shoppers
        req.app.get('io').emit('newProduct', {
          productId: newProduct._id,
          title: newProduct.title,
          category: newProduct.category,
          brand: newProduct.brand
        });
        res.status(201).json({
            success: true,
            data: newProduct,
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Error occured!",
        })
    }

}



// fetch product
const fetchAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({
            success: true,
            data: products,
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Error occured!",
        })
    }

}
// edit a product
const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { image, title, description, category, brand, price, salePrice, totalStock, averageReview } = req.body;

        const response = await Product.findByIdAndUpdate(id,
            { title: title, description: description, category: category, brand: brand, price: price, salePrice: salePrice, totalStock: totalStock, averageReview: averageReview }, { new: true });

        res.status(200).json({
            success: true,
            data: response,
        })
        req.app.get('io').emit('dashboardUpdate', { type: 'product', action: 'edit' });
        // Emit lowStock event if stock is low after edit
        if (response && response.totalStock !== undefined && response.totalStock <= 5) {
          req.app.get('io').emit('lowStock', {
            productId: response._id,
            title: response.title,
            stock: response.totalStock
          });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Error occured!",
        })
    }

}
// delete a product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await Product.findByIdAndDelete(id);
        if (response) {
            res.status(200).json({
                success: true,
                message: "Product deleted successfully",
            })
            req.app.get('io').emit('dashboardUpdate', { type: 'product', action: 'delete' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Error occured!",
        })
    }

}

module.exports = { handleImageUpload, addProduct, fetchAllProducts, editProduct, deleteProduct };
