import ThumbnailGenerator from "video-thumbnail-generator";
import axios from "axios";
import fs from "fs";

const videoThumbnailGenerator = () => {
  const awsVideoUrl =
    "https://videos-nimatube.s3.amazonaws.com/videos/d3c0dd40-2801-425d-9e04-fd68ab65f33a6562841d847706468d2fefcc3310c0c74718412229db2253664c0a4c.mp4";
  const outputThumbnailPath = "path/to/save/thumbnail.jpg";

  // Function to download the video from a URL to a local temporary file
  async function downloadVideoFromUrl(url, localFilePath) {
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });

    const writer = fs.createWriteStream(localFilePath);

    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  }
  // const ThumbnailGenerator = require('video-thumbnail-generator').default;

  const tg = new ThumbnailGenerator({
    sourcePath: "/tmp/test.mp4",
    thumbnailPath: "/tmp/",
    tmpDir: "/some/writeable/directory", //only required if you can't write to /tmp/ and you need to generate gifs
  });

  tg.generate().then(console.log);
  // [ 'test-thumbnail-320x240-0001.png',
  //  'test-thumbnail-320x240-0002.png',
  //  'test-thumbnail-320x240-0003.png',
  //  'test-thumbnail-320x240-0004.png',
  //  'test-thumbnail-320x240-0005.png',
  //  'test-thumbnail-320x240-0006.png',
  //  'test-thumbnail-320x240-0007.png',
  //  'test-thumbnail-320x240-0008.png',
  //  'test-thumbnail-320x240-0009.png',
  //  'test-thumbnail-320x240-0010.png' ]

  tg.generateOneByPercent(90).then(console.log);
  // 'test-thumbnail-320x240-0001.png'

  tg.generateCb((err, result) => {
    console.log(result);
    // [ 'test-thumbnail-320x240-0001.png',
    //  'test-thumbnail-320x240-0002.png',
    //  'test-thumbnail-320x240-0003.png',
    //  'test-thumbnail-320x240-0004.png',
    //  'test-thumbnail-320x240-0005.png',
    //  'test-thumbnail-320x240-0006.png',
    //  'test-thumbnail-320x240-0007.png',
    //  'test-thumbnail-320x240-0008.png',
    //  'test-thumbnail-320x240-0009.png',
    //  'test-thumbnail-320x240-0010.png' ]
  });

  tg.generateOneByPercentCb(90, (err, result) => {
    console.log(result);
    // 'test-thumbnail-320x240-0001.png'
  });

  tg.generateGif().then(console.log("gif"));
  // '/full/path/to/video-1493133602092.gif'

  tg.generateGifCb((err, result) => {
    console.log(result);
    // '/full/path/to/video-1493133602092.gif'
  });
};
export default videoThumbnailGenerator;
