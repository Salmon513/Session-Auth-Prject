const express = require('express')
const router = express.Router()
const User = require('../models/user')

//Middlewares
checkSignIn=(req,res,next)=>{
    if(req.session.user){
        next()  //If session exists, proceed to page
    }
    else{
        // let err = new Error("Not logged in!")
        // //console.log(req.session.user)
        // next(err) 
        res.render('showmessage',{message:"Error, trying to access unauthorized page",type:"error"})  //Error, trying to access unauthorized page
    }
}

router.get('/dashbord',checkSignIn,(req,res)=>{
    //console.log(req.session.user.fullname)
    res.render('dashbord',{name:req.session.user.fullname})
})

router.get('/login',(req,res)=>{
 res.render('login')
})

router.post('/login',(req,res)=>{
    let email=req.body.email
    let password=req.body.password
    let status=Object.values(req.body).includes('')
    if(status){
        res.render('showmessage',{type:"error",message:"Oops.. Some fielda are missing"})
    }
    
    User.findOne({email:email})
    .then((data)=>{
        if(data.email==req.body.email && data.password==req.body.password){
            req.session.user=data
            //console.log(req.session.user)
            res.redirect('/dashbord')
        }
        else{
            res.render('showmessage',{type:"error",message:"Invalid Password"})  
        }
        
    })
    .catch((err)=>{
        res.render('showmessage',{type:"error",message:"No User found with given email "})
        
    })   

})

router.get('/logout',(req,res)=>{
    req.session.destroy(()=>{
        //console.log('User logged out')
        
    })
    res.redirect('/login')
})

router.get('/register',(req,res)=>{
    res.render('register')
       
})

router.post('/register',(req,res)=>{
    
    let status = Object.values(req.body).includes(undefined) || Object.values(req.body).includes('')
    if(status){
        res.render('showmessage',{message:"Oops you missed to fill some fileds..",type:"error"})
    }
    User.findOne({email:req.body.email})
    .then((data)=>{
        if(data){
        res.render('showmessage',{type:"error",message:`User with email:${req.body.email} Already Exists`})
        }else{
        let {fullname,email,password,gender}=req.body
        let newUser = {
        fullname:fullname,
        email:email,
        password:password,
        gender:gender,
        createdAt:new Date()
        }
        User(newUser).save()
        .then(()=>{
            res.render('showmessage',{type:"error",message:"User Added Successfully"})
        })
        .catch(()=>{
                res.render('showmessage',{type:"error",message:"Something went Wrong"})
        })
        }
    })
    .catch(()=>{
        res.render('showmessage',{type:"error",message:"Something went Wrong"})
    })
})



//Cookies
// router.get('/cookie',(req,res)=>{
//     res.cookie('userTracker','Tracking you god',{expire:(1000 * 10)+Date.now()}).send('cookie set') //sets name =express
// })

// router.get('/clearcookie',(req,res)=>{
//     res.clearCookie('userTracker').send('UserTracker cookie cleared')
// })

//Sessions
// router.get('/dashbord',(req,res)=>{
//     if(req.session.page_views){
//         req.session.page_views++;
//         res.send(`you visited this page ${req.session.page_views} times`)
//     }
//     else{
//         req.session.page_views=1
//         res.send("welcome to this page for very first time!")
//     }
// })


//Bad Request
router.get('*',(req,res)=>{
    const html=
    `<html>
        <title>Bad Request</title>
        <body>
        <h1> Page not Found--404--  :(</h1>
        </body>            
    </html>`
    res.status(404).send(html)
})

module.exports = router