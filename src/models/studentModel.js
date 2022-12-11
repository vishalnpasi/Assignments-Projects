const mongoose = require('mongoose')

const ObjectId = mongoose.Schema.Types.ObjectId
// const subjects = ['Maths','English','Hindi']

const studentSchema = new mongoose.Schema({

    studentName:{type:String , required:true},

    subject:{ type:String , required:true },

    marks : {type:Number , required:true},

    user: { type:ObjectId , required:true},

    isDeleted:{type:Boolean,default:false}

},{timestamps:true})

module.exports = mongoose.model('Students',studentSchema)