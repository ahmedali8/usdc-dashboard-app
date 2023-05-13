"use client";

import { getAddress } from "ethers/lib/utils";
import React, { useCallback, useEffect, useState } from "react";

import Loader from "./Loader";

interface Holder {
  _id: string;
  user: string;
  balance: string;
}

type TableProps = {
  pageNumber: number;
};

export default function Table({ pageNumber }: TableProps) {
  const [holders, setHolders] = useState<Holder[] | null>(null);

  const getChecksummedAddress = useCallback((addr: string) => getAddress(addr), []);

  const fetchHolders = useCallback(async () => {
    const res = await fetch(`/api/holders?pageNumber=${pageNumber}`);
    const holders: Holder[] = await res.json();

    setHolders(holders);
  }, [pageNumber]);

  useEffect(() => {
    fetchHolders();
  }, [fetchHolders]);

  if (!holders) {
    return <Loader />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">User Address</th>
            <th className="px-4 py-2 text-left">Balance</th>
          </tr>
        </thead>
        <tbody>
          {holders?.map((holder) => (
            <tr key={holder._id}>
              <td className="border px-4 py-2">{getChecksummedAddress(holder.user)}</td>
              <td className="border px-4 py-2">{Number(holder.balance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
