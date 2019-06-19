import Axios from 'axios';

// default empty callback
function c() {}

// --- Control Functions ---

function sendControl(command: String, arg: any, callback: Function) {
    arg = arg !== undefined ? arg : '';
    callback = callback !== undefined ? callback : c;

    // console.log(command, arg);
    Axios.get("/radiodj/opt", {
        params: { command: command, arg: arg }
    })
    .then( resp => callback(resp) );
}

function getStatus(command: String, callback: Function) {
    Axios.get("/radiodj/opt", { params: { command: command} })
        .then(resp => callback(resp));
}

export function statusAutoDJ() {
    return getStatus('StatusAutoDJ', next);
}

export function statusAssisted() {
    return getStatus('StatusAssisted', next);
}

export function statusInput() {
    return getStatus('StatusInput', next);
}

export function statusQueue() {
    return getStatus('StatusQueue', next);
}

export function toggleAutoDJ(state: Number) {
    sendControl('EnableAutoDJ', state, next);
}

export function toggleAssisted(state: Number) {
    sendControl('EnableAssisted', state, next);
}

export function toggleInput(state: Number) {
    sendControl('EnableInput', state, next);
}

export function playNext(id: Number) {
    sendControl('LoadTrackToTop', id, next);
}

export function loadFile(id: Number) {
    sendControl('LoadTrackToBottom', id, next);
}

export function loadPlaylist(id: Number) {
    sendControl('LoadPlaylist', id, next);
}

export function playItem(index: Number) {
    sendControl('PlayPlaylistTrack', index, next);
}

export function removeItem(index: Number) {
    sendControl('RemovePlaylistTrack', index, next);
}

export function playCart(index: Number) {
    sendControl('PlaycartByNumber', index, next);
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

export function toggleEvents(state: Number) {
    sendControl('EnableEvents', state, next);
}
