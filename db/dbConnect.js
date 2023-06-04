import mongoose from "mongoose";

const connnection = {};
const conectUrl =
  "mongodb+srv://kiciv2020:Fm7pZsWYdoKLAbuq@cluster0.9vxf7c9.mongodb.net/?retryWrites=true&w=majority";

const dbConnect = async () => {
  if (connnection.isConnected) {
    return;
  }

  const db = await mongoose.connect(process.env.MONGOCONNECTURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  //

  connnection.isConnected = db.connections[0].readyState;
};

export default dbConnect;
