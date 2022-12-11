const studentModel = require('../models/studentModel')
const valid = require('../validation/validation')
const createStudent = async function(req,res){
    try{
        let body = req.body
        if(!valid.isValidRequestBody(body))
            return res.status(400).send({status:false,massage:" User Data is Required in Body"})    
        
        let arr = ['studentName','subject','marks']
        for(let i = 0;i<arr.length;i++){
            if(!body[arr[i]]) return res.status(400).send({status:false,massage:`${arr[i]} is Mandatory`})    
            if(!valid.isValidString(body[arr[i]])) return res.status(400).send({status:false,massage:`${arr[i]} is Invalid`})
        }
        let {studentName,subject,marks} = body
        marks = Number(marks)
        if(isNaN(marks)) return res.status(400).send({status:false,massage:` Marks Should be in Number Format`})    

        let userId = req.userId
        let studentData = await studentModel.findOne({studentName:studentName,subject:subject,user:userId , isDeleted:false})
        if(studentData){
            marks += studentData.marks
            let savedData = await studentModel.findOneAndUpdate({_id:studentData.id},{$set:{marks:marks}},{new:true})
            return res.status(200).send({status:true,massage:` Data Updated SucessFully`,
                                    data:{studentName:savedData.studentName,
                                            subject:savedData.subject,
                                            marks:savedData.marks}})    
        }
        body.user = userId       
        let savedData = await studentModel.create(body)
        return res.status(201).send({status:true,massage:` Data Created SucessFully`,
                            data:{studentName:savedData.studentName,
                                    subject:savedData.subject,
                                    marks:savedData.marks}})    
    }
    catch(err){
        return res.status(500).send({status:false,massage:err.massage})
    }
}

const getStudent = async function(req,res){
    try{
        let userId = req.userId
        let findData = {user:userId , isDeleted:false}
        let {name , subject} = req.query

        if(name) findData['studentName'] = {$regex:name}

        if(subject) findData['subject'] = subject
        
        let students = await studentModel.find(findData,{_id:0,studentName:1,subject:1,marks:1})

        if(students.length==0)
            return res.status(400).send({status:false,massage:'Data Not Found by Given details'})  

        return res.status(200).send({status:true , massage:'Students Data',data:students})    
    }
    catch(err){
        return res.status(500).send({status:false,massage:err.massage})
    }
}
const deleteStudent = async function(req,res){
    try{
        let body = req.body
        if(!valid.isValidRequestBody(body))
            return res.status(400).send({status:false,massage:" User Data is Required in Body"})    
        let {studentName , subject} = body
        if(!studentName) return res.status(400).send({status:false,massage:" studentName is Mandatory"})    

        if(!subject) return res.status(400).send({status:false,massage:" subject is Mandatory"})   

        let studentId = req.params.studentId 
        if(!studentId) return res.status(400).send({status:false,massage:" studentId is Mandatory"})    
        if(!valid.isValidObjectId(studentId)) return res.status(400).send({status:false,massage:" studentId Invalid"})   

        let userId = req.userId
        let deleteData = {_id:studentId , studentName:studentName ,subject:subject,user:userId , isDeleted:false}
        let deleteStudent = await studentModel.findOneAndUpdate(deleteData,{$set:{isDeleted:true}})
        if(!deleteStudent)
            return res.status(400).send({status:false,massage:"Student Data Not Found By given Details"})
        return res.status(200).send({status:true,massage:"Student Data Deleted Successfull"})    
    }
    catch(err){
        return res.status(500).send({status:false,massage:err.massage})
    }
}
module.exports = {createStudent , getStudent , deleteStudent}