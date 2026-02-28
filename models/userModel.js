const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
    },
    verifyotp:{
      type: String,
      default: ''
    },
    verifyotpexpireAt:{
      type:Number,
      default: 0
    },
    isverified:{
      type:Boolean,
      default: false
    },
    resetotp:{
      type:String,
      default: ''
    },
    resetotpexpireAt:{
      type:Number,
      default: 0
    }
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model('user', userSchema)

module.exports = userModel