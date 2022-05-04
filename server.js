const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const port = 7077;

const open = require('open');
const { fork } = require("child_process");

const path = require("path");
const directoryPath = path.join(__dirname, "videos");
const fs = require("fs");

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const { getVideoDurationInSeconds } = require('get-video-duration');

const videoList = [];


app.use(bodyParser.json());
const cors = require('cors');
app.use(cors())

app.post('/api/post/launch', async function (req, res) {
  try {
    open(`./videos/${req.body.video}`);
    res.send("ok")
  } catch (e) {
    res.send(e);
  }
});

app.post('/api/post/record', async function (req, res) {
  if (!req.body.m3u8) {
    res.status(400).send(
      "No m3u8 link provided"
    );
  } else {
    res.send("ok");
    // Make filename valid
    const title = `${req.body.username} - ${req.body.title}`;

    // Add to video list
    videoList.push(title)

    // Create child process
    const child = fork("record.js", [title, req.body.m3u8]);
  }
});

app.get('/api/get/videos', async function (req, res) {
  fs.readdir(directoryPath, function (err, files) {
    let fileArray = []
    //handling error
    if (err) {
      return console.error("Unable to scan directory: " + err);
    }
    //listing all files using forEach
    files.forEach(async function (file) {
      // Add file to array
      if (file.includes(".mp4")) {
        fileArray.push(file);
        let length = 0
        await getVideoDurationInSeconds(`${directoryPath}/${file}`).then((duration) => {
          length = duration
        })
        ffmpeg(`${directoryPath}/${file}`)
          .seekInput(length / 60)
          .output(`${directoryPath}/thumbnails/${file.replace(".mp4", ".png")}`)
          .outputOptions(
            '-frames', '1'  // Capture just one frame of the video
          )
          .run()
      }
    })
    res.send(fileArray);
    // Delete all thumbnails that doesn't have a video file
    fs.readdir(`${directoryPath}/thumbnails`, function (err, files) {
      files.forEach(function (file) {
        if (!fileArray.includes(file.replace(".png", ".mp4"))) {
          fs.unlink(`${directoryPath}/thumbnails/${file}`, function (err) {
            if (err) throw err;
          });
        }
      })
    })
  });
});

app.listen(port, async function () {
  console.log(`Server listening on port ${port} | ${new Date()}`);
});