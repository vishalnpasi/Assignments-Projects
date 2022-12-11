const userModel = require('../models/userModel')
const valid = require('../validation/validation')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createUser = async function(req,res){
    try{
        let body = req.body
        if(!valid.isValidRequestBody(body)) return res.status(400).send({status:false,massage:"User Data is Required in Body"})

        let arr = ['fname','lname','email','password','phone']
        for(let i = 0;i<arr.length;i++){
            if(!body[arr[i]]) return res.status(400).send({status:false,massage:`${arr[i]} is Mandatory`})
            if(!valid.isValidString(body[arr[i]])) return res.status(400).send({status:false,massage:`${arr[i]} is Invalid`})
        }
        let {fname , lname , email , password , phone}  = body
        if(!valid.isValidName(fname)) return res.status(400).send({status:false,massage:"fname is Invalid"})

        if(!valid.isValidName(lname)) return res.status(400).send({status:false,massage:"lname is Invalid"})

        if(!valid.isValidEmail(email)) return res.status(400).send({status:false,massage:" Email is Invalid"})

        let checkEmail = await userModel.findOne({email:email})
        if(checkEmail) return res.status(400).send({status:false,massage:" Email is Already Exist"})

        if(!valid.isValidPassword(password)) return res.status(400).send({status:false,massage : "password is invalid, it contain min 8 and max 15 letters must contain min 1 char , min 1 number" })

        if(!valid.isValidPhone(phone)) return res.status(400).send({status:false,massage : " Phone Number is Invalid , is Must Contain 10 digit and start with 6-9" })
        let checkPhone = await userModel.findOne({phone:phone})
        if(checkPhone) return res.status(400).send({status:false,massage:" Phone is Already Exist"})

        let encryptedPassword = await bcrypt.hash(password , 10)
        let createData = {fname:fname , lname:lname , email:email,password:encryptedPassword , phone:phone}

        let savedData = await userModel.create(createData)
        return res.status(201).send({status:true,massage:"User Created Successfully",data:savedData})
    }
    catch(err){
        return res.status(500).send({status:false,massage:err.massage})
    }
}


const login = async function(req,res){
    try{
        if(!valid.isValidRequestBody(req.body)) return res.status(400).send({status:false,massage:"User Data is Required in Body"})
        const {email , password} = req.body

        if(!email) return res.status(400).send({status:false,massage:`email is Mandatory`})
        if(!valid.isValidEmail(email)) return res.status(400).send({status:false,massage:" Email is Invalid"})
        let userDetail = await userModel.findOne({email:email})
        if(!userDetail) return res.status(404).send({status:false,massage:" User Data Not Found"})

        if(!password) return res.status(400).send({status:false,massage:`password is Mandatory`})

        let check = await bcrypt.compare(password,userDetail.password)
        if(!check) return res.status(400).send({status:false,massage:"Invalid Password"})

        let payload = {userId:userDetail.id}
        
        let token = jwt.sign(payload,process.env.SECRATE_KEY , {expiresIn:"24h"})

        return res.status(200).send({status:true,massage:"login Successfully",data:{token:token,id:userDetail.id}})

    }
    catch(err){
        return res.status(500).send({status:false,massage:err.massage})
    }
}

module.exports = {createUser,login}