<template>
    <v-layout row wrap fill-height>
        <v-flex d-flex md12 xs12 sm12 lg7 offset-lg1>
            <v-layout column>
                <v-flex class="text-xs-center main-font">
                        ROUND {{ phaseNumber }} OF {{ addZeroIfOneDigit(rounds) }}
                </v-flex>
                <v-flex class="text-xs-center main-font"
                        v-bind:class="[setUp ? selectedPhase + '-phase' : phase + '-phase']">
                    <p v-if="!setUp">{{ phase.toUpperCase() }}</p>
                    <p v-else>{{ selectedPhase.toUpperCase() }}</p>
                </v-flex>
                <v-flex class="text-xs-center clock-border pa-2"
                        v-bind:class="[setUp ? selectedPhase + '-phase' : phase + '-phase']">
                    <v-layout row justify-center v-if="setUp && selectedPhase!='rounds'">
                        <v-flex xs6>
                            <arrow-button v-bind:arrowIcon="'arrow_drop_up'"
                                          v-on:edit-time="increment(selectedPhase, stepMinutes)"/>
                        </v-flex>
                        <v-flex xs6>
                            <arrow-button v-bind:arrowIcon="'arrow_drop_up'"
                                          v-on:edit-time="increment(selectedPhase, stepSeconds)"/>
                        </v-flex>
                    </v-layout>
                    <v-layout justify-space-around class="clock-font" v-if="!setUp">
                        <v-flex xs5 class="text-xs-right">
                            {{ addZeroIfOneDigit(minutes) }}
                        </v-flex>
                        <v-flex xs1>:</v-flex>
                        <v-flex xs5 class="text-xs-left">
                            {{ addZeroIfOneDigit(seconds) }}
                        </v-flex>
                    </v-layout>
                    <v-layout v-else class="clock-font">
                        <v-flex v-if='selectedPhase != "rounds"'>
                            {{ format($data[selectedPhase]) }}
                        </v-flex>
                        <v-flex v-if="setUp && selectedPhase =='rounds'">
                            <arrow-button v-bind:arrowIcon="'arrow_left'"
                                          v-on:edit-time="increment(selectedPhase, -stepRound)"/>                            
                        </v-flex>  
                        <v-flex v-if="selectedPhase == 'rounds'">
                            {{ rounds }}
                        </v-flex>
                        <v-flex v-if="setUp && selectedPhase =='rounds'">
                            <arrow-button v-bind:arrowIcon="'arrow_right'"
                                          v-on:edit-time="increment(selectedPhase, stepRound)"/>   
                        </v-flex>                        

                    </v-layout>
                    <v-layout row justify-center v-if="setUp && selectedPhase!='rounds'">
                        <v-flex xs6>
                            <arrow-button v-bind:arrowIcon="'arrow_drop_down'"
                                          v-on:edit-time="increment(selectedPhase, -stepMinutes)"/>   
                        </v-flex>
                        <v-flex xs6>
                            <arrow-button v-bind:arrowIcon="'arrow_drop_down'"
                                          v-on:edit-time="increment(selectedPhase, -stepSeconds)"/>   
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex class="text-xs-center main-font mt-3">
                    <v-layout justify-space-around class="main-font">
                        <v-flex xs5 class="text-xs-right">
                            TOTAL
                        </v-flex>
                        <v-flex xs1>:</v-flex>
                        <v-flex xs5 class="text-xs-left">
                            {{ remainder }}
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex d-flex>
                    <v-layout row justify-center class="mt-1 mb-1">
                        <v-btn fab large outline v-if="!isRunning" @click="start()">
                            <v-icon>play_arrow</v-icon>
                        </v-btn>
                        <v-btn fab large outline v-if="isRunning" @click="pause()">
                            <v-icon>pause</v-icon>
                        </v-btn>
                        <v-btn fab large outline v-if="isRunning || current!=1" @click="reset()">
                            <v-icon>refresh</v-icon>
                        </v-btn>
                        <v-btn fab large outline v-if="!isRunning && current==1" @click="setUp = !setUp">
                            <v-icon>edit</v-icon>
                        </v-btn>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-flex>
        <v-flex d-flex lg2 offset-lg1 md8 offset-md2 sm10 offset-sm1>
            <v-layout column>
                <v-flex>
                    <div class="phase-font text-xs-center">ROUNDS</div>
                    <button @click="selectedPhase = 'rounds'" :disabled="!setUp" class="text-xs-center phase-as-button phase-font">
                        {{ rounds }}
                    </button>                        
                </v-flex>
                <v-flex v-for="phaseX of ['prepare', 'round', 'warning', 'rest']" :key="phaseX" class="mt-4">
                        <p class="phase-font text-xs-center"
                            v-bind:class="phaseX + '-phase'">
                            {{ phaseX.toUpperCase() }}
                        </p>
                        <button :disabled="!setUp" @click="selectedPhase = phaseX"
                                class="text-xs-center phase-as-button phase-font" v-bind:class="phaseX + '-phase'">
                                <span class="phase-clock-font">{{ format($data[phaseX]) }}</span>
                        </button>
                    </v-flex>
            </v-layout>
        </v-flex>
    </v-layout>
</template>


<script>
import { setInterval, clearInterval } from 'timers';
import moment from 'moment';
import ArrowButton from './ArrowButton.vue';

