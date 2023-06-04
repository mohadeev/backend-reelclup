import fs from "fs";

// function getFileType(buffer) {
//   const fileExt = buffer.toString("utf8", 0, 4).toLowerCase();
//   const extensions = {
//     jpg: "image/jpeg",
//     png: "image/png",
//     gif: "image/gif",
//     mp4: "video/mp4",
//     avi: "video/x-msvideo",
//     mov: "video/quicktime",
//     // Add more file types and extensions as needed
//   };
//   console.log("extensions", fileExt);
//   return extensions[fileExt];
// }
// export default getFileType;
// // function getFileTypeFromBuffer(buffer) {
// //   const extensionMap = {
// //     mp4: "mp4",
// //     webm: "webm",
// //     mov: "mov",
// //     avi: "avi",
// //     wmv: "wmv",
// //     flv: "flv",
// //     mkv: "mkv",
// //     m4v: "m4v",
// //     // add more video file types and extensions here
// //   };

// //   const fileSignature = buffer.toString("hex", 0, 8).toLowerCase();
// //   console.log("fileSignatureBuffer", buffer);
// //   console.log("fileSignature", fileSignature);
// //   const extension = extensionMap[fileSignature] || "unknown";
// //   console.log("file type is", extension);
// //   return extension;
// // }

// // export default getFileTypeFromBuffer;
const supportedVideoFormats = [
  { name: "mp4", key: "66747970" },
  { name: "avi", key: "41564920" },
  { name: "wmv", key: "3026b275" },
  { name: "mov", key: "6d6f6f76" },
  { name: "mkv", key: "1a45dfa3" },
  { name: "flv", key: "464c5601" },
  { name: "webm", key: "1a45dfa3" },
];

function fileTipeHandler(buffer) {
  const hexSignature = buffer.toString("hex", 0, 8);
  const matchingFormat = supportedVideoFormats.find((format) =>
    hexSignature.includes(format.key)
  );
  if (matchingFormat && matchingFormat?.name) {
    console.log("is supported", matchingFormat?.name);
    return matchingFormat?.name;
  } else {
    console.log("not supported");
    return null;
  }
}

export default fileTipeHandler;
