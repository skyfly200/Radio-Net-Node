<template lang="pug">
  .streams
    h1 Streams
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
export default class Streams extends Vue {
    stream: any = '';
    @Prop({type: Array})
    streams: any;

    launchStream() {
        if (typeof this.stream === 'number') {
            // launch the selected stream
            loadFile(this.stream);
            next();
        }
    }
}
</script>

<style lang="sass" scoped>
.streams
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
</style>
