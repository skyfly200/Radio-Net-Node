<template lang="pug">
  .controls
    h1 Controls
    v-card
        v-card-text
            v-toolbar(extended)
                v-toolbar-title Now Playing: {{ nowPlaying.Title }}
                v-spacer
                v-toolbar-items.playback-controls
                    v-btn(@click='pause(0)' icon flat)
                        v-icon play_arrow
                    v-btn(@click='pause(1)' icon flat)
                        v-icon pause
                    v-btn(@click='stop()' icon flat)
                        v-icon stop
                    v-btn(@click='restart()' icon flat)
                        v-icon replay
                    v-btn(@click='next()' icon flat)
                        v-icon skip_next
                    v-btn(@click='clear()' icon flat)
                        v-icon clear
                template(v-slot:extension)
                    .playback-info
                        .track-info
                            span {{ nowPlaying.Album }} - {{ nowPlaying.Artist }}
                            v-spacer
                            span {{ formatDuration(nowPlaying.Elapsed) }} | {{ formatDuration(nowPlaying.Duration) }}
                        .progress-bar
                            v-progress-linear(v-model="songProgress")
            .stream-controls
                #stream-selector
                    v-select(:items="streams" v-model="stream" label="Stream")
                v-btn(@click='launchStream()')
                    v-icon(left) radio
                    | Launch
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { pause, restart, next, stop, clear, loadFile } from "./lib/radio-dj";

@Component({
    methods: { pause, restart, next, stop, clear }
})
export default class Controls extends Vue {
    stream: any = '';

    @Prop({type: Object})
    nowPlaying: any;
    @Prop({type: Array})
    streams: any;

    get songProgress() {
        let d = this.nowPlaying.Duration;
        let e = this.nowPlaying.Elapsed;
        return 100 * ( e / d );
    }

    launchStream() {
        if (typeof this.stream === 'number') {
            // launch the selected stream
            loadFile(this.stream);
            next();
        }
    }

    formatDuration(d: number) {
        return `${ Math.trunc(d / 60) }:${ (d % 60).toFixed(2) }`;
    }
}
</script>

<style lang="sass" scoped>
.controls
    display: flex
    flex-direction: column
    .stream-controls
        width: 100%
        display: flex
        padding: 1em 0
        #stream-selector
            width: 100%
            margin-right: 1em
        button
            margin: auto 1em
    .playback-info
        display: flex
        width: 100%
        flex-direction: column
    .track-info
        display: flex
        width: 100%
    .progress-bar
        width: 100%
</style>
