import mongoose, { Document, Model, Schema, model } from "mongoose";

export interface IHolder extends Document {
  user: string;
  balance: string;
}

const HolderSchema: Schema = new Schema({
  user: {
    type: String,
    required: true,
    unique: true,
  },
  balance: {
    type: String,
    required: true,
  },
});

export const Holder = (mongoose.models.Holder || model("Holder", HolderSchema)) as Model<IHolder>;
