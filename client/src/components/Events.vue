<template lang="pug">
.events
    h2 Events
    v-data-table(:headers="headers" :items="events" :total-items="events.length" hide-actions)
        template(v-slot:items="props")
            td {{ props.item.ID }}
            td {{ props.item.name }}
            td {{ props.item.type }}
            td {{ props.item.time }}
            td {{ props.item.date }}
            td {{ props.item.day }}
            td {{ props.item.hours }}
            td {{ props.item.catagory }}
            td.justify-center.layout.px-0
                v-icon.mr-2(@click="") edit
                v-icon(@click="") delete
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
        { text: 'ID', value: 'ID', align: 'left', sortable: false },
        { text: 'Name', value: 'name', sortable: false },
        { text: 'Type', value: 'type', sortable: false },
        { text: 'Time', value: 'time', sortable: false },
        { text: 'Date', value: 'date', sortable: false },
        { text: 'Day', value: 'day', sortable: false },
        { text: 'Hours', value: 'hours', sortable: false },
        { text: 'Catagory', value: 'catagory', sortable: false }
    ];

    created() {
        // init now playing and playlist
        this.getEvents();
        setInterval(function (this: any) {
            (this as any).getEvents();
            }.bind(this), 1000);
    }

    getEvents() {
        (this as any).$http.get("/db/query?q=events")
        .then((body: any) => {
            this.events = body.data;
        });
    }
}
</script>
