import express from "express";

import { cloudinary } from "../../../../utils/Cloudinary/Cloudinary.js";
const uploadChannelImages = async (imageStr) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(imageStr, {
      resource_type: "video",

      upload_preset: "profiles_nimbatube",
    });
    return uploadResponse;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export default uploadChannelImages;
