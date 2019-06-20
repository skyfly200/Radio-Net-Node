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
            td {{ props.item.category }}
            td.justify-center
                CtrlIcon.mr-2(:icon="props.item.enabled === 'True' ? 'toggle_on' : 'toggle_off'" 
                    :tooltip="props.item.enabled === 'True' ? 'Disable Event' : 'Enable Event'"
                    @click='' large)
            td.justify-center.layout.px-0
                CtrlIcon.mr-2(icon='edit' @click='' tooltip='Edit Event')
                CtrlIcon(icon='delete' @click='' tooltip='Delete Event')
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

    types = ["One Time Only", "Repeat by Day", "Repeat by Day and Hour", "Manual Event", "Start-up Event", "Repeat by Date", "Repeat by Date and Hour"];
    days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    headers = [
        { text: 'ID', value: 'ID', align: 'left', sortable: false },
        { text: 'Name', value: 'name', sortable: false },
        { text: 'Type', value: 'type', sortable: false },
        { text: 'Time', value: 'time', sortable: false },
        { text: 'Category', value: 'category', sortable: false },
        { text: 'Enabled', value: 'enabled', sortable: false },
        { text: 'Controls', sortable: false }
    ];

    created() {
        // init now playing and playlist
        this.getEvents();
    }

    toggleEvents() {
        this.eventsOn = !this.eventsOn;
        setEvents(Number(this.eventsOn));
    }

    preParse(value: string) {
        return value.split('&').slice(1);
    }

    numSort(a: string, b: string): number {
        let aN = Number(a);
        let bN = Number(b);
        return ( (aN < bN) ? -1 : (aN === bN ? 0 : 1) );
    }

    formatTime(item: any) {
        switch(item.type) {
            case 0: 
                return `${item.time}
                        ${format(item.date, 'MM/DD/YY')}`;
                break;
            case 1: 
                return `${this.preParse(item.day).sort(this.numSort).map((d: any) => this.days[d])}`;
                break;
            case 2: 
                return `${this.preParse(item.day).sort(this.numSort).map((d: any) => this.days[d])}
                        ${this.preParse(item.hours).sort(this.numSort)}`;
                break;
            case 3: 
                return "-";
                break;
            case 4: 
                return "-";
                break;
            default:
                return `${item.time}
                        ${format(item.date, 'MM/DD/YY')}`;
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

