<template>
  <VideoList />
</template>

<script>
import VideoList from "./components/VideoList.vue";

export default {
  name: "App",
  components: {
    VideoList,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
