if(process.env.NODE_ENV != "production"){
require('dotenv').config()
}


const express = require("express");
const app = express();
const path = require('path')

const methodOverride = require('method-override');
const {listingSchema,reviewSchema}=require("./schema.js")
const cors = require("cors");
app.use(cors());
const wrapAsync = require("./utils/wrapAsync")
const ExpressError = require("./utils/expressError.js")
const Review = require('./models/review.js')
app.use(express.json());
// ejs-mate is for applying boilerplate code 
const ejsMate = require("ejs-mate")
app.use(methodOverride("_method"))

// It is for applying style in public/css
app.use(express.static(path.join(__dirname,"/public")))

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));

app.engine("ejs", ejsMate);
const Listing = require("./models/listing.js");
const bookingRouter = require('./routes/booking.js');

const mongoose = require('mongoose');
const { error } = require("console");
const flash = require('connect-flash')

const passport = require('passport');
const localStratagy = require('passport-local')
const User = require('./models/user.js')

//For sessions
const session = require('express-session');
const sessionOption = {
    secret : "mysupersecretcode",
    resave : true,
   saveUninitialized : false,
   cookie :{
    
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7*24*60*60*1000,
    httpOnly : true
   }
}
// app.get("/",(req,res)=>{
//     res.send("working");
// })

app.use(session(sessionOption))
app.use(flash());

// app.get("/demoUser",async(req,res)=>{

// let fakeUser = new User({
//     email : "vrajpatel123@gmail.com",
//     username : 'jod_45',

// })
//     let registerdUser = await User.register(fakeUser,"abc@123");
//     res.send(registerdUser);

// })

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratagy(User.authenticate()))
// authenticate() => genetrates a function that is used in passport's local strategy
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.sucessMsg = req.flash("sucess");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;

    next();
})

const listingRouter = require("./routes/listings.js")
const reviewRouter = require("./routes/reviews.js")
const userRouter = require("./routes/user.js")




const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust"


main()
.then(()=>{
    console.log("working");
})
.catch((err)=>{
    console.log(err);
})
async function main() {
    await mongoose.connect(Mongo_URL);
}









// this is also write like this 
// app.use((err,req,res,next)=>{
//    let {statusCode = 500, message= "Something went wrong"} = err;
//    res.status(statusCode).send(message) 
//    res.render("error.ejs");
// })



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter)
app.use("/",bookingRouter)
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", {  message });
});
app.use((req, res, next) => {
    res.locals.currUser = req.user;
    next();
});
app.listen(3000,(req,res)=>{
    console.log("app is running on 3000")
})