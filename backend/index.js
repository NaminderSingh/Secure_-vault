const express = require('express');
const app = express()
const cors = require('cors')
const {MONGODB_URL,PORT}=require('./config/serverConfig')
const mongoose = require('mongoose')
const authenticationRoute=require('./routes/authenticationRoute')
const uploadImageRoute=require('./routes/uploadImageRoute')
const getImageRoute=require('./routes/getImageRoute')
const shareImageRoute=require('./routes/shareImageRoute')
const getSharedImagesRoute = require('./routes/getSharedImages')
const numberOfImagesRoute= require('./routes/numberOfImagesRoute')
const connectDB=(url)=>{
    return mongoose.connect(url);
}
app.use(cors())
app.use(express.json())

app.use('/api',authenticationRoute)
app.use('/api',uploadImageRoute)
app.use('/api',getImageRoute)
app.use('/api',shareImageRoute)
app.use('/api',getSharedImagesRoute)
app.use('/api',numberOfImagesRoute)


async function serverStart(){
    try {
        console.log("hello")
        await connectDB(MONGODB_URL)
       

        app.listen(3000,()=>{
            console.log("server is running")
        }) 
    } catch (error) {
        console.log(error)
    }
}

serverStart()