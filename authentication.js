var passport = require('passport');
var jwt = require('jsonwebtoken');
var localstrategy = require('passport-local').Strategy;
var Extractjwt = require('passport-jwt').ExtractJwt;
var passportjwt = require('passport-jwt').Strategy;
var User = require('./models/user');
var Config = require('./config');


passport.use(new localstrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

opts={};
opts.jwtFromRequest = Extractjwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = Config.secretkey;
passport.use(new passportjwt(opts,
    (payload,done)=>{
        User.findOne({_id:payload._id},(err,user)=>{
            if(err)
                return done(err,false);
            else if(user)
                return done(null,user);
            else{
                return done(null,false);
            }
        })
    }));

exports.gettoken = function(user){
    return jwt.sign(user,Config.secretkey,{expiresIn:3600});
}
exports.verifyuser = passport.authenticate('jwt',{session:true})

exports.verifyAdmin = function(req,res,next){
    if(req.user.admin)
        next();
    else{
        var err = new Error('You are not an admin.');
        err.status = 403;
        return next(err);
    }
}

exports.verifyHelper = function(req,res,next){
    if(!req.user.inNeed)
        next();
        else{
            var err = new Error('You are not in Need.');
            err.status = 403;
            return next(err);
        }
}

exports.verifyInNeed = function(req,res,next){
    if(req.user.inNeed)
        next();
        else{
            var err = new Error('You are in Need.');
            err.status = 403;
            return next(err);
        }
}
