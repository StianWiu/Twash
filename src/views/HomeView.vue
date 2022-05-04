<template>
  <div class="home">
    <h1>Twash</h1>
    <p>(Twitch Dash)</p>
    <h3>Your TwitchRec Dashboard</h3>
    <div class="main">
      <input
        :placeholder="this.getRandomStreamer()"
        v-model="streamer"
        @input="this.input = streamer"
        @keyup.enter="this.getStreamer(streamer)"
        class="SearchBar"
      />
      <div class="Underline"></div>
      <div v-if="this.result !== null">
        <a v-bind:href="'https://twitch.tv/' + this.result.twitch.user_login">
          <img class="thumbnail" :src="this.result.twitch.thumbnail_url" />
        </a>
        <h2>
          {{ this.result.twitch.title }}
        </h2>
        <h3>
          <a
            class="link"
            v-bind:href="
              'https://www.twitch.tv/directory/game/' +
              this.result.twitch.game_name
            "
          >
            {{ this.result.twitch.game_name }}
          </a>
        </h3>
        <div class="same-line">
          <div class="viewers">
            <svg class="viewer-icon">
              <path
                fill-rule="evenodd"
                d="M5 7a5 5 0 116.192 4.857A2 2 0 0013 13h1a3 3 0 013 3v2h-2v-2a1 1 0 00-1-1h-1a3.99 3.99 0 01-3-1.354A3.99 3.99 0 017 15H6a1 1 0 00-1 1v2H3v-2a3 3 0 013-3h1a2 2 0 001.808-1.143A5.002 5.002 0 015 7zm5 3a3 3 0 110-6 3 3 0 010 6z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span class="viewer-number">{{
              this.result.twitch.viewer_count
            }}</span>
          </div>
          {{ this.result.twitch.live_time }}
        </div>
        <h3>
          <a class="link" v-bind:href="this.result.m3u8.url">Raw Stream</a>
        </h3>
        <button
          v-if="this.result.twitch.title !== 'Streamer not found / not live'"
          @click="this.record(this.result.m3u8.url)"
        >
          Start Recording
        </button>
        <button @click="this.retry()" v-else>Try recording anyways</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "HomeView",
  data: function () {
    return {
      result: null,
      input: "",
    };
  },
  methods: {
    record(m3u8) {
      axios
        .post("http://localhost:7077/api/post/record", {
          m3u8: m3u8,
          title: this.result.twitch.title,
          username: this.result.twitch.user_login,
        })
        .then((res) => {
          console.log(res);
          //
        });
    },
    retry() {
      axios({
        method: "post",
        url: "https://twash.astraea.dev/api/request/twitch/user/m3u8",
        data: {
          ["username"]: this.input,
        },
      })
        .then((response) => {
          axios
            .post("http://localhost:7077/api/post/record", {
              m3u8: response.data.url,
            })
            .then((res) => {
              console.log(res);
            });
        })
        .catch(() => {
          window.alert("Streamer is definitely not live");
        });
    },
    getStreamer(streamer) {
      if (streamer) {
        axios({
          method: "post",
          url: "https://twash.astraea.dev/api/request/twitch/user",
          data: {
            ["username"]: streamer,
          },
        })
          .then((response) => {
            this.result = response.data;

            // Replace "{width"} with 1920
            // Replace "{height}" with 1080
            let url = this.result.twitch.thumbnail_url.replace(
              "{width}",
              "1920"
            );
            url = url.replace("{height}", "1080");
            this.result.twitch.thumbnail_url = url;

            // Calculate how long the streamer has been live for
            let now = new Date();
            let then = new Date(this.result.twitch.started_at);
            let diff = now - then;
            let seconds = Math.floor(diff / 1000);
            let minutes = Math.floor(seconds / 60);
            let hours = Math.floor(minutes / 60);
            seconds = seconds - 60 * minutes;
            minutes = minutes - 60 * hours;
            this.result.twitch.live_time =
              hours + ":" + minutes + ":" + seconds;
          })
          .catch(() => {
            this.result = {
              twitch: {
                title: "Streamer not found / not live",
                user_login: "Streamer not found / not live",
                game_name: "Streamer not found / not live",
                thumbnail_url:
                  "https://static-cdn.jtvnw.net/ttv-static/404_preview-320x180.jpg",
                viewer_count: 0,
                started_at: "Streamer not found / not live",
                live_time: "0:0:0",
              },
              m3u8: {
                url: "Streamer not found / not live",
              },
            };
          });
      }
    },
    getRandomStreamer() {
      const streamers = [
        "QTCinderella",
        "Katrine",
        "Moistcr1tikal",
        "freecodecamp",
        "CodeMiko",
        "Ottomated",
        "jschlatt",
        "codeBullet",
        "heyFlshy",
        "WhiteRavenGame",
        "TheArtOfFail",
        "Gallant_beast",
        "ntina_art",
        "xiraxio",
      ];
      return streamers[Math.floor(Math.random() * streamers.length)];
    },
  },
};
</script>

<style scoped>
p {
  color: #666666;
  margin: 0;
}

h1 {
  margin: 0;
}

button {
  background-color: #f5f5f5;
  border: none;
  border-radius: 5px;
  color: #42b983;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0.5rem 0;
  padding: 0.3rem 0.7rem;

  transition: 0.2s;
}

button:hover {
  background-color: #42b983;
  color: #f5f5f5;
}

.link {
  color: #42b983;
  font-size: 20px;
  font-weight: bold;
}

.same-line {
  display: flex;
  justify-content: center;
}

.main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.SearchBar {
  width: 200px;
  height: 20px;
  border-radius: 7px;
  padding: 10px;
  font-size: 20px;
  font-weight: bold;
  color: #42b983;

  text-align: center;
  margin: 0 0 20px 0;
}

.Underline {
  width: 40%;
  height: 1px;
  background-color: #42b983;
  margin: 0 0 20px 0;
}

.thumbnail {
  width: 384px;
  height: 216px;
  border-radius: 7px;
}

.viewers {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 0 10px 20px 0;
  color: #ff8280;
}

.viewer-icon {
  fill: #ff8280;
  width: 20px;
  height: 20px;
}
</style>
