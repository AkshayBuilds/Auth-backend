 const mongoose = require("mongoose")

async function connectDB(){
    await mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("Database Connected Successfully")
    })
    .catch((err) => {
        console.log("connection Failed", err)
    })
 }
 module.exports = connectDB