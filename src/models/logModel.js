const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
    timeStamps:String,
    ipAddress:String,
    method:String,
    routeName:String
})

module.exports = mongoose.model('logDetails',logSchema)