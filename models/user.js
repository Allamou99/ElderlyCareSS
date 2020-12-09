var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportlocalmongoose = require('passport-local-mongoose');


var Detailsshema = new Schema({
    age:{
        type:Number,
        
    },
    cardId:{
        type:String,
    },
    city:{
        type:String,
    },
    familySituation:{
        type:String,
    }
},
{
    timestamps: true
});

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
    details:Detailsshema
},
{
    timestamps: true
});



Userschema.plugin(passportlocalmongoose);
module.exports = mongoose.model('User',Userschema);