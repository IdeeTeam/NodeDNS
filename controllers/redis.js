/**
 * Created by Ivan on 1/9/2017.
 */
const redis = require("redis");

const User = require("../Schemas/User");

const client = redis.createClient();
client.select(1, function (err, res) {
    if (err) {
        console.log('I\'m not very happy');
    }
    else {
        console.log('I like unicorns, they make me tranquil');
    }
});
client.on("connect", function () {
    console.log("Redis up and running, petty human.")
});

const client2 = redis.createClient();
client2.select(2, function (err, res) {
    if (err) {
        console.log('This ain\'t working for me.');
    }
    else {
        console.log('I see bright stars');
    }
});

exports.serverCheckIn = function (req, res) {

    var address = req.connection.remoteAddress;

    if (address == '::1') {
        if (req.body.url) {
            var pomUrl = req.body.url + '.idee.com';
            client.set(pomUrl,'127.0.0.1');
            client.expire(pomUrl, 90);
            res.status(200).json("Success");
        }
        else {
            res.status(400).json("Bad request");
        }
    }
    else {
        console.log(address);
        if (req.body.url) {
            //ovde fali ip address formating
            var pomUrl2 = req.body.url + '.idee.com';
            client.set(pomUrl2, address);
            client.expire(pomUrl2, 90);
            res.status(200).json("Success");
        }
        else {
            res.status(400).json("Bad request");
        }
    }
};

exports.getIP = function (req, res) {

    if (req.body.url) {
        client.get(req.body.url, function (err, reply) {
            if (err) {
                res.status(500).json("Internal error");
            }
            else if (!reply) {
                res.status(404).json("Not found");
            }
            else {
                res.status(200).json({"ip": reply});
            }
        })
    }
    else {
        res.status(400).json("Bad request");
    }
};

exports.getIPaddress = function(address, next) {
     if (address) {
        client.get(address, function (err, reply) {
            if (err) {
                next(null);
            }
            else if (!reply) {
                next(null);
            }
            else {
                next(reply);
            }
        })
    }
    else {
        next(null);
    }
};

exports.pushVerificationLink = function (link, user) {
    client2.set(link, user);
};

exports.verify = function (req, res) {
    var pom = req.params.link;
    client2.get(pom, function (err, reply) {
        if (err) {
                res.status(500).json("Internal error");
            }
            else if (!reply) {
                res.status(404).json("Not found");
            }
            else {
                User.findOneAndUpdate({"username": reply}, {"verified": true}, function (err, doc) {
                    if (err) {
                        res.status(500).json("Internal error");
                    }
                    else if (!doc) {
                        res.status(404).json("Not found");
                    }
                    else {
                        client2.del(pom);
                        res.status(200).json("User verified");
                    }
                });
            }
    });
};