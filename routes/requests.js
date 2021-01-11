const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Requests = require('../models/request');

const requestRouter = express.Router();
const authenticate = require('../authentication');
const request = require('../models/request');

requestRouter.use(bodyParser.json());

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
.delete(authenticate.verifyuser,(req,res,next)=>{
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
.delete(authenticate.verifyuser,authenticate.verifyHelper,(req,res,next)=>{
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

module.exports = requestRouter;





