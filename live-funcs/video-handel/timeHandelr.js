import { getVideoDurationInSeconds } from "get-video-duration";
import VideoTimeReader from "../../routes/video/post/timer.js";
import videoModel from "../../db/schema/videoModel.js";
import { v4 as uuidv4 } from "uuid";
import fileTipeHandler from "./fileTipeHandler.js";
import fs from "fs";
import path from "path";

const __dirname = path.resolve();

const timeHandler = async (Id, buffer) => {
  if (!Id) {
    return; // Exit early if no ID provided
  }

  const video = await videoModel.findOne({ _id: Id });
  if (!video) {
    return; // Exit early if video not found
  }

  const videoFileType = fileTipeHandler(buffer);
  if (!videoFileType) {
    console.log("Invalid file type");
    return;
  }

  const fileName = uuidv4() + "." + videoFileType;
  const filePath = path.join(__dirname, fileName);

  try {
    fs.writeFileSync(filePath, buffer); // Write buffer to file

    const duration = await getVideoDurationInSeconds(filePath);
    const timeVideo = VideoTimeReader(duration);

    const filter = { _id: video._id };
    const updateUser = { duration: timeVideo };

    await videoModel.updateOne(filter, updateUser);

    fs.unlinkSync(filePath); // Delete temporary file
  } catch (error) {
    console.error("Error processing video:", error);
  }
};

export default timeHandler;
