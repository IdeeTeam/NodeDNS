/**
 * Created by Stefan on 1/8/2017.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var User = require('../Schemas/User');

process.env.SECRET_KEY = "UserAuthKey";


exports.createUser = function(req,res){
    if(req.body.username && req.body.email && req.body.password)
    {
        User.find({$or:[{"username":req.body.username},{"email":req.body.email}]},function (err,users) {
            if(err) {
                res.status(500).json("An error occured");
            }
            else if(users && users.length!=0){
                console.log("ako je naso nekog");
                res.status(400).json("Existing username or email");
            }
            else {
                bcrypt.hash(req.body.password,10,function (err,hash) {
                    if(err){
                        res.status(500).json("An error occured");
                    }
                    else {
                        console.log("new user");
                        var user = new User();
                        user.username = req.body.username;
                        user.email = req.body.email;
                        user.password=hash;
                        user.verified = false;

                         user.token = jwt.sign(user, process.env.SECRET_KEY ,{

                                });
                        user.save(function (err) {
                            if(err) {
                                res.status(500).json("An error occured");
                            }
                            else {

                                res.status(200).json(user);

                            }

                        });
                    }

                });
            }
        });
    }
    else {
        res.status(400).json("Specify an username,email and password");
    }
    
};