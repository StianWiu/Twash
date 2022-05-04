<template>
  <div class="about">
    <VideoList />
  </div>
</template>

<script>
// @ is an alias to /src
import VideoList from "@/components/VideoList.vue";

export default {
  name: "VideoView",
  components: {
    VideoList,
  },
};
</script>
