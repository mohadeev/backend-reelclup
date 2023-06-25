import dotenv from "dotenv";
import cloudinaryMain from "cloudinary";

dotenv.config();

// cloudinaryMain.config({
//   cloud_name: "mohadeev",
//   api_key: "823672526525528",
//   api_secret: "FpKV7PxTxEMmBdq0Ig-P_gjw__s",
//   cloudinary_url:
//     "cloudinary://823672526525528:FpKV7PxTxEMmBdq0Ig-P_gjw__s@mohadeev",
// });
cloudinaryMain.config({
  cloud_name: "dokwgobf3",
  api_key: "355186445747421",
  api_secret: "JV2l7BTqZtRYs60kp9u8pKv0A2E",
  cloudinary_url:
    "cloudinary://355186445747421:JV2l7BTqZtRYs60kp9u8pKv0A2E@dokwgobf3",
});

export default cloudinaryMain;
