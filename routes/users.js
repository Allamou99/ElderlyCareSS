var express = require('express');
const bodyParser = require('body-parser');
var authenticate  = require('../authentication');
const passport = require('passport');
var router = express.Router();
var User = require('../models/user');
var cors = require('./cors');

router.use(bodyParser.json());
//{"username":"soufiane","password":"allamou","firstname":"sousou","lastname":"all"}

router.post('/signup',cors.corsWithOptions,(req,res,next)=>{
  User.register(new User({username:req.body.username,lastname:req.body.lastname,firstname:req.body.firstname,
    inNeed : req.body.inNeed,details:req.body.details}),
    req.body.password,(err,user)=>{
    if(err){
      res.status = 500;
      res.setHeader('ContentType','application/json');
      res.json({err:err});
    }
    else{
      if(req.body.firstname){
        user.firstname = req.body.firstname;
      }
      if(req.body.lastname){
        user.lastname = req.body.lastname;
      }
      user.save((err,user)=>{
        if(err){
          res.status = 500;
          res.setHeader('ContentType','application/json');
          res.json({err:err});
        }
        passport.authenticate('local')
        (req,res,()=>{
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        })
      })     
    }
  })
});
router.get('/currentUser',authenticate.verifyuser,(req,res,next)=>{
    User.findById({_id:req.user._id})
    .then(currentUser=>{
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json(currentUser);
    },err=>next(err))
    .catch(err=>next(err))
});
router.post('/login',(req,res,next)=>{
  passport.authenticate('local',(err,user,info)=>{
    if(err){
      return next(err);
    }
    if(!user){
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, status: 'Login Unsuccessful!', err: info});
    }
    req.logIn(user,(err)=>{
      if(err){
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!'});
      }
      if(req.user.inNeed){
        console.log("In need");
      }
      else{
        console.log("Not in need ");
      }
      var token = authenticate.gettoken({_id:req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, status: 'Login Successful!', token: token, inNeed:req.user.inNeed});
    });
  })(req, res, next);
});
router.get('/',authenticate.verifyuser,(req,res,next)=>{
  User.find({})
  .then(users=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(users);
    console.log(users);
  }, (err)=>next(err))
  .catch(err=>next(err));
});

router.get('/checkJWTtoken', cors.corsWithOptions, (req, res) => {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT invalid!', success: false, err: info});
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT valid!', success: true, user: user});
    }
  }) (req, res);
});


module.exports = router;