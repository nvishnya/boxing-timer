<template>
  <v-app dark class="main">
    <v-container fluid grid-list-sm>
          <timer/>
    </v-container>
  </v-app>
</template>

<script>
import Timer from './components/Timer'

export default {
  name: 'App',
  components: {
    Timer
  }
}
</script>

<style lang="scss">
html, body{
  overflow-x:hidden !important;
}
.theme--dark.application{
  background-color: black;
}
.application{
  line-height: 1;
}
.v-btn--floating.v-btn--large {
  width: 95px;
  height: 95px;
}
.v-icon{
  box-align: center;
  font-size: 130px;
  line-height: 0.4;
}
.v-btn{
  height: auto;
}
.v-btn::before{
  color: transparent !important;
}
.v-ripple_container{
  color: transparent !important;
}
.v-btn--floating.v-btn--large .v-icon{
  font-size: 60px;
}
.v-btn.v-btn--outline {
  border: 4px solid;
}
button::-moz-focus-inner {
    border: 0;
}
button:focus{
    outline: 0;
}
p{
  margin-bottom: 0;
}
</style>