export default {
    name: "Timer",
    components: { ArrowButton },
    data(){
        return {
            rounds: 12,
            round: 180,
            rest: 60,
            prepare: 10,
            warning: 10,

            current: 1,
            interval: null,
            isRunning: false,

            setUp: false,
            selectedPhase: 'rounds', 
    
            stepRound: 1,
            stepSeconds: 5,
            stepMinutes: 60,
        }
    },
    computed:{
        total: function(){
            return this.rounds * this.round + this.rest * (this.rounds - 1) + this.prepare
        },
        remainder: function(){
            return moment.utc(moment.duration((this.total - this.current + 1), 's').asMilliseconds()).format("HH:mm:ss")
        },
        phase: function(){
            return this.getPhase()[0]
        },
        tillPhaseEnd: function(){
            return this.getPhase()[1]
        },
        minutes: function(){
            return Math.floor(this.tillPhaseEnd / 60) % 60;
        },
        seconds: function(){
            return (this.tillPhaseEnd) % 60
        },
        phaseNumber: function(){
            return ('0' + this.getPhaseNumber()).slice(-2)
        },
    },
    watch: {
        phase: {
            handler(val, oldVal){
                if(this.isRunning){
                    this.play()
                }
            }
        }
    },
    methods:{
        format: function(seconds){
            return moment.utc(moment.duration((seconds), 's').asMilliseconds()).format("mm:ss")
        },
        play: function(){
            new Audio(require('../assets/audio/' + this.phase + '.ogg')).play()
        },
        tick: function(){
            if(this.current < this.total){
                this.current++;
            }
            else { this.reset(); }
        },
        start: function(){
            this.setUp = false;
            this.isRunning = true;
            this.interval = setInterval((this.tick), 1000);
        },
        pause: function(){
            clearInterval(this.interval);
            this.interval = null;
            this.isRunning = false;
        },
        reset: function(){
            this.pause();
            this.current = 1;           
        },
        getPhaseNumber(){
            if(this.current <= this.prepare){
                return Math.ceil((this.current) / (this.round + this.rest))
            }
            else { return Math.ceil((this.current - this.prepare) / (this.round + this.rest)) }
        },
        isBegginingOfPhase(phase, second){
            return this.$data[phase] % second == 0
        },
        getPhase: function(){
            var i = this.getPhaseNumber();
            var current = this.current - this.prepare;
            if(this.current <= this.prepare){
                return ['prepare', this.prepare-this.current + 1]
            }
            else if(current > this.round * i + this.rest * (i - 1)){
                return ['rest',  (this.round + this.rest) * i - current + 1 ]
            }
            else if(current <= this.round * i + this.rest * (i - 1) - this.warning){
                return ['round', (this.round * i + this.rest * (i - 1)) - current + 1]
            }
            else{
                return ['warning', (this.round * i + this.rest * (i - 1)) - current + 1]
            }
        },
        addZeroIfOneDigit: function(number){
            return ('0' + number).slice(-2)
        },
        increment: function(phase, seconds){
            if(this.$data[phase] + seconds >= 0 && this.$data[phase] + seconds <= 3600){
                this.$data[phase] += seconds;
            }
        }
        
    },
}
</script>
<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Abril+Fatface|Orbitron');

$warning-color: #FF9800;
$prepare-color: #FFFF00;
$round-color: #76FF03;
$rest-color: #D50000;
$phase-border: 10px;
$clock-font-color: white;
$clock-font: cursive;
$main-font: 'Abril Fatface', cursive;

%default-font{
    font-family: $main-font;
}
@mixin phase-coloring($phase-color){
    color: $phase-color;
    border-color: $phase-color !important;
    &:hover:enabled{
        background-color: $phase-color !important;
    }
}
.warning-phase{
    @include phase-coloring($warning-color)
}
.prepare-phase{
    @include phase-coloring($prepare-color)
}
.round-phase{
    @include phase-coloring($round-color)
}
.rest-phase{
    @include phase-coloring($rest-color)
}
.phase-as-button{
    background-color: transparent;
    border-radius: $phase-border;
    border-width: $phase-border;
    border-style: solid;
    padding: 10px 0 10px 0;
    width: 100%;
    transition-duration: 0.4s;
    &:focus{
        border: $phase-border double white;
    }
    &:enabled{
        border-style: double;
    }
    &:hover:enabled{
        background-color: white;
        color: black;
    }
}
.main-font{
    @extend %default-font;
    font-size: 90px;
}
.phase-font{
    @extend %default-font;
    font-size: 50px;
}
.clock-font{
    font-size: 280px;
    font-weight: 600;
    color: $clock-font-color;
}
.phase-clock-font{
    color: $clock-font-color;
}
.clock-border{
    border-width: $phase-border * 2;
    border-radius: $phase-border;
    border-style: solid;
}
@media(max-width: 1264px){
    .clock-font{
        font-size: 200px;
    }
    .main-font{
        font-size: 50px;
    }
}
@media(max-width: 600px){
    .clock-font{
        font-size: 100px;
    }
    .main-font, .phase-font{
        font-size: 30px;
    }
    .v-btn--floating.v-btn--large {
        width: 75px !important;
        height: 75px !important;
    }
}
</style>
