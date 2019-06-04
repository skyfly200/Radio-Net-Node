<template lang="pug">
.queue
    h1 Player Queue
    v-data-table(:headers="headers" :items="queue" :total-items="queue.length" hide-actions)
        template(v-slot:items="props")
            td {{ props.item.Title }}
            td(class="text-xs-right") {{ props.item.Artist }}
            td(class="text-xs-right") {{ props.item.Album }}
            td(class="text-xs-right") {{ formatDuration(props.item.Duration) }}
            td(class="text-xs-right") {{ props.item.DatePlayed }}
            td(class="text-xs-right") {{ props.item.Year }}
            td.justify-center.layout.px-0
                v-icon.mr-2(@click="playItem(props.index)") play_arrow
                v-icon(@click="removeItem(props.index)") close
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { next, playItem, removeItem } from "./lib/radio-dj";

@Component({
    props: {
        queue: Array
    },
    methods: { next, playItem, removeItem }
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
