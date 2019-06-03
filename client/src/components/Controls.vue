<template lang="pug">
  .controls
    h1 Radio DJ Controls
    #current_info
        h3 Now Playing: 
            span #current_info_string
    .playback-controls
        button(onclick='pause(0)') Play
        button(onclick='pause(1)') Pause
        button(onclick='restart()') Restart
        button(onclick='next()') Next
        button(onclick='stop()') Stop
        button(onclick='clear()') Clear Playlist
    .queue
        #queue_table
    .stream-controls
        select()#stream_selector
        button(onclick='loadStream()') Load Stream
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { pause, restart, next, stop, clear, displayCurrent, playQueue, loadFile, songsByType } from "./lib/radio-dj";

@Component({})
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
