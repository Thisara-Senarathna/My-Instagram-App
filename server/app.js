const express = require('express')
const app = express()
const PORT = 5000
const mongoose = require('mongoose')
const {MONGOURI} = require('./keys')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/post')
const userRoute = require('./routes/user')
const cors = require('cors')

// const custommiddleware = (req,res,next)=>{
//     console.log("Middleware executed!")
//     next()
// }

// // app.use(custommiddleware)         //middleware is executed for all routes

// app.get('/',(req,res)=> {
//     console.log("Home")
//     res.send("hello World")
// })

// app.get('/about',custommiddleware,(req,res)=> {
//     console.log("about")
//     res.send("About Page")
// })





mongoose.connect(MONGOURI)
mongoose.connection.on('connected', ()=>{
    console.log("connected to mongo yeahh")
})
mongoose.connection.on('error', (err)=>{
    console.log("error connting ",err)
})


require('./models/user')
require('./models/post')


app.use(cors())
app.use(express.json())
app.use(authRoute)
app.use(postRoute)
app.use(userRoute)




app.listen(PORT,()=>{
    console.log("Server is Running on ",PORT)
})

