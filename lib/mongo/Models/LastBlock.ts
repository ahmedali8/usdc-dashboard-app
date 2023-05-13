import mongoose, { Document, Model, Schema, model } from "mongoose";

export interface ILastBlock extends Document {
  blockNumber: number;
}

const LastBlockSchema: Schema = new Schema({
  blockNumber: {
    type: Number,
  },
});

export const LastBlock = (mongoose.models.LastBlock ||
  model("LastBlock", LastBlockSchema)) as Model<ILastBlock>;
