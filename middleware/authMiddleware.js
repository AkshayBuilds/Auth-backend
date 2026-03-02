const jwt = require('jsonwebtoken')

const userauth = async(req, res, next) => {
    // const authHeader = req.headers.authorization;
    // console.log(req.headers.authorization);
    // const token = authHeader.split(" ")[1];
    // console.log("token:",token)
    const authHeader = req.headers.authorization;

  // 🔥 check first
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Token missing"
    });
  }

  const token = authHeader.split(" ")[1];

    if(!token){
        return res.json({
            message: 'please Login fisrt token not found',
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
            message: "Not Authorized Login again ye wala",
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