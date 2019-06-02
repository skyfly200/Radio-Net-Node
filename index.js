const mysql = require('mysql');
const express = require("express");
const moment = require('moment');
const env = require('dotenv').config();
const axios = require('axios');
const parseString = require('xml2js').parseString;
const fs = require('fs');

// express init and config
var app = express();
var port = process.env.PORT || 8080;

// log file path
const logFile = 'log.txt';

// ------ SQL DatabaseSQL  ------

// titles of event run types
var event_run_types = ['No Repeat', 'Repeat by Day', 'Repeat by Day and Hour', 'Manual Event', 'Start-up Event'];

// Data Base Connection Pool
var pool = mysql.createPool({
  connectionLimit: 100, //important
  host: 'localhost',
  user: 'root',
  password: 'Prism1984',
  database: 'radiodj161',
  debug: false
});

// SQL Query List
var querys = {
  "events":"SELECT e.ID, e.name, e.type, e.time, e.date, e.day, e.hours, e.enabled, c.name as category from events as e LEFT JOIN events_categories as c on e.catID=c.ID",
  "event_get":"SELECT e.ID, e.name, e.type, e.time, e.date, e.day, e.hours, e.data, e.enabled, e.catID, c.name as category from events as e LEFT JOIN events_categories as c on e.catID=c.ID WHERE e.ID=?",
  "event_new":"INSERT INTO events (name,type,date,time,day,hours,data,enabled,catID) VALUES(?,?,?,?,?,?,?,?,?)",
  "event_update":"UPDATE events SET name=?,type=?,date=?,time=?,day=?,hours=?,data=?,enabled=?,catID=? WHERE ID=?",
  "event_delete":"DELETE FROM events WHERE ID=?",
  "event_categories":"SELECT * from events_categories",
  "queue":"SELECT queuelist.id, queuelist.artist, songs.title, songs.duration from queuelist left join songs on queuelist.songID=songs.ID",
  "history":"SELECT date_played, artist, album, title from history ORDER BY date_played DESC",
  "current":"SELECT date_played, artist, album, title from history ORDER BY date_played DESC LIMIT 1",
  "songs":"SELECT * FROM songs LIMIT 100",
  "song_id":"SELECT * FROM songs WHERE ID =?",
  "song_type":"SELECT * FROM songs WHERE song_type = ?",
  "song_subcat":"SELECT * FROM songs WHERE id_subcat = ?"
};

// run a query
function queryDatabase(queryID, args, callback) {

    pool.getConnection(function(err,connection){
        if (err) {
          callback({"code" : 100, "status" : "Error in connection database"});
          return;
        }

        query = querys[queryID];
        query = args !== [] ? mysql.format(query, args) : query;
        //console.log(query);

        connection.query(query, function(err,rows){
            connection.release();
            if(!err) {
              callback(rows);
            } else {} //console.log(err); }
        });

        connection.on('error', function(err) {
          if (!err) { callback({"code" : 100, "status" : "Error in connection database"}); }
          return;
        });
  });
}

// ----- Utility Functions ------

// write an action to the log file
function logAction(action) {
  var logLine = new Date().toLocaleString() + " - " + action + "\n";
  fs.appendFile(logFile, logLine, (err) => {
    if (err) throw err;
  });
}

// ------ Express Routing ------

// static serve dirctory
app.use(express.static('public'));

// rendered views directory
app.set('view engine', 'pug');

// -- Define pug rendered pages paths

// root url
app.get("/",function(req,res){
  res.render('index');
});

// player controls page
app.get("/controls",function(req,res){
  res.render('controls');
});

// playback history page
app.get("/history",function(req,res){
  res.render('history');
});

// events list page
app.get("/events",function(req,res){
  res.render('events');
});

// -- API Function Routing

app.get("/query",function(req,res){
  var query = req.param.q;
  if (typeof query === 'undefined') return res.send("Incorect query (q) parameter: " + query);
  var arg = req.param.arg;
  var args = typeof arg==Array ? arg : [arg];
  queryDatabase(query, args, function(data) {
    res.json(data);
  });
});

