import { connectToDatabase } from ".";
import { LAST_BLOCK_ID } from "../utils";
import { LastBlock } from "./Models";

connectToDatabase();

export async function getLastBlock() {
  try {
    const lastBlock = await LastBlock.findById(LAST_BLOCK_ID);
    return { lastBlock };
  } catch (error) {
    return { error: "Failed to fetch last block" };
  }
}
