<template lang="pug">
  .controls
    h1 Radio DJ Controls
    v-toolbar
        v-toolbar-title Now Playing: {{ '' }}
        v-spacer
        v-toolbar-items.playback-controls
            v-btn(@click='pause(0)' icon flat)
                v-icon play_arrow
            v-btn(@click='pause(1)' icon flat)
                v-icon pause
            v-btn(@click='restart()' icon flat)
                v-icon replay
            v-btn(@click='next()' icon flat)
                v-icon skip_next
            v-btn(@click='stop()' icon flat)
                v-icon stop
            v-btn(@click='clear()' icon flat)
                v-icon clear
    .queue
        #queue_table
    .stream-controls
        v-select(:items="['test']" label="Stream")#stream_selector
        v-btn(@click='loadStream()') Load Stream
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { pause, restart, next, stop, clear, displayCurrent, playQueue, loadFile, songsByType } from "./lib/radio-dj";

@Component({
    methods: { pause, restart, next, stop, clear, displayCurrent, playQueue, loadFile, songsByType }
})
export default class Controls extends Vue {
    mounted() {
        // get current track and display
        displayCurrent('#current_info_string', () => {});

        // update current song title and queue every n seconds
        var interval = 1000;
        setInterval(this.updateDisplay, interval);

        // get streams and draw select
        // songsByType(5, function (resp: any, stat: any){
        //     console.log(resp);
        //     // $.each(resp, function( index, value ) {
        //     //     $('#stream_selector').append('<option value="' + value.ID + '">' + value.title + '</option>');
        //     // });
        // });
    };

    loadStream() {
        //loadFile($( "#stream_selector" ).val());
    }

    drawChart() {
        playQueue(function (resp: any, stat: any) {
            // $.each(resp, function (i, x) {
            //     data.addRow([x.artist, x.title]);
            //     if (options.height + itemHeight <= heightMax) {
            //         options.height += itemHeight;
            //     }
            // });
        });
    }

    updateDisplay() {
        displayCurrent('#current_info_string', this.drawChart);
    }
}
</script>

<style lang="sass" scoped>
.controls
    display: flex
    flex-direction: column
</style>
