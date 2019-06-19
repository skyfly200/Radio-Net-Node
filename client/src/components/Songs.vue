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
                CtrlIcon.mr-2(icon='play_arrow' @click='play(props.item.ID)' tooltip='Play')
                CtrlIcon.mr-2(icon='playlist_add' @click='loadFile(props.item.ID)' tooltip='Add to Queue')
                CtrlIcon(icon='queue_play_next' @click='playNext(props.item.ID)' tooltip='Play Next')
        template(v-slot:no-results)
            v-alert(:value="true" color="error" icon="warning") Your search for "{{ search }}" found no results.
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import _ from 'lodash';
import { playNext, loadFile, next } from "./lib/radio-dj";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import CtrlIcon from "./CtrlIcon.vue";

@Component({
    methods: { playNext, loadFile, next, distanceInWordsToNow },
    components: { CtrlIcon }
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
    }

    play(id: number) {
        loadFile(id);
        next;
    }

    getSongs() {
        (this as any).$http.get(`/db/query?q=songs&id=${this.page * 100 + 1}`)
        .then((body: any) => {
            this.songs = body.data;
        });
    }

    formatDuration(d: number) {
        return `${ Math.trunc(d / 60) }:${ (d % 60).toFixed(2) }`;
    }
}
</script>
