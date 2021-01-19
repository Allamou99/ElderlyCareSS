var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportlocalmongoose = require('passport-local-mongoose');




var Userschema = new Schema({
    username:{
        type:String,
        required:true
    },
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    inNeed:{
        type:Boolean,
        required:true
    },
    isDoctor:{
        type:Boolean,
        required:true
    },
    telNumber:{
        type:String,
        required:true
    },
    mail:{
        type:String,
        required:true
    }
    
},
{
    timestamps: true
});

Userschema.plugin(passportlocalmongoose);
module.exports = mongoose.model('User',Userschema);