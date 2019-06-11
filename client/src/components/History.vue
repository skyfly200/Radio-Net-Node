<template lang="pug">
.history
    h2 History
    v-data-table(:headers="headers" :items="history")
        template(v-slot:items="props")
            td {{ distanceInWordsToNow(props.item["date_played"]) }} ago
            td {{ props.item.title }}
            td {{ props.item.artist }}
            td {{ props.item.album }}
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";

@Component({
    methods: { distanceInWordsToNow }
})
export default class History extends Vue {
    history = [];
    headers = [
        { text: 'Played', value: 'date_played', sortable: false },
        {
            text: 'Title',
            align: 'left',
            value: 'title',
            sortable: false
        },
        { text: 'Artist', value: 'artist', sortable: false },
        { text: 'Album', value: 'album', sortable: false }
    ];

    created() {
        // init now playing and playlist
        this.getHistory();
        setInterval(function () {
            (this as any).getHistory();
            }.bind(this), 1000);
    }

    getHistory() {
        (this as any).$http.get("/db/query?q=history")
        .then((body: any) => {
            this.history = body.data;
        });
    }
}
</script>
