<template lang="pug">
.history
    h2 Library
    v-text-field(
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details)
    v-data-table(:headers="headers" :items="songs" :search="search")
        template(v-slot:items="props")
            td {{ props.item.ID }}
            td {{ props.item.title }}
            td {{ props.item.artist }}
            td {{ props.item.album }}
            td {{ formatDuration(props.item.duration) }}
            td {{ distanceInWordsToNow(props.item["date_played"]) }} ago
            td {{ props.item.year }}
            td {{ props.item["count_played"] }}
            td.justify-center.layout.px-0
                v-icon.mr-2(@click="loadFile(props.item.ID)") play_arrow
        template(v-slot:no-results)
            v-alert(:value="true" color="error" icon="warning") Your search for "{{ search }}" found no results.
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { loadFile } from "./lib/radio-dj";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";

@Component({
    methods: { loadFile, distanceInWordsToNow }
})
export default class Songs extends Vue {
    songs = [];
    search = "";
    page = 0;
    headers = [
        { text: 'ID', align: 'left', value: 'ID', sortable: false },
        { text: 'Title', value: 'title', sortable: false },
        { text: 'Artist', value: 'artist', sortable: false },
        { text: 'Album', value: 'album', sortable: false },
        { text: 'Duration', value: 'duration', sortable: false },
        { text: 'Last Played', value: 'date_played', sortable: false },
        { text: 'Released', value: 'year', sortable: false },
        { text: 'Play Count', value: 'count_played', sortable: false }
    ];

    created() {
        // init now playing and playlist
        this.getSongs();
        setInterval(function () {
            (this as any).getSongs();
            }.bind(this), 1000);
    }

    getSongs() {
        (this as any).$http.get(`/query?q=songs&id=${this.page * 100 + 1}`)
        .then((body: any) => {
            this.songs = body.data;
        });
    }

    formatDuration(d: number) {
        return `${ Math.trunc(d / 60) }:${ (d % 60).toFixed(2) }`;
    }
}
</script>