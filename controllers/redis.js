/**
 * Created by Ivan on 1/9/2017.
 */
const redis = require("redis");

const User = require("../Schemas/User");

const client = redis.createClient();
client.on("connect", function () {
    console.log("Redis up and running, petty human.")
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