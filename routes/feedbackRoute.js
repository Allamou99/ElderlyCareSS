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
    .then(feedback=>{
        feedback.user = req.user._id;
        feedback.inNeed = req.user.inNeed;
        feedback.save();
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(feedback);
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

