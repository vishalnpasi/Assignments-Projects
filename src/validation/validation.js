const mongoose = require('mongoose')

const isValidString = function (value) {
    if (typeof (value) !== "string" || typeof (value) === 'undefined' || value === null) return false
    if (typeof (value) === 'string' && value.trim().length == 0) return false
    return true
}
const isValidName = (name) =>{
    return /^[a-zA-Z]+([\s][a-zA-Z]+)*$/.test(name)
}
const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}
const isValidRequestBody = function (reqBody) {
    return Object.keys(reqBody).length > 0
}
const isValidEmail = function (email) {
    return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email) //  /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{1,3})+$/
}
const isValidPhone = function (phone) {
    return /^[6-9]\d{9}$/.test(phone)
}
const isValidPassword = function (password) {
    // return /^(?=.*[a-z]).{8,15}$/.test(password)
    return /^(?=.*\d)(?=.*[a-z]).{8,15}$/.test(password)
}
module.exports = { isValidString , isValidName , isValidObjectId , isValidRequestBody , isValidEmail , 
                    isValidPhone , isValidPassword }