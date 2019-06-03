<template lang="pug">
.queue
    h1 Player Queue
    v-data-table(:headers="headers" :items="queue" :total-items="queue.length" hide-actions)
        template(v-slot:items="props")
            td {{ props.item.title }}
            td(class="text-xs-right") {{ props.item.artist }}
            td(class="text-xs-right") {{ props.item.album }}
            td(class="text-xs-right") {{ props.item.genera }}
            td(class="text-xs-right") {{ props.item.date }}
            td(class="text-xs-right") {{ formatDuration(props.item.duration) }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class Queue extends Vue {
    headers = [
        {
            text: 'Title',
            align: 'left',
            value: 'title'
        },
        { text: 'Artist', value: 'artist' },
        { text: 'Album', value: 'album' },
        { text: 'Genera', value: 'genera' },
        { text: 'Release Date', value: 'date' },
        { text: 'Duration (M:S)', value: 'duration' }
    ];
    @Prop({default: []})
    queue: Array<Object>;

    formatDuration(d: number) {
        return `${ Math.trunc(d / 60) }:${ (d % 60).toFixed(2) }`;
    }

    playItem() {
        // play item in queue
    }
}
</script>
