import { connect, connection } from "mongoose";
import { handleEvents } from "../events";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

const uri: string = process.env.MONGODB_URI;

const options: any = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

export const connectToDatabase = async () => {
  if (!connection.readyState) {
    // console.log("Connecting to ", uri);
    const connectMongo = await connect(uri, options);

    // await handleEvents();

    return connectMongo;
  }
};
