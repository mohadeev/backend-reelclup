import express from "express";
import path from "path";
import fs from "fs";
const test = express.Router();
const videoPath = "./uploads/SaveInsta.App-2026952240178272090_4293604513.mp4";

test.get("/video:videoParam", (req, res) => {
  const vidParam = req.params.videoParam;
  var origin = req.headers;
  console.log("origin", origin);
  console.log("video param" + vidParam);
  const videoFilePath = path.resolve(videoPath);
  const videoStat = fs.statSync(videoFilePath);
  const fileSize = videoStat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoFilePath, { start, end });

    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(200, head);
    fs.createReadStream(videoFilePath).pipe(res);
  }
});

export default test;
