import CirclePackingChart from "@/components/chart";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full rounded">
        <h1 className="text-3xl font-bold text-center">2024 Reading Recap</h1>
        <h2 className="font-semibold text-center my-2">
          Made with ❤️ by Maitra Khatri
        </h2>
        <CirclePackingChart />
      </div>
    </div>
  );
}
