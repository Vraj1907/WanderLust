const express = require("express");
const app = express();
const path = require('path')
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"));

const users = require("./route/user.js");
const posts= require("./route/post.js");

const session = require("express-session")
const flash = require('connect-flash');
const { error } = require("console");

const sessionOption = {secret: "myString",
    resave : true,
     saveUninitialized : false
}
app.use(flash())
 

app.use(session(sessionOption))
app.use((req,res,next)=>{
 res.locals.sucessMsg = req.flash("sucess");
 res.locals.errorMsg = req.flash("error");
    next();
})

app.get("/ok",(req,res)=>{

    let { name= "ananymous"} = req.query;
    req.session.name = name;
if(name === "ananymous"){

            req.flash("error","user not found");
    }
    else{
            req.flash("sucess","name added sucessfully");
    }


  
  res.redirect("/hello");
})
// sessions work is to store different values that we can store in different pages (routes)
app.get("/hello",(req,res)=>{

res.render("page.ejs",{name : req.session.name })
})

//  app.get("/get",(req,res)=>{

//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count =1 ;
//     }
//      res.send(`there are differnt ${req.session.count} is used`);

//  })



// app.get("/test",(req,res)=>{
//     res.send("working")
// })

app.listen(3000,(req,res)=>{

    console.log("the app is running on 3000");
})