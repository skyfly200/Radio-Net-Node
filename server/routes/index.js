var mysql = require('mysql');
var express = require('express');
var router = express.Router();
var env = require('dotenv').config();
var axios = require('axios');
var parseString = require('xml2js').parseString;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// ------ SQL DatabaseSQL  ------

// titles of event run types
var event_run_types = ['No Repeat', 'Repeat by Day', 'Repeat by Day and Hour', 'Manual Event', 'Start-up Event'];

// Data Base Connection Pool
var pool = mysql.createPool({
  connectionLimit: 100, //important
  host: 'localhost',
  user: 'root',
  password: 'Prism1984',
  database: 'radiodj2',
  debug: false
});

// SQL Query List
var querys = {
  "events": "SELECT e.ID, e.name, e.type, e.time, e.date, e.day, e.hours, e.enabled, c.name as category from events as e LEFT JOIN events_categories as c on e.catID=c.ID",
  "event_get": "SELECT e.ID, e.name, e.type, e.time, e.date, e.day, e.hours, e.data, e.enabled, e.catID, c.name as category from events as e LEFT JOIN events_categories as c on e.catID=c.ID WHERE e.ID=?",
  "event_new": "INSERT INTO events (name,type,date,time,day,hours,data,enabled,catID) VALUES(?,?,?,?,?,?,?,?,?)",
  "event_update": "UPDATE events SET name=?,type=?,date=?,time=?,day=?,hours=?,data=?,enabled=?,catID=? WHERE ID=?",
  "event_delete": "DELETE FROM events WHERE ID=?",
  "event_categories": "SELECT * from events_categories",
  "queue": "SELECT queuelist.id, queuelist.artist, songs.title, songs.duration from queuelist left join songs on queuelist.songID=songs.ID",
  "history": "SELECT date_played, artist, album, title from history ORDER BY date_played DESC",
  "current": "SELECT date_played, artist, album, title from history ORDER BY date_played DESC LIMIT 1",
  "songs": "SELECT * FROM songs LIMIT 100",
  "song_id": "SELECT * FROM songs WHERE ID =?",
  "song_type": "SELECT * FROM songs WHERE song_type = ?",
  "song_subcat": "SELECT * FROM songs WHERE id_subcat = ?"
};

// run a query
function queryDatabase(queryID, args, callback) {

  pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      callback({ "code": 100, "status": "Error connecting to database" });
      return;
    }

    query = querys[queryID];
    query = args !== [] ? mysql.format(query, args) : query;
    //console.log(query);

    connection.query(query, function (err, rows) {
      connection.release();
      if (!err) {
        callback(rows);
      } else { } //console.log(err); }
    });

    connection.on('error', function (err) {
      if (!err) { callback({ "code": 100, "status": "Error in database connection" }); }
      return;
    });
  });
}

// -- API Routing

router.get("/query", function (req, res) {
  var query = req.query.q;
  if (typeof query === 'undefined') return res.send("Incorect query (q) parameter: " + query);
  var arg = req.query.arg;
  var args = typeof arg == Array ? arg : [arg];
  queryDatabase(query, args, function (data) {
    res.json(data);
  });
});

router.get("/event-form", function (req, res) {
  var id = req.query.id;
  var copy = req.query.copy;
  if (typeof id === 'undefined') { id = -1; }
  queryDatabase('event_get', [id], function (eventData) {
    // edit event if id exists, else serve empty form
    var values = (eventData[0] === undefined ? {} : eventData[0]);
    values.id = id;
    if (values && copy) {
      values.title = ('Copy Event ' + id);
      values.action = '/event-new';
    } else if (values) {
      values.title = ('Edit Event ' + id);
      values.action = '/event-update';
    } else {
      values = { title: 'New Event', enabled: 'True', action: '/event-new' };
    }
    queryDatabase('event_categories', [], function (resp) {
      if (resp[0] !== undefined) {
        var cats = [];
        var catIDs = [];
        for (var i = 0; i < resp.length; i++) {
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
router.get("/event-new", function (req, res) {
  var values = [
    req.query.name,
    req.query.type,
    moment(req.query.date === '' ? [] : req.query.date.format('YYYY-MM-DD')),
    moment(req.query.time === '' ? [] : req.query.time.format('HH:mm:ss')),
    req.query.day === '' ? '&' : req.query.day,
    req.query.hours === '' ? '&' : req.query.hours,
    req.query.data === '' ? null : req.query.data,
    req.query.enabled === 'on' ? 'True' : 'False',
    req.query.catID === '' ? 1 : req.query.catID
  ];
  //console.log(values);
  queryDatabase('event_new', values, function (resp) {
    //console.log(resp);
    res.redirect('/events');
  });
});

// update an event
router.get("/event-update", function (req, res) {
  var values = [
    req.query.name,
    req.query.type,
    moment(req.query.date === '' ? [] : req.query.date).format('YYYY-MM-DD'),
    moment(req.query.time === '' ? [] : req.query.time).format('HH:mm:ss'),
    req.query.day === '' ? '&' : req.query.day,
    req.query.hours === '' ? '&' : req.query.hours,
    req.query.data === '' ? null : req.query.data,
    req.query.enabled === 'on' ? 'True' : 'False',
    req.query.catID === '' ? 1 : req.query.catID,
    req.query.id
  ];
  queryDatabase('event_update', values, function (resp) {
    res.redirect('/events');
  });
});

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
