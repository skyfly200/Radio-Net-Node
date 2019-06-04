import Axios from 'axios';

// default empty callback
function c() { }

// titles of event run types
var event_run_types = ['No Repeat', 'Repeat by Day', 'Repeat by Day and Hour', 'Manual Event', 'Start-up Event'];

// --- Queue + Current Functions ---

export function displayCurrent(divID: String, callback: any) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : c;

    // currentTrack(function (resp: any, stat: any) {
    //     var i = resp[0];
    //     var info_string = (i === undefined ? "" : i.title + " - " + i.artist);
    //     //$(divID).text(info_string);
    //     callback();
    // });
}

// get song info by ID
export function songByID(id: Number, callback: any) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : c;

    //$.get("/query?q=song_id&arg=" + id, callback);
}

// get song info by type
export function songsByType(type: String, callback: any) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : c;

    //$.get("/query?q=song_type&arg=" + type, callback);
}

// get song info by subcat
export function songsBySubcat(subcat: String, callback: any) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : c;

    //$.get("/query?q=song_subcat&arg=" + subcat, callback);
}

// get current track info
export function currentTrack(callback: any) {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : c;

    //$.get("/query?q=current", callback);
}

// get play queue
export function playQueue(callback: any) {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : c;
    //$.get("/query?q=queue", callback);
}

// get play history
export function playHistory(callback: any) {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : c;
    //$.get("/query?q=history", callback);
}

// --- Event Functions ---

// get all events
export function getEvents(callback: any) {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : c;
    //$.get("/query?q=events", callback);
}

// get info on event
export function getEvent(eventID: any, callback: any) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : c;

    if (eventID >= 0) {
        //$.get("/query?q=event_get&arg=" + eventID, callback);
    } else {
        console.error('Invalid Event ID');
    }
}

// delete event by ID
export function deleteEvent(eventID: any, callback: any) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : c;

    if (eventID >= 0) {
        //$.get("/query?q=event_delete&arg=" + eventID, callback);
    } else {
        console.log('Invalid Event ID');
    }
}

// load event form
export function loadEvent(id: any, callback: any) {
    var copy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var url = '/event-form';
    if (id !== undefined) {
        url = url + '?id=' + id;
        if (copy) {
            url = url + '&copy=' + copy;
        }
    }
    // redirect to form
}

// decode weekdays in repeat string
export function decodeDays(string: String, callback: any) {
    var codes = string.split('&');
    var date = '';
    // $.each(codes, function (i) {
    //     if (codes[i] != '') {
    //         if (i > 0) {
    //             date += ", ";
    //         }
    //         date = date + codes[i];// moment(codes[i], "e").format("ddd");
    //     }
    // });
    return date;
}

// format date time info from radio DJ, into human comprehendable string
export function formatDateTime(e: any, callback: any) {
    var dateTime = '';
    switch (e.type) {
        case 0:
            dateTime = e.time + e.date;// moment(e.date).format('dddd, MMMM Do YYYY');
            break;
        case 1:
            dateTime = e.time + decodeDays(e.day, c);
            break;
        case 2:
            dateTime = 'Repeat by Hour' + decodeDays(e.day, c);
            break;
        case 3:
            dateTime = 'Manual Event';
            break;
        case 4:
            dateTime = 'Start-up Event';
            break;
    }
    if (e.hours === '&') { } else {
        dateTime = e.hours;
    }
    return dateTime;
}
