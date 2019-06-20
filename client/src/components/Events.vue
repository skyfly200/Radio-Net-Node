<template lang="pug">
.events
    .header
        h2 Events
        v-spacer
        .ctrls
            CtrlBtn(icon='add' @click='' tooltip='Add Event')
            CtrlBtn(icon='update' @click='getEvents()' tooltip='Refresh Events')
            CtrlBtn(:icon="eventsOn ? 'stop' : 'play_arrow'" @click='toggleEvents()' :tooltip="eventsOn ? 'Stop Events' : 'Start Events'")
    v-data-table(:headers="headers" :items="events" :total-items="events.length" hide-actions)
        template(v-slot:items="props")
            td {{ props.item.ID }}
            td {{ props.item.name }}
            td {{ types[props.item.type] }}
            td {{ formatTime(props.item) }}
            td {{ props.item.catagory }}
            td.justify-center.layout.px-0
                CtrlIcon.mr-2(icon='edit' @click='' tooltip='Edit Event')
                CtrlIcon(icon='delete' @click='' tooltip='Delet Event')
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import format from "date-fns/format";
import { setEvents, refreshEvents } from "./lib/radio-dj";
import CtrlBtn from "./CtrlBtn.vue";
import CtrlIcon from "./CtrlIcon.vue";

@Component({
    methods: { refreshEvents },
    components: { CtrlBtn, CtrlIcon }
})
export default class Events extends Vue {
    events = [];
    eventsOn = true;

    types = ["One Time Only", "Repeat by Day", "Repeat by Day and Hour", "Manual Event", "Start-up Event", "Repeat by Date", "Repeat by Date and Hour", ];

    headers = [
        { text: 'ID', value: 'ID', align: 'left', sortable: false },
        { text: 'Name', value: 'name', sortable: false },
        { text: 'Type', value: 'type', sortable: false },
        { text: 'Time', value: 'time', sortable: false },
        { text: 'Catagory', value: 'catagory', sortable: false }
    ];

    created() {
        // init now playing and playlist
        this.getEvents();
    }

    toggleEvents() {
        this.eventsOn = !this.eventsOn;
        setEvents(Number(this.eventsOn));
    }

    formatTime(item: any) {
        switch(item.type) {
            case 0: 
                return `${item.time} ${format(item.date, 'MM/DD/YY')}`;
                break;
            case 1: 
                return `${item.day.split('&').slice(1)}`;
                break;
            case 2: 
                return `${item.day.split('&').slice(1)} ${item.hours.split('&').slice(1)}`;
                break;
            case 3: 
                return "-";
                break;
            case 4: 
                return "-";
                break;
            default:
                return `${item.time} ${format(item.date, 'MM/DD/YY')}`;
        }
    }

    getEvents() {
        (this as any).$http.get("/db/query?q=events")
        .then((body: any) => {
            this.events = body.data;
        });
    }
}
</script>

<style lang="sass" scoped>
    .header, .ctrls
        display: flex
</style>

