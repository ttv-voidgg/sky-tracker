import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface FlightData {
  flight_date: string
  flight_status: string
  departure: {
    airport: string
    timezone: string
    iata: string
    icao: string
    terminal?: string
    gate?: string
    delay?: number
    scheduled: string
    estimated: string
    actual: string | null
    estimated_runway?: string | null
    actual_runway?: string | null
  }
  arrival: {
    airport: string
    timezone: string
    iata: string
    icao: string
    terminal?: string
    gate?: string
    baggage?: string
    delay?: number
    scheduled: string
    estimated: string
    actual: string | null
    estimated_runway?: string | null
    actual_runway?: string | null
  }
  airline: {
    name: string
    iata: string
    icao: string
  }
  flight: {
    number: string
    iata: string
    icao: string
    codeshared: any | null
  }
  aircraft: {
    registration: string
    iata: string
    icao: string
    icao24: string
  } | null
  live: {
    updated: string
    latitude: number
    longitude: number
    altitude: number
    direction: number
    speed_horizontal: number
    speed_vertical: number
    is_ground: boolean
  } | null
}

interface FlightCardProps {
  flightData: FlightData
  formatDateTime: (dateTimeStr: string | null, timezone?: string) => string
  getStatusBadge: (status: string) => JSX.Element
  useMockData?: boolean
}

