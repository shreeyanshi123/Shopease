const mongoose = require('mongoose');
const Cart = require('../../models/Cart');
const Product = require('../../models/Product');


const addToCart = async (req, res) => {
    try {
        console.log('addToCart request body:', req.body);
        let { userId, productId, quantity } = req.body;
        // Validate presence
        if (!userId || !productId || typeof quantity !== 'number' || quantity <= 0) {
            console.error('Invalid data provided:', { userId, productId, quantity });
            return res.status(400).json({
                success: false,
                message: "Invalid data provided!",
            });
        }
        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.error('Invalid userId for addToCart:', userId);
            return res.status(400).json({
                success: false,
                message: "Invalid user id",
            });
        }
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            console.error('Invalid productId for addToCart:', productId);
            return res.status(400).json({
                success: false,
                message: "Invalid product id",
            });
        }
        userId = new mongoose.Types.ObjectId(userId);
        productId = new mongoose.Types.ObjectId(productId);
        const product = await Product.findById(productId);
        if (!product) {
            console.error('Product not found for productId:', productId);
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }
        const findCurrentProductIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId.toString()
        );
        if (findCurrentProductIndex === -1) {
            cart.items.push({ productId, quantity });
        } else {
            cart.items[findCurrentProductIndex].quantity += quantity;
        }
        await cart.save();
        await cart.populate({
            path: "items.productId",
            select: "image title price salePrice",
        });
        const populateCartItems = cart.items.map((item) => ({
            productId: item.productId ? item.productId._id : null,
            image: item.productId ? item.productId.image : null,
            title: item.productId ? item.productId.title : "Product not found",
            price: item.productId ? item.productId.price : null,
            salePrice: item.productId ? item.productId.salePrice : null,
            quantity: item.quantity,
        }));
        res.status(200).json({
            success: true,
            data: {
                items: populateCartItems,
            },
        });
    } catch (e) {
        console.error('Error in addToCart:', e);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

const fetchCartItems = async (req, res) => {
    try {
        let { userId } = req.params;
        console.log('fetchCartItems userId param:', userId);
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User id is required',
            });
        }
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.error('Invalid userId for cart fetch:', userId);
            return res.status(400).json({
                success: false,
                message: 'Invalid user id',
            });
        }
        userId = new mongoose.Types.ObjectId(userId);
        const cart = await Cart.findOne({ userId }).populate({
            path: "items.productId",
            select: "image title price salePrice",
        });
        if (!cart) {
            console.log('No cart found for userId:', userId);
            return res.status(200).json({
                success: true,
                data: { items: [] },
            });
        }
        const validItems = cart.items.filter(
            (productItem) => productItem.productId
        );
        if (validItems.length < cart.items.length) {
            cart.items = validItems;
            await cart.save();
        }
        const populateCartItems = validItems.map((item) => ({
            productId: item.productId._id,
            image: item.productId.image,
            title: item.productId.title,
            price: item.productId.price,
            salePrice: item.productId.salePrice,
            quantity: item.quantity,
        }));
        res.status(200).json({
            success: true,
            data: {
                items: populateCartItems,
            }
        });
    } catch (e) {
        console.error('Error in fetchCartItems:', e);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

const updateCartItemQty = async (req, res) => {
    try {
        let { userId, productId, quantity } = req.body;
        console.log('updateCartItemQty body:', { userId, productId, quantity });
        if (!userId || !productId || typeof quantity !== 'number' || quantity <= 0) {
            console.error('Invalid data for updateCartItemQty:', { userId, productId, quantity });
            return res.status(400).json({
                success: false,
                message: "Invalid data provided!"
            });
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.error('Invalid userId for updateCartItemQty:', userId);
            return res.status(400).json({
                success: false,
                message: "Invalid user id",
            });
        }
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            console.error('Invalid productId for updateCartItemQty:', productId);
            return res.status(400).json({
                success: false,
                message: "Invalid product id",
            });
        }
        userId = new mongoose.Types.ObjectId(userId);
        productId = new mongoose.Types.ObjectId(productId);
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            console.log('No cart found for userId in updateCartItemQty:', userId);
            return res.status(404).json({
                success: false,
                message: "Cart not found!"
            });
        }
        let updated = false;
        cart.items = cart.items.map((item) => {
            const id = item.productId && item.productId._id ? item.productId._id.toString() : item.productId.toString();
            if (id === productId.toString()) {
                updated = true;
                return { ...item.toObject(), quantity };
            }
            return item;
        });
        if (!updated) {
            console.log('Cart item not present in updateCartItemQty:', productId);
            return res.status(404).json({
                success: false,
                message: "Cart item is not present"
            });
        }
        await cart.save();
        await cart.populate({
            path: "items.productId",
            select: "image title price salePrice",
        });
        const populateCartItems = cart.items.map((item) => ({
            productId: item.productId ? item.productId._id : null,
            image: item.productId ? item.productId.image : null,
            title: item.productId ? item.productId.title : "Product not found",
            price: item.productId ? item.productId.price : null,
            salePrice: item.productId ? item.productId.salePrice : null,
            quantity: item.quantity,
        }));
        console.log('Cart after update:', cart.items);
        res.status(200).json({
            success: true,
            data: {
                items: populateCartItems,
            },
        });
    } catch (e) {
        console.error('Error in updateCartItemQty:', e);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

const deleteCartItems = async (req, res) => {
    try {
        let { userId, productId } = req.params;
        console.log('deleteCartItems params:', { userId, productId });
        if (!userId || !productId) {
            console.error('Invalid data provided for delete:', { userId, productId });
            return res.status(400).json({
                success: false,
                message: "Invalid data provided!",
            });
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.error('Invalid userId for deleteCartItems:', userId);
            return res.status(400).json({
                success: false,
                message: "Invalid user id",
            });
        }
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            console.error('Invalid productId for deleteCartItems:', productId);
            return res.status(400).json({
                success: false,
                message: "Invalid product id",
            });
        }
        userId = new mongoose.Types.ObjectId(userId);
        productId = new mongoose.Types.ObjectId(productId);
        const cart = await Cart.findOne({ userId }).populate({
            path: 'items.productId',
            select: 'image salePrice price title',
        });
        if (!cart) {
            console.log('No cart found for userId in delete:', userId);
            return res.status(200).json({
                success: true,
                data: { items: [] },
            });
        }
        cart.items = cart.items.filter((item) => {
            // Handle both populated and unpopulated productId
            const id = item.productId && item.productId._id ? item.productId._id.toString() : item.productId.toString();
            return id !== productId.toString();
        });
        await cart.save();
        await cart.populate({
            path: "items.productId",
            select: "image title price salePrice",
        });
        const populateCartItems = cart.items.map((item) => ({
            productId: item.productId ? item.productId._id : null,
            image: item.productId ? item.productId.image : null,
            title: item.productId ? item.productId.title : "Product not found",
            price: item.productId ? item.productId.price : null,
            salePrice: item.productId ? item.productId.salePrice : null,
            quantity: item.quantity,
        }));
        res.status(200).json({
            success: true,
            data: {
                items: populateCartItems,
            },
        });
    } catch (e) {
        console.error('Error in deleteCartItems:', e);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

module.exports = {
    addToCart,
    deleteCartItems,
    fetchCartItems,
    updateCartItemQty
}
