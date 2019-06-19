<template lang="pug">
v-tooltip(top).control-btn
    template(v-slot:activator="{ on }")
        .control(v-on="on" :class="{ 'hidden-md-and-down': hide }")
            v-icon(@click.prevent="debouncedClick()") {{ icon }}
    span {{ tooltip }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import _ from 'lodash';

@Component({
})
export default class CtrlIcon extends Vue {
    @Prop({type: String})
    icon: any;
    @Prop({type: String})
    tooltip: any;
    @Prop({default: false, type: Boolean})
    hide: any;

    debouncedClick = _.debounce(this.click, 500);
    click() {
        this.$emit('click');
    }
}
</script>

<style lang="sass" scoped>
.control
    i
        height: 100%
</style>
