// default empty callback
function c() { }

// titles of event run types
var event_run_types = ['No Repeat', 'Repeat by Day', 'Repeat by Day and Hour', 'Manual Event', 'Start-up Event'];

// --- Control Functions ---

function sendControl(command) {
    var arg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : c;

    // console.log(command, arg);
    $.get("/opt", { command: command, arg: arg }, callback);
}

export function loadFile(id) {
    sendControl('LoadTrackToTop', id, next);
}

// simple control functions
export function restart() {
    sendControl('RestartPlayer');
}
export function clear() {
    sendControl('ClearPlaylist');
}
export function fromIntro() {
    sendControl('PlayFromIntro');
}
export function next() {
    sendControl('PlayPlaylistTrack');
}
export function stop() {
    sendControl('StopPlayer');
}
export function pause(state) {
    sendControl('PausePlayer', state);
}

// --- Queue + Current Functions ---

export function displayCurrent(divID) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : c;

    currentTrack(function (resp, stat) {
        var i = resp[0];
        var info_string = (i === undefined ? "" : i.title + " - " + i.artist);
        $(divID).text(info_string);
        callback();
    });
}

// get song info by ID
export function songByID(id) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : c;

    $.get("/query?q=song_id&arg=" + id, callback);
}

// get song info by type
export function songsByType(type) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : c;

    $.get("/query?q=song_type&arg=" + type, callback);
}

// get song info by subcat
export function songsBySubcat(subcat) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : c;

    $.get("/query?q=song_subcat&arg=" + subcat, callback);
}

// get current track info
export function currentTrack() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : c;

    $.get("/query?q=current", callback);
}

// get play queue
export function playQueue() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : c;

    $.get("/query?q=queue", callback);
}

// get play history
export function playHistory() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : c;

    $.get("/query?q=history", callback);
}

// --- Event Functions ---

// get all events
export function getEvents() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : c;

    $.get("/query?q=events", callback);
}

// get info on event
export function getEvent(eventID) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : c;

    if (eventID >= 0) {
        $.get("/query?q=event_get&arg=" + eventID, callback);
    } else {
        error.log('Invalid Event ID');
    }
}

// delete event by ID
export function deleteEvent(eventID) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : c;

    if (eventID >= 0) {
        $.get("/query?q=event_delete&arg=" + eventID, callback);
    } else {
        console.log('Invalid Event ID');
    }
}

// load event form
export function loadEvent(id) {
    var copy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var url = '/event-form';
    if (id !== undefined) {
        url = url + '?id=' + id;
        if (copy) {
            url = url + '&copy=' + copy;
        }
    }
    window.location = url;
}

// refesh events in radio DJ (nessisary to make changes to events take effect imediatly)
export function refreshEvents() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : c;

    sendControl('RefreshEvents', callback);
}

// decode weekdays in repeat string
export function decodeDays(string) {
    var codes = string.split('&');
    var date = '';
    $.each(codes, function (i) {
        if (codes[i] != '') {
            if (i > 0) {
                date += ", ";
            }
            date = date + moment(codes[i], "e").format("ddd");
        }
    });
    return date;
}

// format date time info from radio DJ, into human comprehendable string
export function formatDateTime(e) {
    var dateTime = '';
    switch (e.type) {
        case 0:
            dateTime = e.time + moment(e.date).format('dddd, MMMM Do YYYY');
            break;
        case 1:
            dateTime = e.time + decodeDays(e.day);
            break;
        case 2:
            dateTime = 'Repeat by Hour' + decodeDays(e.day);
            break;
        case 3:
            dateTime = 'Manual Event';
            break;
        case 4:
            dateTime = 'Start-up Event';
            break;
    }
    if (e.hours === '&') { } else {
        time = e.hours;
    }
    return dateTime;
}
