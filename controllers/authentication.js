/**
 * Created by Stefan on 1/8/2017.
 */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../Schemas/User');

process.env.SECRET_KEY = "UserAuthKey";

exports.login = function (req,res) {

    if(req.body.username&&req.body.password) {
        User.findOne({"username":req.body.username},function (err,user) {
            if(err) {
                res.status(500).json("An error occurred");
            }
            else if(!user) {
                res.status(400).json("User with given username doesn't exist");
            }
            else if (!user.verified) {
                res.status(400).json("User not verified");
            }    
            else {
                bcrypt.compare(req.body.password,user.password,function (err,same) {
                    if(err) {
                        console.log(err);
                        res.status(500).json("An error occurred");
                    }
                    else {
                        if(same) {
                            res.status(200).json({"token": user.token});

                        }
                        else {
                            res.status(400).json("Incorrect password")
                        }
                    }
                });
            }
        });
    }
    else {
        res.status(400).json("Enter username and password for login")
    }

};


exports.authenticate = function(req,res,next){
    var token = req.headers.token;
    if(token) {
        jwt.verify(token,process.env.SECRET_KEY,function (err,decode) {
            if(err) {
                res.status(500).json("Bad token");
            }
            else {
                next()
            }

        });
    }
    else {
        res.status(400).json("No token supplied");
    }
};