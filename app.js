require("dotenv").config();
const express = require("express")
const app = express()
const cors = require("cors")
const cookieParser = require('cookie-parser')
const connectdb = require("./config/db")
const PORT = process.env.PORT
const authroutes = require("./routes/authRoutes")
const userroutes = require('./routes/userRoutes')


let isconnected = false

const startServer = async () => {
    try {
        await connectdb()
        isconnected = true
        console.log("MongoDB Connected")
    } catch (error) {
        console.error("Failed to start server:", error)
    }
}

startServer()


const allowedOrigins = ['http://localhost:5173']
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded())
app.use(cors({origin:allowedOrigins ,credentials: true}))
app.use(express.urlencoded({ extended: true }))


app.get('/', (req,res) => {
    res.send("api working")
})
app.use('/auth', authroutes)
app.use('/user', userroutes)


module.exports = app