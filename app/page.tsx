import Pagination from "@/components/Pagination";

export default function Home() {
  return (
    <div className="container mx-auto my-8 px-4">
      <h1 className="text-4xl font-bold text-gray-800 text-center">USDC Dashboard</h1>

      <div className="my-4 bg-yellow-200 p-4 text-sm text-yellow-900">
        <p>The data in this application is for demo purposes only.</p>
        <p>Please note that it is not accurate and is only taken from 1st March 2023.</p>
      </div>

      <Pagination />
    </div>
  );
}
