import { connectToDatabase } from ".";
import { Holder } from "./Models";

connectToDatabase();

export async function getHolders() {
  try {
    const holders = await Holder.find();
    return { holders };
  } catch (error) {
    console.log(error);
  }
}
