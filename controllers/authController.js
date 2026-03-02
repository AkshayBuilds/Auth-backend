const userModel = require("../models/userModel")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { transporter } = require("../config/nodemailer")

const register = async(req,res) => {

    let{ name, email, password} = req.body

    if(!name || !email || !password ){
        return res.json({
            message: "all Fileds are required",
            success:false
        })
    }
    try{
        const alreadyUser = await userModel.findOne({email})

    if(alreadyUser){
        return res.json({
            message: "User is already registered",
            success:false
        })
    }
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await userModel.create({
        name,
        email,
        password: hashedPassword
    })
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '7d' })
    // res.cookie('token', token, {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "None",
    //     maxAge: 7 * 24 * 60 * 60 * 1000  
    // })
    res.json({
        token,
        message: "User Register Successfully",
        success: true
    })

    const RegisterMail = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Welcome To Authontication',
        text: `welcome to Our site, Your Account has been Created with E-mail id: ${email}`
    }
    try {
        await transporter.sendMail(RegisterMail)
    } catch (mailErr) {
        return console.error("Mail sending failed:", mailErr)
    }
    }
    catch(err){
        return res.json({
            message: "something Went wrong",
            success:false
        })
    }
}

const login = async(req, res) => {
    let{email, password} = req.body

    if(!email || !password){
        return res.json({
            message: "E-mail and Password are Required",
            success:false
        })
    }
    try{
         const user = await userModel.findOne({email})

    if(!user){
        return res.json({
            message: "invalid Creadentials",
            success:false
        })
    }

    let validpass = await bcrypt.compare(password,user.password)
    if(!validpass){
        return res.json({
            message: "invalid Creadentials",
            success:false
        })
    }
    const token = await jwt.sign({ id: user._id}, process.env.JWT_SECRET, { expiresIn: '7d' })

    // res.cookie('token', token, {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "None",
    //     maxAge: 7 * 24 * 60 * 60 * 1000  
    // })
    res.json({
        token,
        message: "User Loggedin Successfully",
        success: true
    })

    const loginMail = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Welcome To Authontication',
        text: `welcome to Our site, Your Account has been Login with E-mail id: ${email}`
    }
    try {
        await transporter.sendMail(loginMail)
    } catch (mailErr) {
        return console.error("Mail sending failed:", mailErr)
    }

    }
    catch(err){
        return res.json({
            message:"Something Went Wrong"
        })
    }

}

const logout = (req,res) => {
    // res.clearCookie("token" , {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'production',
    //     sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    // });
    res.json({
      message: "Logout Successfully",
      success: true
    })
}

const sendverifyotp = async (req,res) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    const userId = req.userId

    try{
        const user = await userModel.findById(userId)
        if(user.isverified){
        return res.json({
            messgae:"User already Verified"
        })
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyotp = otp
    user.verifyotpexpireAt = Date.now() + 24 * 60 * 60 * 1000

    await user.save()

    const mailOption = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: 'Verify Your Email - Account Verification OTP',
        html: `<h2>Email Verification</h2>
                <p>Hello,</p>
                <p>Thank you for registering with us.</p>
                <p>Your verification OTP is:</p>
                <h1>${otp}</h1>
                <p>This OTP will expire in 24 hours.</p>
                <p>If you did not create this account, please ignore this email.</p>
                <br/>
                <p>Regards,<br/>Authontication Team</p>`,
            }
    await transporter.sendMail(mailOption)

    res.json({
        message: `OTP has been Sent on this Email: ${user.email}`,
        success: true
    })
    }
    catch(err){
        return res.json({
            message: err.message
        })
    }

}

const verifyOPT = async(req,res) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    const userId = req.userId
    const {otp} = req.body


    if(!userId || !otp){
        return res.json({
            message: "Details missing"
        })   
    }
    try {

        const user = await userModel.findById(userId)

        if(!user){
            return res.json({
                message: "user not found"
            })
        }

        if (!user.verifyotp || user.verifyotp !== otp.toString()) {
            return res.json({
                message: "Invalid OTP"
            });
        }
        if(user.verifyotpexpireAt < Date.now()){
            return res.json({
                message: "otp Expired"
            })
        }

        user.isverified = true;
        user.verifyotpexpireAt = 0;
        user.verifyotp = "";

        await user.save()
        res.json({
            message:"E-mail verified Successfully",
            success: true
        })
    } 
    catch (error) {
        return res.json({
            message: "Something Went Wrong"
        })
    }
}

const sendresetotp = async(req,res) => {
    const {email} = req.body

    if(!email){
        return res.json({
            message: "E-mail is Required"
        })
    }
    try {
        
        const user = await userModel.findOne({email})

        if(!user) {
            return res.json({
            message: "user not found"
        })
        }

         const otp = String(Math.floor(100000 + Math.random() * 900000));
         user.resetotp = otp
         user.resetotpexpireAt = Date.now() + 15 * 60 * 1000

    await user.save()

    const mailOption = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: 'Reset Your Password - OTP Verification',
        html: `
        <h2>Password Reset Request</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password.</p>
        <p>Your password reset OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire soon.</p>
        <p>If you did not request this, please ignore this email.</p>
        <br/>
        <p>Regards,<br/>Authontication Team</p>
        `

    }
    await transporter.sendMail(mailOption)

    res.json({
        message: "OTP Send successfully",
        success: true
    })

    } catch (error) {
        return res.json({
            message:"Something Went Wrong"
        })
    }
}

const verifyresetotp = async (req,res) => {
    const {otp, email, newpass} = req.body
    
    if(!email || !otp || !newpass){
        return res.json({
            message:"Details missing"
        })
    }
    try {

        const user = await userModel.findOne({email})

        if(!user){
            return res.json({
                message:"User not found"
            })
        }

        if (!user.resetotp || user.resetotp !== otp.toString().trim()) {
            return res.json({
                message: "Invalid OTP",
                success:false
            });
        }
        if(user.resetotpexpireAt < Date.now()){
            return res.json({
                message:"OTP is Expired"
            })
        }

        user.resetotp = '';
        user.resetotpexpireAt = 0;
        const hashpass = await bcrypt.hash(newpass, 12);
        user.password = hashpass
        await user.save()

        res.json({
                message:"Password Reset Successfully",
                success: true
            })

    } catch (error) {
        return res.json({
            message: error.message
        })
    }
}

const isauth = async(req,res) => {
    try {
        return res.json({
            success: true,
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        })
    }
}

module.exports = { register , login, logout, sendverifyotp, verifyOPT, sendresetotp, verifyresetotp, isauth}
