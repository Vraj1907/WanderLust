const { required } = require('joi');
const mongoose = require('mongoose');

const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email :{
        type : String,
        required : true
    }
})

userSchema.plugin(passportLocalMongoose);
// Automatically passportLocalMongoose add the username,hashing,salting feild to the userSchema

module.exports = mongoose.model("User",userSchema);