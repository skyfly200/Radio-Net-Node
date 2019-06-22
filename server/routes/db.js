var mysql = require('mysql');
var express = require('express');
var router = express.Router();
var env = require('dotenv').config();


// ------ SQL DatabaseSQL  ------

// Data Base Connection Pool
var pool = mysql.createPool({
    connectionLimit: 100, //important
    host: process.env.SQL_HOST || 'localhost',
    user: process.env.SQL_USER || 'root',
    password: process.env.SQL_PASSWORD || 'password',
    database: process.env.SQL_DATABASE || 'radiodj',
    debug: false
});

// SQL Query List
var querys = {
    "events": {
        template: "SELECT e.ID, e.name, e.type, e.time, e.date, e.day, e.hours, e.enabled, c.name as category from events as e LEFT JOIN events_categories as c on e.catID=c.ID",
        params: []
    },
    "event": {
        template: "SELECT e.ID, e.name, e.type, e.time, e.date, e.day, e.hours, e.data, e.enabled, e.catID, c.name as category from events as e LEFT JOIN events_categories as c on e.catID=c.ID WHERE e.ID=?",
        params: [{ key: "id", type: Number, default: 1 }]
    },
    "event_new": {
        template: "INSERT INTO events (name,type,date,time,day,hours,data,enabled,catID) VALUES(?,?,?,?,?,?,?,?,?)",
        params: [
            { key: "name", type: String },
            { key: "type", type: String },
            { key: "date", type: String },
            { key: "time", type: String },
            { key: "day", type: String },
            { key: "hours", type: String },
            { key: "data", type: String },
            { key: "enabled", type: String },
            { key: "catID", type: Number }
        ]
    },
    "event_update": {
        template: "UPDATE events SET name=?,type=?,date=?,time=?,day=?,hours=?,data=?,enabled=?,catID=? WHERE ID=?",
        params: [
            { key: "name", type: String },
            { key: "type", type: String },
            { key: "date", type: String },
            { key: "time", type: String },
            { key: "day", type: String },
            { key: "hours", type: String },
            { key: "data", type: String },
            { key: "enabled", type: String },
            { key: "catID", type: Number },
            { key: "id", type: Number }
        ]
    },
    "event_delete": {
        template: "DELETE FROM events WHERE ID = ?",
        params: [{ key: "id" }]
    },
    "event_categories": {
        template: "SELECT * from events_categories",
        params: []
    },
    "queue": {
        template: "SELECT queuelist.id, queuelist.artist, songs.title, songs.duration from queuelist left join songs on queuelist.songID=songs.ID",
        params: []
    },
    "history": {
        template: "SELECT date_played, artist, album, title from history ORDER BY date_played DESC",
        params: []
    },
    "current": {
        template: "SELECT date_played, artist, album, title from history ORDER BY date_played DESC LIMIT 1",
        params: []
    },
    "songs": {
        template: "SELECT * FROM songs WHERE ID >= ?",
        params: [{ key: "id", type: Number, default: 1 }]
    },
    "song_id": {
        template: "SELECT * FROM songs WHERE ID = ?",
        params: [{ key: "id", type: Number, default: 1 }]
    },
    "song_type": {
        template: "SELECT * FROM songs WHERE song_type = ?",
        params: [{ key: "type", type: Number, default: 0 }]
    },
    "song_subcat": {
        template: "SELECT * FROM songs WHERE id_subcat = ?",
        params: [{ key: "subcat", type: Number, default: 0 }]
    },
};

// titles of event run types
var event_run_types = ['No Repeat', 'Repeat by Day', 'Repeat by Day and Hour', 'Manual Event', 'Start-up Event'];

// run a query
function queryDatabase(queryParams, callback) {

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            callback({ "code": 100, "status": "Error connecting to database" });
            return;
        }

        var query = querys[queryParams.q];

        var args = query.params.map(v => {
            var value = queryParams[v.key] ? queryParams[v.key] : (v.default ? v.default : null);
            return v.type(value);
        });
        //console.log(args)

        var queryFormated = mysql.format(query.template, args);
        //console.log(queryFormated);

        connection.query(queryFormated, function (err, rows) {
            connection.release();
            if (!err) {
                callback(rows);
            } else { console.error(err); }
        });

        connection.on('error', function (err) {
            if (!err) { callback({ "code": 100, "status": "Error in database connection" }); }
            return;
        });
    });
}

// -- API Routing

router.get("/query", function (req, res) {
    if (typeof req.query.q === 'undefined') return res.send("Undefined query parameter");
    queryDatabase(req.query, function (data) {
        res.json(data);
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
        res.send(resp);
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
        res.send(resp);
    });
});

// enable / disable an event
router.get("/event-toggle", function (req, res) {
    queryDatabase('event_update', values, function (resp) {
        res.send(resp);
    });
});

module.exports = router;