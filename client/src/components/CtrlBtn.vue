<template lang="pug">
v-tooltip(top).control-btn
    template(v-slot:activator="{ on }")
        .control(v-on="on" :class="{ 'hidden-md-and-down': hide }")
            v-btn(@click.prevent="$emit('click')" flat)
                v-icon {{ icon }}
    span {{ tooltip }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
})
export default class CtrlBtn extends Vue {
    @Prop({type: String})
    icon: any;
    @Prop({type: String})
    tooltip: any;
    @Prop({default: false, type: Boolean})
    hide: any;
}
</script>

<style lang="sass" scoped>
</style>
