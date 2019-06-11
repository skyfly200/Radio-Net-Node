var mysql = require('mysql');
var express = require('express');
var router = express.Router();
var env = require('dotenv').config();
var axios = require('axios');

// ---- RadioDJ REST API Proxy ----

// configure RadioDJ REST API requests
const protocol = "http";
const hostname = process.env.RADIODJ_HOSTNAME || "localhost";
const apiPort = process.env.RADIODJ_PORT || "7000";
const password = process.env.RADIODJ_PASSWORD || "hackme";

// endpoints available on the API
const endpoints = {
    options: "opt",
    playlist: "p",
    playlistItem: "pitem",
    nowPlaying: "np",
    nowPlayingJSON: "npjson"
};

// build a URI from an enpoint and config vars
function getPath(endpoint) {
    if (!endpoint) endpoint = "nowPlaying";
    return protocol + "://" + hostname + ":" + apiPort + "/" + endpoints[endpoint];
}

// options endpoint
router.get("/opt", function (req, res) {
    var command = req.query.command;
    var arg = req.query.arg;
    if (typeof command === 'undefined') return res.send("Incorect parameter: " + command);
    if (typeof req.query.arg === 'undefined') arg = '';
    axios.get(getPath("options"), {
        params: {
            auth: password,
            command: command,
            arg: arg
        }
    })
        .then((data) => {
            res.sendStatus(data.status);
        })
        .catch(error => {
            console.log(error);
        });
});

// get now playing
router.get("/np", function (req, res) {
    axios.get(getPath("nowPlaying"), {
        params: { auth: password }
    })
        .then(body => {
            res.status(body.status).send(body.data);
        })
        .catch(error => {
            console.log(error);
        });
});

// get now playing as JSON
router.get("/npjson", function (req, res) {
    axios.get(getPath("nowPlayingJSON"), {
        params: { auth: password }
    })
        .then(body => {
            res.status(body.status).send(body.data);
        })
        .catch(error => {
            console.log(error);
        });
});

// get play queue, starting with current song
router.get("/p", function (req, res) {
    axios.get(getPath("playlist"), {
        params: { auth: password }
    })
        .then(body => {
            res.status(body.status).send(body.data);
        })
        .catch(error => {
            console.log(error);
        });
});

// get info on song in queue by index
router.get("/pitem", function (req, res) {
    var index = parseInt(req.query.i);
    if (typeof index === NaN) return res.send("Incorect index parameter: " + index);
    axios.get(getPath("playlistItem"), {
        params: {
            auth: password,
            arg: index
        }
    })
        .then(body => {
            res.status(body.status).send(body.data);
        })
        .catch(error => {
            console.log(error);
        });
});

module.exports = router;