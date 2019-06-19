<template lang="pug">
    v-bottom-nav.controls(app fixed)
        .progress-bar
            v-progress-linear(v-model="songProgress")
        .player-info
            .player-title.text-truncate
                span {{ nowPlaying.Title }}
                span.hidden-md-and-down {{ nowPlaying.Album }} - {{ nowPlaying.Artist }}
            v-spacer
            .player-time.text-truncate
                span {{ formatDuration(nowPlaying.Elapsed, 0) }}
                span.hidden-md-and-down &nbsp;| {{ formatDuration(nowPlaying.Duration, 0) }}
        v-toolbar-items.player-controls
            .toggles.ctrls
                CtrlBtn(:icon="assisted ? 'music_off' : 'music_note'" @click='toggleAssisted()' :tooltip="assisted ? 'Enable Auto Advance' : 'Disable Auto Advance'" hide)
                CtrlBtn(:icon="autoDJ ? 'album' : 'queue'" @click='toggleAutoDJ()' :tooltip="autoDJ ? 'Disable Auto DJ' : 'Enable Auto DJ'" hide)
                CtrlBtn(icon='delete_sweep' @click='clear()' tooltip='Clear Playlist' hide)
            .main-ctrls.ctrls
                CtrlBtn(:icon="paused ? 'play_arrow' : 'pause'" @click='togglePlayback()' :tooltip="paused ? 'Play' : 'Pause'" hide)
                CtrlBtn(icon='skip_next' @click='next()' tooltip='Next Song')
                CtrlBtn(icon='replay' @click='restart()' tooltip='Restart Song')
                CtrlBtn(icon='stop' @click='stop()' tooltip='Stop Playback' hide)
            .more.ctrls
                CtrlBtn(icon='more_vert' @click='' tooltip='More Options')

</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { pause, restart, next, stop, clear, loadFile, statusAutoDJ, statusAssisted, setAssisted, setAutoDJ } from "./lib/radio-dj";
import CtrlBtn from "./CtrlBtn.vue";

@Component({
    methods: { pause, restart, next, stop, clear, setAssisted, setAutoDJ },
    components: { CtrlBtn }
})
export default class ControlBar extends Vue {
    nowPlaying: any = {};
    paused: Boolean = false;
    assisted: Boolean = false;
    autoDJ: Boolean = false;

    created() {
        // init now paused and playlist
        this.getNP();
        // this.assisted = statusAssisted();
        // this.autoDJ = statusAutoDJ();
        setInterval(function (this: any) {
        (this as any).getNP();
        }.bind(this), 500);
    }
    
    getNP() {
        (this as any).$http.get("/radiodj/npjson")
        .then((body: any) => {
            this.paused = (this.nowPlaying as any).Position === body.data.CurrentTrack.Position;
            this.nowPlaying = body.data.CurrentTrack;
        });
    }

    toggleAssisted() {
        this.assisted = !this.assisted;
        setAssisted(Number(this.assisted));
    }

    toggleAutoDJ() {
        this.autoDJ = !this.autoDJ;
        setAutoDJ(Number(this.autoDJ));
    }

    togglePlayback() {
        this.paused = !this.paused;
        pause(Number(this.paused));
    }

    get songProgress() {
        let d = this.nowPlaying.Duration;
        let e = this.nowPlaying.Elapsed;
        return 100 * ( e / d );
    }

    formatDuration(d: number, a: number) {
        let min = Math.trunc(d / 60);
        let sec = (d % 60).toFixed(a);
        let hour = Math.trunc(min / 60);
        if (min >= 60) return `${ hour }:${ this.constLen((min % 60).toFixed(a)) }:${ this.constLen(sec) }`;
        else return `${ min }:${ sec.length === 1 ? "0" + sec : sec  }`;
    }

    constLen(n: string) {
        return n.length === 1 ? "0" + n : n;
    }
}
</script>

<style lang="sass" scoped>
.controls
    display: flex
    flex-direction: column
    .ctrls
        display: flex
    .player-info
        width: 100%
        display: flex
        padding: 0 1em
        .player-title
            font-size: 1.2em
    .player-controls
        width: 100%
        display: flex
        height: auto
        justify-content: space-between
    .progress-bar
        width: 100%
        .v-progress-linear
            margin: 0
</style>