app.get("/event-form",function(req,res){
  var id = req.param.id;
  var copy = req.param.copy;
  if (typeof id === 'undefined') { id = -1; }
  queryDatabase('event_get', [id], function(eventData) {
    // edit event if id exists, else serve empty form
    var values = eventData[0];
    values.id = id;
    if (values && copy) {
      values.title = ('Copy Event '+id);
      values.action = '/event-new';
    } else if (values) {
      values.title = ('Edit Event '+id);
      values.action = '/event-update';
    } else {
      values = { title:'New Event', enabled:'True', action:'/event-new' };
    }
    queryDatabase('event_categories', [], function(resp) {
      if (resp[0] !== undefined) {
        var cats = [];
        var catIDs = [];
        for (var i=0; i<resp.length; i++) {
          cats.push(resp[i].name);
          catIDs.push(resp[i].ID);
        }
        values.categories = cats;
        values.catIDs = catIDs;
      } else {
        values.categories = {};
        values.catIDs = {};
      }
      values.date = moment(values.date).format('YYYY-MM-DD');
      values.types = event_run_types;
      //console.log(values);
      res.render('event_form', values);
    });
  });
});


// name,type,date,time,day,hours,data,enabled,catID

// add an event
app.get("/event-new",function(req,res){
  var values = [
    req.param.name,
    req.param.type,
    moment(req.param.date==='' ? [] : req.param.date.format('YYYY-MM-DD')),
    moment(req.param.time==='' ? [] : req.param.time.format('HH:mm:ss')),
    req.param.day==='' ? '&' : req.param.day,
    req.param.hours==='' ? '&' : req.param.hours,
    req.param.data==='' ? null : req.param.data,
    req.param.enabled==='on' ? 'True' : 'False',
    req.param.catID==='' ? 1 : req.param.catID
  ];
  //console.log(values);
  queryDatabase('event_new', values, function(resp) {
    //console.log(resp);
    res.redirect('/events-list.html');
  });
});

// update an event
app.get("/event-update",function(req,res){
  var values = [
    req.param.name,
    req.param.type,
    moment(req.param.date==='' ? [] : req.param.date).format('YYYY-MM-DD'),
    moment(req.param.time==='' ? [] : req.param.time).format('HH:mm:ss'),
    req.param.day==='' ? '&' : req.param.day,
    req.param.hours==='' ? '&' : req.param.hours,
    req.param.data==='' ? null : req.param.data,
    req.param.enabled==='on' ? 'True' : 'False',
    req.param.catID==='' ? 1 : req.param.catID,
    req.param.id
  ];
  queryDatabase('event_update', values, function(resp) {
    res.redirect('/events-list.html');
  });
});

// ---- REST API Proxy ----

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
app.get("/opt", function (req, res) {
  var command = req.paramcommand;
  var arg = req.param.arg;
  if (typeof command === 'undefined') return res.send("Incorect parameter: " + command);
  if (typeof req.param.arg === 'undefined') arg = '';
  axios.get(getPath("options"), {
      params: {
        auth: password,
        command: command,
        arg: arg
      }
    })
    .then( body => {
      res.json(body);
    })
    .catch(error => {
      console.log(error);
    });
});

// get now playing
app.get("/np", function (req, res) {
  axios.get(getPath("nowPlaying"), {
    params: { auth: password }
  })
    .then(body => {
      res.json(body);
    })
    .catch(error => {
      console.log(error);
    });
});

// get play queue, starting with current song
app.get("/p", function (req, res) {
  axios.get(getPath("playlist"), {
    params: { auth: password }
  })
    .then(body => {
      res.json(body);
    })
    .catch(error => {
      console.log(error);
    });
});

// get info on song in queue by index
app.get("/pitem", function (req, res) {
  var index = req.param.i;
  if (typeof index !== number) return res.send("Incorect index parameter: " + index);
  axios.get(getPath("options"), {
    params: {
      auth: password,
      arg: index
    }
  })
    .then(body => {
      res.json(body);
    })
    .catch(error => {
      console.log(error);
    });
});

// 404 error page
app.use(function (req, res, next) {
  res.render('404', { title: 'Home', message: 'Error 404 - Page not found!' });
});

// start the server
app.listen(port);
console.log('Server running on port ' + port);
