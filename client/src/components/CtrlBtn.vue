<template lang="pug">
v-tooltip(top).control-btn
    template(v-slot:activator="{ on }")
        .control(v-on="on" :class="{ 'hidden-md-and-down': hide }")
            v-btn(@click.prevent="debouncedClick()" flat)
                v-icon(:small="small" :large="large") {{ icon }}
    span {{ tooltip }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import _ from 'lodash';

@Component({
})
export default class CtrlBtn extends Vue {
    @Prop({default: ''})
    icon: any;
    @Prop({default: ''})
    tooltip: any;
    @Prop({default: false, type: Boolean})
    hide: any;
    @Prop({default: false, type: Boolean})
    large: any;
    @Prop({default: false, type: Boolean})
    small: any;

    debouncedClick = _.debounce(this.click, 500);
    click() {
        this.$emit('click');
    }
}
</script>

<style lang="sass" scoped>
.ctrls button
    min-width: 40px !important
    padding: 5px 0 !important
</style>
