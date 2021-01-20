var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var locationSchema = new Schema({
    long:{
        type:Number,
        required:true
    },
    lat:{
        type:Number,
        required:true
    }
})

var requestSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    type:{
        type:String,
        required:true
    },
    dueDate:{
        type:Date,
        required:true
    },
    familySituation:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    loading:{
        type:Boolean,
        required:true
    },
    reqResponded:{
        type:Boolean,
        required:true
    },
    urgent:{
        type:Boolean,
        required:true
    },
    location:{
        type: locationSchema,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    helps:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        }
    ]
},
{
    timestamps: true
});



module.exports = mongoose.model('Request', requestSchema);

/*helps:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }
]*/