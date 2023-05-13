"use client";

import { DEFAULT_PAGE_NUMBER } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

// import { getHolders } from "@/lib/mongo/holders";

// async function fetchHolders(pageNumber: number, nPerPage: number) {
//   const { holders } = await getHolders(pageNumber, nPerPage);
//   if (!holders) throw new Error("Failed to fetch holders");

//   return holders;
// }

export default function Home() {
  const [pageNumber, setPageNumber] = useState<number>(DEFAULT_PAGE_NUMBER);
  const [holdersCount, setHoldersCount] = useState<number>(0);

  const fetchHoldersCount = useCallback(async function () {
    const res: Response = await fetch("/api/holdersCount");
    const holdersCount: number = await res.json();

    setHoldersCount(holdersCount);
  }, []);

  useEffect(() => {
    fetchHoldersCount();
  }, []);

  return (
    <div>
      <div>{pageNumber}</div>
      <button
        onClick={() => setPageNumber((prev) => (prev < 1 ? 0 : prev - 1))}
      >
        prev
      </button>
      <button
        onClick={() =>
          setPageNumber((prev) => (prev > holdersCount ? prev : prev + 1))
        }
      >
        next
      </button>
    </div>
  );

  // const holders = await fetchHolders();
  // // console.log("holders: ", holders);

  // return (
  //   <div>
  //     <ul>
  //       {holders.map((holder) => (
  //         <li key={holder._id}>
  //           {holder.user}: {holder.balance}
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // );
}
