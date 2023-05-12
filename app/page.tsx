import { getHolders } from "@/lib/mongoose/holders";

export default async function Home() {
  const res = await getHolders();
  // const res = await fetch("localhost:3000/api/holders");
  console.log("res: ", res);

  return <h1>hi</h1>;
}
