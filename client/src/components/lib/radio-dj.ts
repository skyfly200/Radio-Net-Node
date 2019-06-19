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
    getStatus('StatusAutoDJ', (state: any) => { return state });
}

export function statusAssisted() {
    getStatus('StatusAssisted', (state: any) => { return state });
}

export function statusInput() {
    getStatus('StatusInput', (state: any) => { return state });
}

export function statusQueue() {
    getStatus('StatusQueue', (state: any) => { return state });
}

export function setAutoDJ(state: Number) {
    sendControl('EnableAutoDJ', state, (resp: any) => { return resp });
}

export function setAssisted(state: Number) {
    sendControl('EnableAssisted', state, (resp: any) => { return resp });
}

export function setInput(state: Number) {
    sendControl('EnableInput', state, (resp: any) => { return resp });
}

export function playNext(id: Number) {
    sendControl('LoadTrackToTop', id, (resp: any) => { return resp });
}

export function loadFile(id: Number) {
    sendControl('LoadTrackToBottom', id, (resp: any) => { return resp });
}

export function loadPlaylist(id: Number) {
    sendControl('LoadPlaylist', id, (resp: any) => { return resp });
}

export function playItem(index: Number) {
    sendControl('PlayPlaylistTrack', index, (resp: any) => { return resp });
}

export function removeItem(index: Number) {
    sendControl('RemovePlaylistTrack', index, (resp: any) => { return resp });
}

export function playCart(index: Number) {
    sendControl('PlaycartByNumber', index, (resp: any) => { return resp });
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

export function setEvents(state: Number) {
    sendControl('EnableEvents', state, (resp: any) => { return resp });
}
