import { connectToDatabase } from "..";
import { DEFAULT_N_PER_PAGE, DEFAULT_PAGE_NUMBER } from "../../utils";
import { Holder } from "../Models";

connectToDatabase();

export async function getHolders(
  pageNumber: number = DEFAULT_PAGE_NUMBER,
  nPerPage: number = DEFAULT_N_PER_PAGE
) {
  try {
    const holders = await Holder.find({ balance: { $gt: 0 } })
      .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
      .limit(nPerPage);

    return { holders };
  } catch (error) {
    return { error: "Failed to fetch holders" };
  }
}

export async function getHoldersCount() {
  try {
    const holdersCount = await Holder.countDocuments({});

    return { holdersCount };
  } catch (error) {
    return { error: "Failed to fetch holders count" };
  }
}
