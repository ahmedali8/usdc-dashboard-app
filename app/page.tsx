import Pagination from "@/components/Pagination";

export default function Home() {
  return (
    <div className="container mx-auto pt-4 px-4">
      <h1 className="text-4xl font-bold text-gray-800 text-center">USDC Dashboard</h1>

      <Pagination />
    </div>
  );
}
