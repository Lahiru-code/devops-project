 const express = require("express");
 const app = express();
const cors=require("cors")

const mongoose = require("mongoose");
const port =process.env.PORT||5000;
require("dotenv").config();
//middleware
app.use(express.json());
 
   
app.use(cors({
  origin: "http://localhost:5173", // exact frontend URL
  credentials: true
}));

 
 
//routes

const bookRoutes=require('./src/books/book.route')
const orderRoutes=require("./src/orders/order.route")
const userRoutes = require("./src/users/user.route")
const AdminRoute =require("./src/stats/admin.stats")

app.use("/api/books",bookRoutes)
app.use("/api/orders",orderRoutes)
app.use("/api/auth",userRoutes)
app.use("/api/admin",AdminRoute)


async function main(){
await mongoose.connect(process.env.DB_URL)  // no options needed
  .then(() => {
    console.log("✅ MongoDB connected!");
    app.get("/", (req, res) => res.send("Book store server is running!"));
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  })
   
}

main().catch(err => console.error(err));
