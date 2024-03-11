// import { getVideoDurationInSeconds } from "get-video-duration";
// import VideoTimeReader from "../../routes/video/post/timer.js";
// import videoModel from "../../db/schema/videoModel.js";
// import { v4 as uuidv4 } from "uuid";
// import { fileTypeFromBuffer } from "file-type";
// // import fileType from "file-type";
// // import ffprobe from "ffprobe";
// // import ffprobeStatic from "ffprobe-static";
// import fs from "fs";
// import fileTipeHandler from "./fileTipeHandler.js";
// import createFileFromBuffer from "../../routes/video/post/createFileFromBuffer.js";
// import path from "path";
// const __dirname = path.resolve();

// const timeHandelr = async (Id, buffer) => {
//   if (Id) {
//     videoModel.findOne({ _id: Id }).then(async (video) => {
//       if (video) {
//         //     ffprobe(path, { path: ffprobeStatic.path }, (err, info) => {
//         //       (async () => {
//         //         if (err) {
//         //           console.log(err);
//         //         } else {
//         //           const numberDuration = info.streams[0].duration;
//         //           if (typeof numberDuration !== "undefined") {
//         //             const timeVideo = VideoTimeReader(parseInt(numberDuration));
//         //             console.log(timeVideo);
//         //             const filter = {
//         //               _id: video._id,
//         //             };
//         //             const updateUser = {
//         //               duration: timeVideo,
//         //             };
//         //             try {
//         //               await videoModel.updateOne(filter, updateUser);
//         //               console.log("updates");
//         //               // fs.unlinkSync(path);
//         //               //file removed
//         //             } catch (error) {}
//         //           }
//         //         }
//         //       })();
//         //     });
//         const mainBuffer = Buffer.from(buffer);
//         const videoFileType = fileTipeHandler(buffer);
//         console.log("buffer times handeler", videoFileType);

//         const fileName = uuidv4() + "." + videoFileType;
//         console.log(fileName);
//         const filePath = __dirname + "/" + fileName;
//         if (fileName && fileName.length) {
//           fs.writeFile(fileName, mainBuffer, async (err) => {
//             if (err) {
//               console.log(err);
//             } else {
//               console.log();
//               fs.access(filePath, fs.constants.F_OK, async (err) => {
//                 if (err) {
//                 } else {
//                   await getVideoDurationInSeconds(filePath).then(
//                     async (duration) => {
//                       const timeVideo = VideoTimeReader(duration);
//                       console.log("timeVideo", timeVideo);
//                       const filter = {
//                         _id: video._id,
//                       };
//                       const updateUser = {
//                         duration: timeVideo,
//                       };
//                       fs.unlinkSync(filePath);
//                       try {
//                         await videoModel.updateOne(filter, updateUser);
//                       } catch (error) {}
//                     }
//                   );
//                 }
//               });
//             }
//           });
//         } else {
//           console.log("file is fucked");
//         }
//       }
//     });
//   }
// };

// export default timeHandelr;

const timeHandelr = async (data) => {};
export default timeHandelr;
