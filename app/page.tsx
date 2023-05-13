import { getHolders } from "@/lib/mongo/holders";

async function fetchHolders(pageNumber: number, nPerPage: number) {
  const { holders } = await getHolders(pageNumber, nPerPage);
  if (!holders) throw new Error("Failed to fetch holders");

  return holders;
}

export default async function Home() {
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

  return "hi";
}
