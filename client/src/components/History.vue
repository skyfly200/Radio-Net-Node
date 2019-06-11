<template lang="pug">
.history
    h2 History
    v-data-table(:headers="headers" :items="history" :total-items="history.length" hide-actions)
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
    history = [{"date_played":"2019-06-11T03:53:01.000Z","artist":"Mai Yamane","album":"","title":"Tasogare"},{"date_played":"2019-06-11T03:50:05.000Z","artist":"03 Cletus Awreetus","album":"","title":"Awrightus"},{"date_played":"2019-06-11T03:50:00.000Z","artist":"Syd Barrett","album":"Opel","title":"Milky Way"},{"date_played":"2019-06-11T03:49:53.000Z","artist":"Radio Stream","album":"","title":"Way High Studio"}];
    headers = [
        { text: 'Played', value: 'DatePlayed', sortable: false },
        {
            text: 'Title',
            align: 'left',
            value: 'Title',
            sortable: false
        },
        { text: 'Artist', value: 'Artist', sortable: false },
        { text: 'Album', value: 'Album', sortable: false }
    ];
}
</script>
