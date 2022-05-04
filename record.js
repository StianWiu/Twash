const title = process.argv[2];
const url = process.argv[3];
const m3u8stream = require('m3u8stream');
const fs = require('fs');

function convertToValidFilename(string) {
  return (string.replace(/[\/|\\:*?"<>]/g, " "));
}


m3u8stream(url).pipe(
  fs.createWriteStream(
    "./videos/" + convertToValidFilename(title) + ".mp4"
  )
);