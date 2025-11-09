const User = require('../models/user');
//Signup get route
module.exports.renderSignupForm = (req,res)=>{

    res.render("user/signup.ejs");
}

//Signup Post route
module.exports.signUp = async(req,res)=>{
    try{
 let {username,email,password} = req.body;
    const newUser = new User({
 email,username

    })
   const registerdUser =  await  User.register(newUser,password);
   console.log(registerdUser);
   req.login(registerdUser,(err)=>{
    if(err){
        next(err);
    }
   req.flash("sucess","Welcome to Wanderlust");
   res.redirect('/listings')
   })
    }
    catch(err){

        req.flash("error",err.message);
                res.redirect("/signUp")
    }
   
}

//Login get
module.exports.renderLoginForm = (req,res)=>{
    res.render("user/login.ejs")
}
//Login post
module.exports.login = async(req,res)=>{
  
    req.flash("sucess"," Welcome to Wanderlust!!!!");
    let redirectUrl = res.locals.redirectUrl || "/listings" // It is for when we do login it is redirected to /listings
    
    res.redirect(redirectUrl)
};
//Logout get
module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{

        if(err){
           return next(err);   // usually error is not occurr during logout
        }
req.flash("sucess","You are loggeed Out");
res.redirect("/listings");
 
})

}