export function FlightCard({ flightData, formatDateTime, getStatusBadge, useMockData = false }: FlightCardProps) {
  // Safely access nested properties with improved error handling
  const safeGet = (obj: any, path: string, defaultValue: any = "Not available") => {
    try {
      // If the object itself is null or undefined, return the default value
      if (obj === undefined || obj === null) {
        return defaultValue
      }

      const keys = path.split(".")
      let result = obj

      for (const key of keys) {
        if (result === undefined || result === null) {
          console.warn(`Path ${path} resolved to undefined at key ${key}`)
          return defaultValue
        }
        result = result[key]
      }

      // Handle different types of empty values
      if (result === undefined || result === null) {
        return defaultValue
      }

      // For boolean values, we want to return the actual boolean
      if (typeof result === "boolean") {
        return result
      }

      // For numbers, including 0, we want to return the actual number
      if (typeof result === "number") {
        return result
      }

      // For empty strings, return the default value
      if (result === "") {
        return defaultValue
      }

      return result
    } catch (e) {
      console.error(`Error accessing path ${path}:`, e)
      return defaultValue
    }
  }

  return (
    <Card className="w-full bg-prussian_blue border-paynes_gray text-eggshell">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl text-eggshell">
              {safeGet(flightData, "airline.name")} {safeGet(flightData, "flight.iata")}
            </CardTitle>
            <CardDescription className="text-silver_lake_blue">
              Flight #{safeGet(flightData, "flight.number")} •{" "}
              {getStatusBadge(safeGet(flightData, "flight_status", ""))}
            </CardDescription>
          </div>
          {safeGet(flightData, "airline.iata", false) && (
            <div className="w-12 h-12 rounded bg-paynes_gray flex items-center justify-center text-xl font-bold text-eggshell">
              {safeGet(flightData, "airline.iata")}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-medium text-silver_lake_blue">Departure</h3>
            <p className="text-lg font-medium text-eggshell">
              {safeGet(flightData, "departure.airport")} ({safeGet(flightData, "departure.iata")})
            </p>
            <div className="space-y-1">
              <div className="text-sm">
                <span className="text-silver_lake_blue">Scheduled: </span>
                <span className="text-eggshell">
                  {formatDateTime(safeGet(flightData, "departure.scheduled", null))}
                </span>
                <span className="text-xs text-silver_lake_blue ml-1">(Local Time)</span>
              </div>
              <div className="text-sm">
                <span className="text-silver_lake_blue">Actual: </span>
                <span className="text-eggshell">{formatDateTime(safeGet(flightData, "departure.actual", null))}</span>
                {safeGet(flightData, "departure.actual", null) && (
                  <span className="text-xs text-silver_lake_blue ml-1">(Local Time)</span>
                )}
              </div>
              {safeGet(flightData, "departure.terminal", false) && (
                <div className="text-sm">
                  <span className="text-silver_lake_blue">Terminal: </span>
                  <span className="text-eggshell">{safeGet(flightData, "departure.terminal")}</span>
                </div>
              )}
              {safeGet(flightData, "departure.gate", false) && (
                <div className="text-sm">
                  <span className="text-silver_lake_blue">Gate: </span>
                  <span className="text-eggshell">{safeGet(flightData, "departure.gate")}</span>
                </div>
              )}
              {safeGet(flightData, "departure.delay", false) && (
                <div className="text-sm text-orange-500">
                  <span className="font-medium">Delay: </span>
                  {safeGet(flightData, "departure.delay")} minutes
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-silver_lake_blue">Arrival</h3>
            <p className="text-lg font-medium text-eggshell">
              {safeGet(flightData, "arrival.airport")} ({safeGet(flightData, "arrival.iata")})
            </p>
            <div className="space-y-1">
              <div className="text-sm">
                <span className="text-silver_lake_blue">Scheduled: </span>
                <span className="text-eggshell">{formatDateTime(safeGet(flightData, "arrival.scheduled", null))}</span>
                <span className="text-xs text-silver_lake_blue ml-1">(Local Time)</span>
              </div>
              <div className="text-sm">
                <span className="text-silver_lake_blue">Estimated: </span>
                <span className="text-eggshell">{formatDateTime(safeGet(flightData, "arrival.estimated", null))}</span>
                {safeGet(flightData, "arrival.estimated", null) && (
                  <span className="text-xs text-silver_lake_blue ml-1">(Local Time)</span>
                )}
              </div>
              {safeGet(flightData, "arrival.terminal", false) && (
                <div className="text-sm">
                  <span className="text-silver_lake_blue">Terminal: </span>
                  <span className="text-eggshell">{safeGet(flightData, "arrival.terminal")}</span>
                </div>
              )}
              {safeGet(flightData, "arrival.gate", false) && (
                <div className="text-sm">
                  <span className="text-silver_lake_blue">Gate: </span>
                  <span className="text-eggshell">{safeGet(flightData, "arrival.gate")}</span>
                </div>
              )}
              {safeGet(flightData, "arrival.baggage", false) && (
                <div className="text-sm">
                  <span className="text-silver_lake_blue">Baggage: </span>
                  <span className="text-eggshell">{safeGet(flightData, "arrival.baggage")}</span>
                </div>
              )}
              {safeGet(flightData, "arrival.delay", false) && (
                <div className="text-sm text-orange-500">
                  <span className="font-medium">Delay: </span>
                  {safeGet(flightData, "arrival.delay")} minutes
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator className="bg-paynes_gray" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {safeGet(flightData, "aircraft", false) && (
            <div className="space-y-1">
              <h3 className="font-medium text-silver_lake_blue">Aircraft</h3>
              <p className="text-eggshell">Type: {safeGet(flightData, "aircraft.iata", "Not available")}</p>
              <p className="text-eggshell">
                Registration: {safeGet(flightData, "aircraft.registration", "Not available")}
              </p>
            </div>
          )}

          {safeGet(flightData, "live", false) && (
            <div className="space-y-1">
              <h3 className="font-medium text-silver_lake_blue">Live Data</h3>
              <p className="text-eggshell">Altitude: {Math.round(safeGet(flightData, "live.altitude", 0))} ft</p>
              <p className="text-eggshell">Speed: {Math.round(safeGet(flightData, "live.speed_horizontal", 0))} km/h</p>
              <p className="text-eggshell">Direction: {Math.round(safeGet(flightData, "live.direction", 0))}°</p>
              <p className="text-eggshell">Last updated: {formatDateTime(safeGet(flightData, "live.updated", null))}</p>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-silver_lake_blue">
          <p>
            Flight date:{" "}
            {new Date(safeGet(flightData, "flight_date", new Date().toISOString().split("T")[0])).toLocaleDateString()}
          </p>
          <p className="mt-2 italic">
            Note: Times are displayed in your local timezone and may differ from airline or other tracking sites.
          </p>
        </div>
      </CardContent>
      {useMockData && (
        <CardFooter className="bg-paynes_gray text-eggshell text-xs italic">
          <p>Note: This is demo data and does not represent actual flight information.</p>
        </CardFooter>
      )}
    </Card>
  )
}
