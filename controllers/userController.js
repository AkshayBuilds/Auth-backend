const userModel = require('../models/userModel')

const userData = async(req,res) => {

    const { userId } = req

    try {
        const user = await userModel.findById(userId)

        if(!user){
            return res.status(504).json({
            message: "User Not Found"
        })
        }

        res.status(200).json({
            message: "user Featch Successfully",
            success:true,
            user: {
                name:user.name,
                email: user.email,
                isVerified: user.isverified
            }
        })
        
    } catch (error) {
        return res.status(500).json({
            message: "Something Went Wrong"
        })
    }
}

module.exports = { userData };