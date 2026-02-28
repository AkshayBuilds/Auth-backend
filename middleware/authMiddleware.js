const jwt = require('jsonwebtoken')

const userauth = async(req, res, next) => {
    const { token } = req.cookies

    if(!token){
        return res.json({
            message: 'please Login fisrt',
            success:false
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(decoded.id){
            req.userId = decoded.id
            next()
        }else{
            return res.json({
            message: "Not Authorized Login again",
            success:false
        })
    }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }

}


module.exports = userauth