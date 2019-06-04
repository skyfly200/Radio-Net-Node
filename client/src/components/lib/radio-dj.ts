import Axios from 'axios';

// default empty callback
function c() {}

// --- Control Functions ---

function sendControl(command: String, arg: any, callback: Function) {
    arg = arg !== undefined ? arg : '';
    callback = callback !== undefined ? callback : c;

    // console.log(command, arg);
    Axios.get("/opt", {
        params: { command: command, arg: arg }
    })
    .then();
}

export function loadFile(id: Number) {
    sendControl('LoadTrackToTop', id, next);
}

// simple control functions
export function restart() {
    sendControl('RestartPlayer', '', c);
}

export function clear() {
    sendControl('ClearPlaylist', '', c);
}

export function fromIntro() {
    sendControl('PlayFromIntro', '', c);
}

export function next() {
    sendControl('PlayPlaylistTrack', '', c);
}

export function stop() {
    sendControl('StopPlayer', '', c);
}

export function pause(state: Number) {
    sendControl('PausePlayer', state, c);
}

// refesh events in radio DJ (nessisary to make changes to events take effect imediatly)
export function refreshEvents(callback: any) {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : c;

    sendControl('RefreshEvents', '', callback);
}