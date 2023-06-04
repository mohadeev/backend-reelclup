import fs from "fs";
import path from "path";
import mime from "mime-types";
const __dirname = path.resolve();

function createFileFromBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const extension = mime.extension(mime.lookup(buffer));
    const fileName = `example-${Date.now()}.${extension}`;
    const filePath = path.join(__dirname, fileName);
    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log(filePath);
        resolve({ filePath, fileName });
      }
    });
  });
}
export default createFileFromBuffer;
