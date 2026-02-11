/*

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

  console.log("MONGO URI:", process.env.DB_URL);
console.log("DB NAME:", mongoose.connection.name);
console.log("HOST:", mongoose.connection.host);
 

console.log("COLLECTIONS:", await mongoose.connection.db.listCollections().toArray());
console.log("BOOKS COUNT:", await mongoose.connection.db.collection("books").countDocuments());

   
}

main().catch(err => console.error(err));
*/
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// ---------- Helpers ----------
function maskMongoUri(uri = "") {
  // masks password: mongodb+srv://user:PASS@host -> mongodb+srv://user:****@host
  return uri.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@)/, "$1****$3");
}

// ---------- Middleware ----------
app.use(express.json());

// CORS: allow both local dev + docker/nginx frontend
const allowedOrigins = [
  "http://localhost:5173", // Vite dev
  "http://localhost", // nginx on port 80
  "http://127.0.0.1",
  "http://bookstore-alb-536860303.ap-south-1.elb.amazonaws.com", // ALB DNS (change if yours is different)
];

app.use(
  cors({
    origin: function (origin, cb) {
      // allow requests with no origin (Postman, curl)
      if (!origin) return cb(null, true);

      if (allowedOrigins.includes(origin)) return cb(null, true);

      return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  }),
);

 


// health check for ALB target group
app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true, service: "bookstore-backend" });
});

console.log("✅ LOADED FILE: index.js (or whatever filename this is)");

// ---------- Routes ----------
const bookRoutes = require("./src/books/book.route");
const orderRoutes = require("./src/orders/order.route");
const userRoutes = require("./src/users/user.route");
const adminRoute = require("./src/stats/admin.stats");

app.get("/", (req, res) => res.send("Book store server is running!"));

app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoute);


function listRoutes(app) {
  const routes = [];
  app._router?.stack?.forEach((layer) => {
    if (layer.route?.path) {
      const methods = Object.keys(layer.route.methods).join(",").toUpperCase();
      routes.push(`${methods} ${layer.route.path}`);
    } else if (layer.name === "router" && layer.handle?.stack) {
      layer.handle.stack.forEach((h) => {
        if (h.route?.path) {
          const methods = Object.keys(h.route.methods).join(",").toUpperCase();
          routes.push(`${methods} ${h.route.path}`);
        }
      });
    }
  });
  console.log("=== ROUTES ===\n" + routes.sort().join("\n") + "\n=============");
}


 

 

// ---------- Start ----------
async function main() {
  try {
    const dbUrl = process.env.DB_URL;

    if (!dbUrl) {
      console.error(
        "❌ DB_URL is missing. Check your .env / docker-compose env.",
      );
      process.exit(1);
    }

    console.log("DB_URL USED:", maskMongoUri(dbUrl));

    await mongoose.connect(dbUrl);

    console.log("✅ MongoDB connected!");
    console.log("DB NAME:", mongoose.connection.name);
    console.log("HOST:", mongoose.connection.host);

    // (Optional) quick sanity checks
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "COLLECTIONS:",
      collections.map((c) => c.name),
    );

    const booksCount = await mongoose.connection.db
      .collection("books")
      .countDocuments();
    console.log("BOOKS COUNT:", booksCount);

    app.get("/health", (req, res) => {
      res.status(200).send("OK");
    });

    listRoutes(app);

    app.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err?.message || err);
    process.exit(1);
  }
}

main();
