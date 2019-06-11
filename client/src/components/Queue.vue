<template lang="pug">
.queue
    h2 Playlist
    v-data-table(:headers="headers" :items="queue" :total-items="queue.length" hide-actions)
        template(v-slot:items="props")
            td {{ props.item.Title }}
            td {{ props.item.Artist }}
            td {{ props.item.Album }}
            td {{ formatDuration(props.item.Duration) }}
            td {{ distanceInWordsToNow(props.item.DatePlayed) }} ago
            td {{ props.item.Year }}
            td.justify-center.layout.px-0
                v-icon.mr-2(@click="playItem(props.index)") play_arrow
                v-icon(@click="removeItem(props.index)") close
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { next, playItem, removeItem } from "./lib/radio-dj";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";

@Component({
    props: {
        queue: Array
    },
    methods: { next, playItem, removeItem, distanceInWordsToNow }
})
export default class Queue extends Vue {
    headers = [
        {
            text: 'Title',
            align: 'left',
            value: 'Title',
            sortable: false
        },
        { text: 'Artist', value: 'Artist', sortable: false },
        { text: 'Album', value: 'Album', sortable: false },
        { text: 'Duration', value: 'Duration', sortable: false },
        { text: 'Last Played', value: 'DatePlayed', sortable: false },
        { text: 'Released', value: 'Year', sortable: false },
        { text: 'Actions', value: 'name', sortable: false }
    ];

    formatDuration(d: number) {
        return `${ Math.trunc(d / 60) }:${ (d % 60).toFixed(2) }`;
    }
}
</script>
