const express=require('express');
const { createAOrder, getOrderByEmail } = require('./order.controller');

const router=express.Router();

//create order endpoint

router.post("/",createAOrder);

//get order by user email


router.get("/email/:email", async (req, res) => {
  const { email } = req.params;
  const orders = await Order.find({ email });
  res.json(orders);
});




module.exports=router;