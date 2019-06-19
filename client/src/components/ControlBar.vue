<template lang="pug">
    v-bottom-nav.controls
        .progress-bar
            v-progress-linear(v-model="songProgress")
        .player
            .player-info
                span {{ nowPlaying.Album }} - {{ nowPlaying.Artist }}
            v-spacer
            .player-controls
                v-btn(@click='stop()' icon flat)
                    v-icon stop
                v-btn(@click='restart()' icon flat)
                    v-icon replay
                v-btn(@click='pause(0)' icon flat v-if="!status")
                    v-icon play_arrow
                v-btn(@click='pause(1)' icon flat v-else)
                    v-icon pause
                v-btn(@click='next()' icon flat)
                    v-icon skip_next
                v-btn(@click='clear()' icon flat)
                    v-icon clear
            v-spacer
            .player-time
                span {{ formatDuration(nowPlaying.Elapsed, 0) }} | {{ formatDuration(nowPlaying.Duration, 0) }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { pause, restart, next, stop, clear, loadFile } from "./lib/radio-dj";

@Component({
    methods: { pause, restart, next, stop, clear }
})
export default class ControlBar extends Vue {
    nowPlaying: any = {};
    status: Boolean = false;

    created() {
        // init now playing and playlist
        this.getNP();
        setInterval(function (this: any) {
        (this as any).getNP();
        }.bind(this), 1000); 

        // get streams
    }
    getNP() {
        (this as any).$http.get("/radiodj/npjson")
        .then((body: any) => {
            this.status = (this.nowPlaying as any).Position < body.data.CurrentTrack.Position;
            this.nowPlaying = body.data.CurrentTrack;
        });
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
    .player
        width: 100%
        display: flex
        .player-controls
            display: flex
    .progress-bar
        width: 100%
        .v-progress-linear
            margin: 0
</style>
