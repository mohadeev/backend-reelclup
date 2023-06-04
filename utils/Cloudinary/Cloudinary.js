import dotenv from "dotenv";
import cloudinary from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: "nimbatube",
  api_key: "823672526525528",
  api_secret: "FpKV7PxTxEMmBdq0Ig-P_gjw__s",
  cloudinary_url:
    "cloudinary://823672526525528:FpKV7PxTxEMmBdq0Ig-P_gjw__s@nimbatube",
});

export { cloudinary };

