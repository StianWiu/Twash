<script>
export default {
  data() {
    return {
      videos: [],
    };
  },
  async created() {
    // use axios to send get request to server
    await axios({
      method: "get",
      url: "http://localhost:7077/api/get/videos",
    }).then(async (response) => {
      console.log(response.data);
      this.videos = response.data;
      // wait 3 seconds
    });
  },
  methods: {},
};

import axios from "axios";
</script>

<template>
  <main>
    <div class="video-card" v-for="video in this.videos" v-bind:key="video">
      {{ video }}
      <img
        v-bind:src="
          require('../../videos/thumbnails/' + video.replace('.mp4', '.png'))
        "
      />
    </div>
  </main>
</template>

<style>
main {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.video-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 192px;
  height: 168px;
  margin: 10px;
  border: 1px solid black;
  border-radius: 5px;
}

.video-card > img {
  width: 100%;
  height: 100%;
}
</style>
