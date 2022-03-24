const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const port = 7077;

const path = require("path");
const directoryPath = path.join(__dirname, "videos");
const fs = require("fs");

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const { getVideoDurationInSeconds } = require('get-video-duration');

app.use(bodyParser.json());
const cors = require('cors');
app.use(cors())

app.get('/api/get/videos', async function (req, res) {
  fs.readdir(directoryPath, function (err, files) {
    let fileArray = []
    //handling error
    if (err) {
      return console.log("Unable to scan directory: " + err);
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
            console.log('successfully deleted ' + file);
          });
        }
      })
    })
  });
});

app.listen(port, async function () {
  console.log(`Server listening on port ${port} | ${new Date()}`);
});