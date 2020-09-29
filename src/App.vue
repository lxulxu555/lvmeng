<template>
  <div id="app">
    <router-view style="height: 100%"/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  html, body, #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
    padding: 0;
    margin: 0;
  }
</style>

