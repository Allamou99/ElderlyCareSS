const express = require('express');
const bodyParser = require('body-parser');
const {google} = require('googleapis');
const mongoose = require('mongoose');
const Requests = require('../models/request');

const requestRouter = express.Router();
const authenticate = require('../authentication');
const request = require('../models/request');
const nodemailer = require('nodemailer');
requestRouter.use(bodyParser.json());


const CLIENT_ID ='577499307796-vs8hr4hjie1v0nu6uo5t5uaf9dtud9i8.apps.googleusercontent.com';
const CLIENT_SECRET = 'pTgEdfMzTgpVaTYWZxHhQXN_';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04fT0PQQrnsymCgYIARAAGAQSNwF-L9IroqAF8X_ltMsSnfzR2bOjhYDagM-HjWMTgVT0apZFqEdgmylbPtHxukAel81KzYTa_LY';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN})
requestRouter.route('/')
.get((req,res,next)=>{
    Requests.find(req.query)
    .populate('user')
    .populate('helps')
    .then((requests)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(requests);
    },(err)=>next(err))
    .catch((err)=>next(err)); 
})
.post(authenticate.verifyuser,(req,res,next)=>{
    Requests.create(req.body)
    .then((requ)=>{
        requ.user = req.user._id;
        requ.save()
        .then(requests=>{
            Requests.find({})
            .populate('user')
            .then(requests=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(requests);
            },err=>next(err))
            .catch(err=>next(err));
        },err=>next(err))
        .catch(err=>next(err))
       
    }, (err)=>next(err))
    .catch((err)=>next(err));
})
.put(authenticate.verifyuser,(req,res,next)=>{

})
.delete((req,res,next)=>{
  Requests.remove({})
  .then((resp)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(resp);
}, (err)=>next(err))
.catch((err)=>next(err));
});

requestRouter.route('/myRequests')
.get(authenticate.verifyuser,authenticate.verifyInNeed,(req,res,next)=>{
    Requests.find({user:req.user._id})
    .populate('user')
    .then((myrequ)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(myrequ);
    },err=>next(err))
    .catch(err=>next(err));
})

requestRouter.route('/:requestId')
.get(authenticate.verifyuser,(req,res,next)=>{
    Requests.findById(req.params.requestId)
    .populate('user')
    .populate('helps')
    .then((request)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(request.loading);
    },err=>next(err))
    .catch(err=>next(err))
})
.delete(authenticate.verifyuser, (req,res,next)=>{
    Requests.findByIdAndDelete(req.params.requestId)
    .then((request)=>{
        request.save()
        Requests.find({user:req.user._id})
        .then((reqe=>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(reqe);
        }),err=>next(err))
        .catch(err=>next(err))
    }, err=>next(err))
    .catch(err=>next(err))
})

.put(authenticate.verifyuser,(req,res,next)=>{
    if(!req.user.inNeed){
    Requests.findByIdAndUpdate(req.params.requestId,{
        $set: req.body
    }, {new:true})
    .then(update=>{
        console.log(update)
        if(update.helps.indexOf(req.user._id)==0)
        {
            err = new Error('The user' + req.user._id + 'has already taken this request');
            err.status = 403;
            return next(err);
        }
        if(update.helps.lenght>0){
            err = new Error('This request has already been taken');
            err.status = 403;
            return next(err);
        }
        update.helps.push(req.user._id);
        update.save()
        .then(saved=>{
            Requests.find({})
            .populate('user')
            .populate('helps')
            .then(savedUpdate=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(savedUpdate);
            },err=>next(err))
            .catch(err=>next(err));
        },err=>next(err))
        .catch(err=>next(err));
    },err => next(err))
    .catch(err=>next(err))
    }
    else{
        Requests.findByIdAndUpdate(req.params.requestId,{
            $set: req.body
        }, {new:true})
        .then(updatedRequest=>{
            Requests.find({user:req.user._id})
            .populate('user')
            .populate('helps')
            .then(reqs=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(reqs);
            })
        })
    }
});

requestRouter.route('/:requestId/helps')
.delete(authenticate.verifyuser,(req,res,next)=>{
    Requests.findById(req.params.requestId)
    .then(request=>{
        request.helps.pop();
        request.loading = false;
        request.save()
        .then(modReq=>{
            Requests.find({})
            .populate('user')
            .populate('helps')
            .then(requests=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(requests);
            },err=>next(err))
            .catch(err=>next(err))
        },err=>next(err))
        .catch(err=>next(err))
    },err=>next(err))
    .catch(err=>next(err))
});

requestRouter.post('/SendMail',authenticate.verifyuser,(req,res,next)=>{
    let user = req.body;
    console.log('Starting the process of sending the mail');
    SendMail(user)
        .then(resp=>
            {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({'sent':true}), console.log('Email sent ..'+res)
            }, err=>next(err))
        .catch(err=>next(err));
});

async function SendMail(user){
try{
    console.log(user);
    const accesToken = await oAuth2Client.getAccessToken();
    let transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            type:'OAuth2',
            user:'soufianeallamou2019@gmail.com',
            clientId : CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accesToken : accesToken
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    let mailOptions ={
        from:"Elderly Care <soufianeallamou2019@gmail.com>",
        to:"soufianeallamou2021@gmail.com",
        subject:"Request edited",
        html:`<h1>Hi Sir/Miss</h1><br>
        <h4>The request Has been updated. You can visit our website to check that out.</h4>`,
    }
    const result = await transporter.sendMail(mailOptions);
    return result;
}
catch(err){
    return err;
}
}





module.exports = requestRouter;





//client_id : 577499307796-vs8hr4hjie1v0nu6uo5t5uaf9dtud9i8.apps.googleusercontent.com
//client_secret : pTgEdfMzTgpVaTYWZxHhQXN_

//refresh_token : 1//04fT0PQQrnsymCgYIARAAGAQSNwF-L9IroqAF8X_ltMsSnfzR2bOjhYDagM-HjWMTgVT0apZFqEdgmylbPtHxukAel81KzYTa_LY
//acces_token : ya29.a0AfH6SMDhXBWYbUmzcGox2xjX5twlKYiN5OXYDYBNjY1zi6VOYkEw8AT4tJXDqqMJIqOcwh52NII5BrL93raC4bcIsnZc6fwNBVBq3Fn9DC1_YOwhAFVcyM_ZKvqOC2Go29s9vcIc14e45auraFNYqcO_4k1P5POWAFaIE9c3ZJM


