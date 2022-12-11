const jwt = require("jsonwebtoken")
const userModel = require('../models/userModel')
const authorization = async function(req , res , next){
    try{
        
        let token = req.headers['authorization']
        
        if(!token) return res.status(401).send({status:false,massage:" Token must be present in Headers"})
        token = token.split(" ")[1]

        jwt.verify(token, process.env.SECRATE_KEY,async function (err, decodedToken) {
            if (err)
                return res.status(401).send({ status: false, massage: "Invalid Token" })

            let userData = await userModel.findOne({_id: decodedToken.userId })
            if (!userData)
                return res.status(404).send({ status: false, massage: "User DATA NOT FOUND" })
            req.userId = decodedToken.userId
            next()
        })
    }
    catch(err){
        return res.status(500).send({status:false,massage:err.massage})
    }
}
module.exports = {authorization}