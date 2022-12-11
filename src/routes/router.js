const express = require('express')
const router = express()
const userController = require('../controllers/userController')
const studentController = require('../controllers/studentController')
const mid = require('../middleware/mid')

//===============================[ User APIs ]=================================================

router.post('/user/register',userController.createUser)

router.post('/user/login',userController.login)

//============================ [ Stundent APIs ]================================================

router.post('/user/student',mid.authorization , studentController.createStudent)

router.get('/user/student',mid.authorization , studentController.getStudent)

router.delete('/user/student/:studentId',mid.authorization , studentController.deleteStudent)

//=============================[ Invalid Params ]============================================

router.use(function(req,res){
    return res.status(400).send({status:false,massage:"Invalid Params"})
})

module.exports = router