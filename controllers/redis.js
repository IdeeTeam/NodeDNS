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

    if (req.body.url && req.body.ip) {
        client.set(req.body.url, req.body.ip);
        client.expire(req.body.url, 90);
        res.status(200).json("Success");
    }
    else {
        res.status(400).json("Bad request");
    }
}

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
}