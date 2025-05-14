"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Info, ArrowLeft, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

export default function TrackerPage() {
  const [flightNumber, setFlightNumber] = useState("")
  const [flightData, setFlightData] = useState<FlightData | null>(null)
  const [nextFlightData, setNextFlightData] = useState<FlightData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useMockData, setUseMockData] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("current")

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentFlightSearches")
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches))
    }
  }, [])

  // Save recent searches to localStorage
  const saveSearch = (flightNum: string) => {
    const updatedSearches = [flightNum, ...recentSearches.filter((search) => search !== flightNum)].slice(0, 5)
    setRecentSearches(updatedSearches)
    localStorage.setItem("recentFlightSearches", JSON.stringify(updatedSearches))
  }

  const searchFlight = async (e: React.FormEvent, flightNum = flightNumber) => {
    e.preventDefault()

    if (!flightNum.trim()) {
      setError("Please enter a flight number")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Add mock=true parameter if useMockData is true
      const mockParam = useMockData ? "&mock=true" : ""
      const response = await fetch(`/api/flights?flight_iata=${flightNum}${mockParam}`)

      // Check if the response is OK before trying to parse JSON
      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error?.message || `Error: ${response.status} ${response.statusText}`)
        setFlightData(null)
        return
      }

      const data = await response.json()

      if (data.error) {
        setError(data.error.message || "Failed to fetch flight data")
        console.error("API Error Details:", data.error.details || data.error)
        setFlightData(null)
      } else if (data.data && data.data.length > 0) {
        // Save the current flight search
        saveSearch(flightNum)

        // Set current flight data
        setFlightData(data.data[0])

        // Create next flight data (for demo purposes)
        if (useMockData) {
          const nextFlight = JSON.parse(JSON.stringify(data.data[0]))

          // Adjust dates for the next flight (24 hours later)
          const addDay = (dateStr: string) => {
            const date = new Date(dateStr)
            date.setDate(date.getDate() + 1)
            return date.toISOString()
          }

          nextFlight.flight_date = addDay(nextFlight.flight_date)
          nextFlight.flight_status = "scheduled"

          if (nextFlight.departure.scheduled) {
            nextFlight.departure.scheduled = addDay(nextFlight.departure.scheduled)
            nextFlight.departure.estimated = addDay(nextFlight.departure.scheduled)
            nextFlight.departure.actual = null
          }

          if (nextFlight.arrival.scheduled) {
            nextFlight.arrival.scheduled = addDay(nextFlight.arrival.scheduled)
            nextFlight.arrival.estimated = addDay(nextFlight.arrival.scheduled)
            nextFlight.arrival.actual = null
          }

          nextFlight.live = null

          setNextFlightData(nextFlight)
        }
      } else {
        setError("No flight found with that number")
        setFlightData(null)
      }
    } catch (err) {
      console.error("Search error:", err)
      setError(`An error occurred while fetching flight data: ${err instanceof Error ? err.message : String(err)}`)
      setFlightData(null)
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (dateTimeStr: string | null, timezone?: string) => {
    if (!dateTimeStr) return "Not available"

    try {
      const date = new Date(dateTimeStr)
      // Add 5 hours to correct the time discrepancy
      date.setHours(date.getHours() + 5)

      // Use the user's local timezone with the corrected time
      return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date)
    } catch (e) {
      return dateTimeStr
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "landed":
        return <Badge className="bg-blue-500">Landed</Badge>
      case "scheduled":
        return <Badge className="bg-yellow-500">Scheduled</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      case "diverted":
        return <Badge className="bg-purple-500">Diverted</Badge>
      case "delayed":
        return <Badge className="bg-orange-500">Delayed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-rich_black text-eggshell">
      {/* Navigation */}
      <header className="border-b border-prussian_blue">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Plane className="h-6 w-6 text-silver_lake_blue" />
              <span className="text-xl font-bold text-eggshell">SkyTracker</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-eggshell hover:text-silver_lake_blue hover:underline underline-offset-4"
            >
              Home
            </Link>
            <Link
              href="/tracker"
              className="text-sm font-medium text-eggshell hover:text-silver_lake_blue hover:underline underline-offset-4"
            >
              Flight Tracker
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-8 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-sm text-silver_lake_blue hover:text-eggshell">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold mt-2 text-eggshell">Flight Tracker</h1>
            <p className="text-silver_lake_blue mt-1">Track real-time status of commercial flights</p>
          </div>

          <Alert className="bg-prussian_blue mb-6 border-paynes_gray">
            <Info className="h-4 w-4 text-silver_lake_blue" />
            <AlertDescription className="text-eggshell">
              AviationStack's free tier has limitations. Toggle "Use Demo Data" for testing.
            </AlertDescription>
          </Alert>

          <div className="bg-prussian_blue rounded-lg shadow-sm border border-paynes_gray p-6 mb-8">
            <form onSubmit={(e) => searchFlight(e)} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="flightNumber" className="block text-sm font-medium text-eggshell mb-1">
                    Flight Number
                  </label>
                  <Input
                    id="flightNumber"
                    type="text"
                    placeholder="Enter flight number (e.g., AA1004)"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    className="w-full bg-paynes_gray text-eggshell border-silver_lake_blue"
                  />
                </div>
                <div className="md:self-end">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto bg-silver_lake_blue text-rich_black hover:bg-eggshell"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <LoadingSpinner />
                        Searching...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        Search
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="useMockData"
                  checked={useMockData}
                  onChange={(e) => setUseMockData(e.target.checked)}
                  className="rounded border-silver_lake_blue"
                />
                <label htmlFor="useMockData" className="text-sm text-silver_lake_blue">
                  Use Demo Data
                </label>
              </div>
            </form>

            {recentSearches.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-eggshell mb-2">Recent Searches:</h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        setFlightNumber(search)
                        searchFlight(e, search)
                      }}
                      className="border-silver_lake_blue text-eggshell hover:bg-paynes_gray"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 text-red-500 bg-prussian_blue rounded-lg text-center mb-8 border border-paynes_gray">
              {error}
            </div>
          )}

          {loading && <FlightCardSkeleton />}

          {flightData && !loading && (
            <div className="space-y-6">
              {nextFlightData && (
                <Tabs defaultValue="current" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 bg-prussian_blue">
                    <TabsTrigger value="current" className="text-eggshell data-[state=active]:bg-paynes_gray">
                      Current Flight
                    </TabsTrigger>
                    <TabsTrigger value="next" className="text-eggshell data-[state=active]:bg-paynes_gray">
                      Next Flight
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="current">
                    <FlightCard
                      flightData={flightData}
                      formatDateTime={formatDateTime}
                      getStatusBadge={getStatusBadge}
                      useMockData={useMockData}
                    />
                  </TabsContent>
                  <TabsContent value="next">
                    <FlightCard
                      flightData={nextFlightData}
                      formatDateTime={formatDateTime}
                      getStatusBadge={getStatusBadge}
                      useMockData={true}
                    />
                  </TabsContent>
                </Tabs>
              )}

              {!nextFlightData && (
                <FlightCard
                  flightData={flightData}
                  formatDateTime={formatDateTime}
                  getStatusBadge={getStatusBadge}
                  useMockData={useMockData}
                />
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 bg-prussian_blue">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-silver_lake_blue" />
              <span className="font-bold text-eggshell">SkyTracker</span>
            </div>
            <div className="text-sm text-silver_lake_blue">© 2023 SkyTracker. All rights reserved.</div>
            <div className="flex gap-4">
              <Link href="/" className="text-sm text-silver_lake_blue hover:text-eggshell">
                Home
              </Link>
              <Link href="/tracker" className="text-sm text-silver_lake_blue hover:text-eggshell">
                Flight Tracker
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

interface FlightCardProps {
  flightData: FlightData
  formatDateTime: (dateTimeStr: string | null, timezone?: string) => string
  getStatusBadge: (status: string) => JSX.Element
  useMockData: boolean
}

function FlightCard({ flightData, formatDateTime, getStatusBadge, useMockData }: FlightCardProps) {
  return (
    <Card className="w-full bg-prussian_blue border-paynes_gray text-eggshell">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl text-eggshell">
              {flightData.airline.name} {flightData.flight.iata}
            </CardTitle>
            <CardDescription className="text-silver_lake_blue">
              Flight #{flightData.flight.number} • {getStatusBadge(flightData.flight_status)}
            </CardDescription>
          </div>
          {flightData.airline.iata && (
            <div className="w-12 h-12 rounded bg-paynes_gray flex items-center justify-center text-xl font-bold text-eggshell">
              {flightData.airline.iata}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-medium text-silver_lake_blue">Departure</h3>
            <p className="text-lg font-medium text-eggshell">
              {flightData.departure.airport} ({flightData.departure.iata})
            </p>
            <div className="space-y-1">
              <div className="text-sm">
                <span className="text-silver_lake_blue">Scheduled: </span>
                <span className="text-eggshell">{formatDateTime(flightData.departure.scheduled)}</span>
                <span className="text-xs text-silver_lake_blue ml-1">(Local Time)</span>
              </div>
              <div className="text-sm">
                <span className="text-silver_lake_blue">Actual: </span>
                <span className="text-eggshell">{formatDateTime(flightData.departure.actual)}</span>
                {flightData.departure.actual && (
                  <span className="text-xs text-silver_lake_blue ml-1">(Local Time)</span>
                )}
              </div>
              {flightData.departure.terminal && (
                <div className="text-sm">
                  <span className="text-silver_lake_blue">Terminal: </span>
                  <span className="text-eggshell">{flightData.departure.terminal}</span>
                </div>
              )}
              {flightData.departure.gate && (
                <div className="text-sm">
                  <span className="text-silver_lake_blue">Gate: </span>
                  <span className="text-eggshell">{flightData.departure.gate}</span>
                </div>
              )}
              {flightData.departure.delay && (
                <div className="text-sm text-orange-500">
                  <span className="font-medium">Delay: </span>
                  {flightData.departure.delay} minutes
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-silver_lake_blue">Arrival</h3>
            <p className="text-lg font-medium text-eggshell">
              {flightData.arrival.airport} ({flightData.arrival.iata})
            </p>
            <div className="space-y-1">
              <div className="text-sm">
                <span className="text-silver_lake_blue">Scheduled: </span>
                <span className="text-eggshell">{formatDateTime(flightData.arrival.scheduled)}</span>
                <span className="text-xs text-silver_lake_blue ml-1">(Local Time)</span>
              </div>
              <div className="text-sm">
                <span className="text-silver_lake_blue">Estimated: </span>
                <span className="text-eggshell">{formatDateTime(flightData.arrival.estimated)}</span>
                {flightData.arrival.estimated && (
                  <span className="text-xs text-silver_lake_blue ml-1">(Local Time)</span>
                )}
              </div>
              {flightData.arrival.terminal && (
                <div className="text-sm">
                  <span className="text-silver_lake_blue">Terminal: </span>
                  <span className="text-eggshell">{flightData.arrival.terminal}</span>
                </div>
              )}
              {flightData.arrival.gate && (
                <div className="text-sm">
                  <span className="text-silver_lake_blue">Gate: </span>
                  <span className="text-eggshell">{flightData.arrival.gate}</span>
                </div>
              )}
              {flightData.arrival.baggage && (
                <div className="text-sm">
                  <span className="text-silver_lake_blue">Baggage: </span>
                  <span className="text-eggshell">{flightData.arrival.baggage}</span>
                </div>
              )}
              {flightData.arrival.delay && (
                <div className="text-sm text-orange-500">
                  <span className="font-medium">Delay: </span>
                  {flightData.arrival.delay} minutes
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator className="bg-paynes_gray" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {flightData.aircraft && (
            <div className="space-y-1">
              <h3 className="font-medium text-silver_lake_blue">Aircraft</h3>
              <p className="text-eggshell">Type: {flightData.aircraft.iata || "Not available"}</p>
              <p className="text-eggshell">Registration: {flightData.aircraft.registration || "Not available"}</p>
            </div>
          )}

          {flightData.live && (
            <div className="space-y-1">
              <h3 className="font-medium text-silver_lake_blue">Live Data</h3>
              <p className="text-eggshell">Altitude: {Math.round(flightData.live.altitude)} ft</p>
              <p className="text-eggshell">Speed: {Math.round(flightData.live.speed_horizontal)} km/h</p>
              <p className="text-eggshell">Direction: {Math.round(flightData.live.direction)}°</p>
              <p className="text-eggshell">Last updated: {formatDateTime(flightData.live.updated)}</p>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-silver_lake_blue">
          <p>Flight date: {new Date(flightData.flight_date).toLocaleDateString()}</p>
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

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4 text-rich_black"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )
}

function FlightCardSkeleton() {
  return (
    <Card className="w-full bg-prussian_blue border-paynes_gray">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <Skeleton className="h-8 w-48 bg-paynes_gray" />
            <Skeleton className="h-4 w-32 mt-2 bg-paynes_gray" />
          </div>
          <Skeleton className="h-12 w-12 rounded bg-paynes_gray" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-paynes_gray" />
            <Skeleton className="h-6 w-40 bg-paynes_gray" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-full bg-paynes_gray" />
              <Skeleton className="h-4 w-full bg-paynes_gray" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-paynes_gray" />
            <Skeleton className="h-6 w-40 bg-paynes_gray" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-full bg-paynes_gray" />
              <Skeleton className="h-4 w-full bg-paynes_gray" />
            </div>
          </div>
        </div>
        <Skeleton className="h-px w-full bg-paynes_gray" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <Skeleton className="h-4 w-24 bg-paynes_gray" />
            <Skeleton className="h-4 w-full bg-paynes_gray" />
            <Skeleton className="h-4 w-full bg-paynes_gray" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-24 bg-paynes_gray" />
            <Skeleton className="h-4 w-full bg-paynes_gray" />
            <Skeleton className="h-4 w-full bg-paynes_gray" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
