<template>
  <h1>Videos</h1>
  <h3>{{ videos.length }}</h3>
  <main>
    <div
      @click="openVideo(index)"
      class="video-card"
      v-for="(video, index) in this.videos"
      v-bind:key="index"
    >
      <img
        v-bind:src="
          require('../../videos/thumbnails/' + video.replace('.mp4', '.png'))
        "
      />
      <p>
        {{ video.replace(".mp4", "") }}
      </p>
    </div>
  </main>
</template>

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
      this.videos = response.data;
    });
  },
  methods: {
    openVideo(index) {
      axios({
        method: "post",
        url: "http://localhost:7077/api/post/launch",
        data: {
          video: this.videos[index],
        },
      }).then((response) => {
        if (response.data !== "ok") {
          window.alert("Error launching video \n \n" + response.data);
        }
      });
    },
  },
};

import axios from "axios";
</script>

<style scoped>
main {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.video-card {
  display: flex;
  flex-direction: column;
  width: 192px;
  height: 108px;

  cursor: pointer;

  margin: 0 20px 100px 20px;
}

p {
  margin: 0;
}

h3 {
  color: #42b983;
  margin: 0 0 40px 0;
}

h1 {
  margin: 0;
}

.video-card > img {
  width: 100%;
  height: 100%;
}
</style>
