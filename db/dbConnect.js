import mongoose from "mongoose";
import MongodbLink from "../MongodbLink.js";

const connnection = {};
const conectUrl = MongodbLink();

const dbConnect = async () => {
  if (connnection.isConnected) {
    return;
  }

  const db = await mongoose.connect(conectUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  //

  connnection.isConnected = db.connections[0].readyState;
};

export default dbConnect;
