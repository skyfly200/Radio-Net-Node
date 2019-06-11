<template lang="pug">
.events
    h2 Events
    v-data-table(:headers="headers" :items="events" :total-items="events.length" hide-actions)
        template(v-slot:items="props")
            td {{ props.item.Title }}
            td(class="text-xs-right") {{ props.item.Artist }}
            td(class="text-xs-right") {{ props.item.Album }}
            td(class="text-xs-right") {{ formatDuration(props.item.Duration) }}
            td(class="text-xs-right") {{ distanceInWordsToNow(props.item.DatePlayed) }} ago
            td(class="text-xs-right") {{ props.item.Year }}
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";

@Component({
    methods: { distanceInWordsToNow }
})
export default class Events extends Vue {
    events = [];
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
}
</script>
