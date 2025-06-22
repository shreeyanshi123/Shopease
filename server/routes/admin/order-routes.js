const express=require("express");

const {getAllOrdersofAllUsers,updateOrderStatus, getOrderDetailsForAdmin}=require('../../controllers/admin/order-controller');
const router=express.Router();


router.get("/get",getAllOrdersofAllUsers);
router.get("/details/:id",getOrderDetailsForAdmin);
router.put("/update/:id", updateOrderStatus);

module.exports=router;