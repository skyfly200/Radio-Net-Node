<template lang="pug">
.queue
    h1 Player Queue
    v-data-table(:headers="headers" :items="queue" :total-items="queue.length" hide-actions)
        template(v-slot:items="props")
            td {{ props.item.Title }}
            td(class="text-xs-right") {{ props.item.Artist }}
            td(class="text-xs-right") {{ props.item.Album }}
            td(class="text-xs-right") {{ props.item.IDGenera }}
            td(class="text-xs-right") {{ props.item.DatePlayed }}
            td(class="text-xs-right") {{ props.item.Year }}
            td(class="text-xs-right") {{ formatDuration(props.item.Duration) }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
    props: {
        queue: Array
    }
})
export default class Queue extends Vue {
    headers = [
        {
            text: 'Title',
            align: 'left',
            value: 'Title'
        },
        { text: 'Artist', value: 'Artist' },
        { text: 'Album', value: 'Album' },
        { text: 'Genera', value: 'IDGenera' },
        { text: 'Last Played', value: 'DatePlayed' },
        { text: 'Released', value: 'Year' },
        { text: 'Duration (M:S)', value: 'Duration' }
    ];

    formatDuration(d: number) {
        return `${ Math.trunc(d / 60) }:${ (d % 60).toFixed(2) }`;
    }

    playItem() {
        // play item in queue
    }
}
</script>
