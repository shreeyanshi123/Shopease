const Order = require("../../models/Order");

const getAllOrdersofAllUsers = async (req, res) => {
    try {
    
        const orders = await Order.find({});

        if (!orders.length) {
            return res.status(404).json({
                success: false,
                message: "Order not found!",
            });
        }

        res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};


const getOrderDetailsForAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found!",
            });
        }

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};



const updateOrderStatus=async(req,res)=>{
    try{
        const {id}=req.params;
        const {orderStatus}=req.body;

        const order=await Order.findById(id);
        if(!order){
            return res.status(404).json({
                success:false,
                message:"Order not found!"
            });
        }
        await Order.findByIdAndUpdate(id,{orderStatus});
        res.status(200).json({
            success: true,
            message:"Order status is updated successfully!"
        });
        req.app.get('io').emit('dashboardUpdate', { type: 'order', action: 'update' });
        // Emit orderStatusUpdate event for live dashboard
        req.app.get('io').emit('orderStatusUpdate', {
          orderId: id,
          status: orderStatus,
          updatedAt: new Date()
        });
    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
}


module.exports={updateOrderStatus,getAllOrdersofAllUsers,getOrderDetailsForAdmin};