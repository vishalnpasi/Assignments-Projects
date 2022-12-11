const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const multer = require('multer')
const mongoose = require('mongoose')
const rout = require('./routes/router')
const moment = require('moment')
const logModel = require('./models/logModel')
require('dotenv').config()  // const dotenv = require('dotenv')
                            // dotenv.config() // config({path:path.join(_dirname.'../.env)})

app.use(bodyParser.json())
app.use(multer().any())

mongoose.connect(process.env.CLUSTER, { useNewUrlParser: true })
    .then(() => console.log("mongoDB connnected"))
    .catch((err) => console.log(err))

app.use(async function (req, res, next) {
    let timeStamps = moment().format("DD-MMMM-YYYY hh:mm:ss a")
    let ipAddress = req.socket.localAddress
    let method = req.method
    let routeName = req._parsedUrl.path
    await logModel.create({ timeStamps: timeStamps, ipAddress: ipAddress, method: method, routeName: routeName })
    next();
})

app.use('/', rout)
app.listen(process.env.PORT, function () {
    console.log('app running on ', process.env.PORT)
})

