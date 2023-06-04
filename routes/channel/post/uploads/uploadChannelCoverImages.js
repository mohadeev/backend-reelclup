import express from "express";

import { cloudinary } from "../../../../utils/Cloudinary/Cloudinary.js";
const uploadChannelCoverImages = async (imageStr) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(imageStr, {
      upload_preset: "covers_nimbatube",
    });
    return uploadResponse;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export default uploadChannelCoverImages;
