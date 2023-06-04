import express from "express";

import { cloudinary } from "../../../../utils/Cloudinary/Cloudinary.js";
const videoUploader = async (uploadPath) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload_large(uploadPath, {
      resource_type: "video",
      folder: "video",
    });
    return uploadResponse;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export default videoUploader;
