require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const connectdb = require("./config/db");
const authroutes = require("./routes/authRoutes");
const userroutes = require("./routes/userRoutes");

let isConnected = false;

const startServer = async () => {
    try {
        await connectdb();
        isConnected = true;
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("Failed to start server:", error);
    }
}

startServer();

const allowedOrigins = [
  "https://auth-frontend-umber-theta.vercel.app/"
];

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.get("/", (req, res) => {
  res.send("api working");
});

app.use("/auth", authroutes);
app.use("/user", userroutes);

module.exports = app;
