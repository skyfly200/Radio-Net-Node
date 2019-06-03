<template lang="pug">
.queue
    h1 Player Queue
    v-data-table(:headers="headers" :items="queue" :total-items="queue.length" hide-actions)
        template(v-slot:items="props")
            td {{ props.item.title }}
            td(class="text-xs-right") {{ props.item.artist }}
            td(class="text-xs-right") {{ props.item.album }}
            td(class="text-xs-right") {{ props.item.genera }}
            td(class="text-xs-right") {{ props.item.date }}
            td(class="text-xs-right") {{ props.item.duration }}
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Queue extends Vue {
    headers = [
        {
            text: 'Title',
            align: 'left',
            value: 'title'
        },
        { text: 'Artist', value: 'artist' },
        { text: 'Album', value: 'album' },
        { text: 'Genera', value: 'genera' },
        { text: 'Release Date', value: 'date' },
        { text: 'Duration', value: 'duration' }
    ];
    queue = [
        {
            title: 'Willy The Pimp',
            artist: 'Frank Zappa',
            album: 'Hot Rats',
            genera: 'Classic rock',
            date: new Date('October 10, 1969'),
            duration: 183.54
        },
        {
            title: 'Money',
            artist: 'Pink Floyd',
            album: 'Dark Side of the Moon',
            genera: 'Classic Rock',
            date: new Date('March 1, 1973'),
            duration: 183.54
        },
        {
            title: 'Dont mean a thing',
            artist: 'Ella Fitzgerald',
            album: 'The Classics',
            genera: 'Swing',
            date: new Date('2001'),
            duration: 183.54
        }
    ];
}
</script>
