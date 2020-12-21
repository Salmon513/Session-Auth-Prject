const express = require('express')
const app = express();
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const router = require('./routes/routs');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const mongoose = require('mongoose')
dotenv.config()
const PORT=process.env.PORT
const HOST=process.env.HOST

app.set('view engine','pug')
app.set('views','./views')

app.use(cookieParser())
app.use(session({
    secret:"It's a top secret...!",
    resave: true, 
    saveUninitialized: true
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.all('/',(req,res)=>{
    res.send("Hello World")
})
app.use('/dashbord',(req,res,err,next)=>{
    console.log(err)
    res.render('/login')
})
app.use('/',router)



const mongoString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.fceuh.mongodb.net/Test?retryWrites=true&w=majority`
const mongoClient=mongoose.connect(mongoString, {useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex:true})
.then(console.log("Connected to Atlas"))
.catch((err)=>{
    console.log(`Error Appeared : ${err}`)
})

app.listen(PORT,(err)=>{
    if(err) console.log(err)
    console.log(`Server running at http://${HOST}:${PORT}`)
})




