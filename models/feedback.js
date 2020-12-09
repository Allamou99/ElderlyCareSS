var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var feedbackSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    inNeed:{
        type:Boolean,
    },
    rating:{
        type:Number,
        required:true,
    },
    comment:{
        type:String,
        required:true,
    }
},
{
    timestamps:true
});

module.exports = mongoose.model('Feedback', feedbackSchema);
