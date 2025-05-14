import { Plane } from "lucide-react"

export default function FlightHeader() {
  return (
    <div className="w-full h-[300px] rounded-lg overflow-hidden bg-rich_black flex flex-col items-center justify-center">
      <div className="p-6 rounded-full bg-prussian_blue mb-4">
        <Plane className="h-12 w-12 text-silver_lake_blue" />
      </div>
      <h2 className="text-2xl font-bold text-eggshell mb-2">SkyTracker</h2>
      <p className="text-silver_lake_blue text-center max-w-md">
        Enter a flight number above to track real-time status, departure and arrival information.
      </p>
    </div>
  )
}
