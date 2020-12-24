const express = require('express');
const bodyParser = require('body-parser');

const authentication = require('../authentication');

const feedbackRouter = express.Router();
const Feedback = require('../models/feedback');

feedbackRouter.use(bodyParser.json());

feedbackRouter.route('/')
.get((req,res,next)=>{
    Feedback.find({})
    .populate('user')
    .then(feedbacks=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(feedbacks);
    },err=>next(err))
    .catch(err=>next(err))
})
.post(authentication.verifyuser,(req,res,next)=>{
    Feedback.create(req.body)
    .then((feedbackk)=>{
        feedbackk.user = req.user._id;
        feedbackk.inNeed = req.user.inNeed;
        feedbackk.save()
        .then(feedback=>{
            Feedback.find({})
            .populate('user')
            .then(feedbacks=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(feedbacks);
            },err=>next(err))
            .catch(err=>next(err))
        },err=>next(err))
        .catch(err=>next(err));
    }, (err)=>next(err))
    .catch((err)=>next(err));
})
.delete((req,res,next)=>{
    Feedback.remove({})
    .then(resu=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json({'message':'All feedback has been deleted'});
    })
});
feedbackRouter.route('/:feedbackId')
.delete(authentication.verifyuser,(req,res,next)=>{
    Feedback.findByIdAndRemove(req.params.feedbackId)
    .then(deletedFeedback=>{
        Feedback.find({})
        .then(feedbacks=>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(feedbacks);
        },err=>next(err))
        .catch(err=>next(err))
    },err=>next(err))
    .catch(err=>next(err))
})


module.exports = feedbackRouter;

