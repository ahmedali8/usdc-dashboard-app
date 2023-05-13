"use client";

import { DEFAULT_PAGE_NUMBER } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

import Button from "./Button";
import Table from "./Table";

export default function Pagination() {
  const [pageNumber, setPageNumber] = useState<number>(DEFAULT_PAGE_NUMBER);
  const [holdersCount, setHoldersCount] = useState<number>(0);

  const fetchHoldersCount = useCallback(async function () {
    const res: Response = await fetch("/api/holdersCount");
    const holdersCount: number = await res.json();

    setHoldersCount(holdersCount);
  }, []);

  useEffect(() => {
    fetchHoldersCount();
  }, [fetchHoldersCount]);

  return (
    <div className="flex flex-col mt-4">
      <Table pageNumber={pageNumber} />

      <div className="flex justify-between mt-4">
        <div>
          <Button
            disabled={pageNumber < 1}
            onClick={() => setPageNumber((prev) => prev - 1)}
            text={"Prev"}
          />

          <span className="ml-2" />

          <Button
            disabled={pageNumber >= holdersCount}
            onClick={() => setPageNumber((prev) => prev + 1)}
            text={"Next"}
          />
        </div>

        <div>
          <span className="text-gray-700">
            Page {pageNumber} of {holdersCount}
          </span>
        </div>
      </div>
    </div>
  );
}
