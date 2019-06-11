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
            td {{ props.item.enabled }}
            td {{ props.item.catagory }}
            td.justify-center.layout.px-0
                v-icon.mr-2(@click="playItem(props.index)") edit
                v-icon(@click="removeItem(props.index)") delete
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";

@Component({
    methods: { distanceInWordsToNow }
})
export default class Events extends Vue {
    events = [
        {"ID":3,"name":"Test","type":0,"time":"22:02:22","date":"2019-06-10T06:00:00.000Z","day":"&","hours":"&","enabled":"True","category":"Default"},
        {"ID":4,"name":"Test 2","type":1,"time":"22:02:35","date":"2002-01-01T07:00:00.000Z","day":"&1&2&3&4&5&6&0","hours":"&","enabled":"True","category":"Default"}
        ];
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
}
</script>
