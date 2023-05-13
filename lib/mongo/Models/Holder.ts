import mongoose, { Document, Model, Schema, model } from "mongoose";

export interface IHolder extends Document {
  user: string;
  balance: string;
}

const HolderSchema: Schema = new Schema({
  user: {
    type: String,
  },
  balance: {
    type: String,
  },
});

export const Holder = (mongoose.models.Holder || model("Holder", HolderSchema)) as Model<IHolder>;
