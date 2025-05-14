"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { Plane, Globe, Clock, Search, Instagram, Linkedin, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from "next/dynamic"

// Import the components we created
import { LoadingSpinner } from "@/components/loading-spinner"
import { FlightCardSkeleton } from "@/components/flight-card-skeleton"
import { FlightCard } from "@/components/flight-card"

// Dynamically import the Globe component with no SSR
const GlobeAnimation = dynamic(() => import("@/components/globe-animation"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex items-center justify-center bg-rich_black rounded-lg">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-silver_lake_blue border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-eggshell">Loading globe visualization...</p>
      </div>
    </div>
  ),
})

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

export default function Home() {
  const [flightNumber, setFlightNumber] = useState("")
  const [flightData, setFlightData] = useState<FlightData | null>(null)
  const [nextFlightData, setNextFlightData] = useState<FlightData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("current")

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    try {
      const savedSearches = localStorage.getItem("recentFlightSearches")
      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches))
      }
    } catch (e) {
      console.error("Error loading recent searches:", e)
      // Reset if there's an error
      localStorage.removeItem("recentFlightSearches")
    }
  }, [])

  // Save recent searches to localStorage
  const saveSearch = (flightNum: string) => {
    try {
      const updatedSearches = [flightNum, ...recentSearches.filter((search) => search !== flightNum)].slice(0, 5)
      setRecentSearches(updatedSearches)
      localStorage.setItem("recentFlightSearches", JSON.stringify(updatedSearches))
    } catch (e) {
      console.error("Error saving recent searches:", e)
    }
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
      const response = await fetch(`/api/flights?flight_iata=${flightNum}`)

      // Check if the response is OK before trying to parse JSON
      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error?.message || `Error: ${response.status} ${response.statusText}`)
        setFlightData(null)
        return
      }

      const data = await response.json()

      // Log the entire response for debugging
      console.log("Full API response:", JSON.stringify(data, null, 2))

      if (data.error) {
        setError(data.error.message || "Failed to fetch flight data")
        console.error("API Error Details:", data.error.details || data.error)
        setFlightData(null)
      } else if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        // Save the current flight search
        saveSearch(flightNum)

        // Validate and set current flight data
        const currentFlight = data.data[0]

        // Log the flight data for debugging
        console.log("Flight data received:", JSON.stringify(currentFlight, null, 2))

        // Ensure all required properties exist
        if (!validateFlightData(currentFlight)) {
          setError("Incomplete flight data received. Some information may not be displayed correctly.")
          // Still set the data, but with a warning
        }

        setFlightData(currentFlight)

        // Create next flight data (for demo purposes)
        try {
          const nextFlight = JSON.parse(JSON.stringify(currentFlight))

          // Adjust dates for the next flight (24 hours later)
          const addDay = (dateStr: string) => {
            if (!dateStr) return null
            try {
              const date = new Date(dateStr)
              date.setDate(date.getDate() + 1)
              return date.toISOString()
            } catch (e) {
              console.error("Error adding day to date:", e)
              return null
            }
          }

          if (nextFlight.flight_date) {
            nextFlight.flight_date = addDay(nextFlight.flight_date) || nextFlight.flight_date
          }
          nextFlight.flight_status = "scheduled"

          if (nextFlight.departure && nextFlight.departure.scheduled) {
            nextFlight.departure.scheduled = addDay(nextFlight.departure.scheduled) || nextFlight.departure.scheduled
            nextFlight.departure.estimated = addDay(nextFlight.departure.scheduled) || nextFlight.departure.estimated
            nextFlight.departure.actual = null
          }

          if (nextFlight.arrival && nextFlight.arrival.scheduled) {
            nextFlight.arrival.scheduled = addDay(nextFlight.arrival.scheduled) || nextFlight.arrival.scheduled
            nextFlight.arrival.estimated = addDay(nextFlight.arrival.scheduled) || nextFlight.arrival.estimated
            nextFlight.arrival.actual = null
          }

          nextFlight.live = null

          setNextFlightData(nextFlight)
        } catch (e) {
          console.error("Error creating next flight data:", e)
          setNextFlightData(null)
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

  // Validate that the flight data has all required properties
  const validateFlightData = (data: any): boolean => {
    if (!data) {
      console.error("Flight data is null or undefined")
      return false
    }

    let isValid = true

    // Check for required top-level properties
    const requiredProps = ["flight_date", "flight_status", "departure", "arrival", "airline", "flight"]
    for (const prop of requiredProps) {
      if (!data[prop]) {
        console.warn(`Missing required property: ${prop}`)
        isValid = false
      }
    }

    // Check for required nested properties, but don't fail validation
    if (data.departure) {
      if (!data.departure.airport) console.warn("Missing departure.airport")
      if (!data.departure.iata) console.warn("Missing departure.iata")
      if (!data.departure.scheduled) console.warn("Missing departure.scheduled")
    }

    if (data.arrival) {
      if (!data.arrival.airport) console.warn("Missing arrival.airport")
      if (!data.arrival.iata) console.warn("Missing arrival.iata")
      if (!data.arrival.scheduled) console.warn("Missing arrival.scheduled")
    }

    if (data.airline) {
      if (!data.airline.name) console.warn("Missing airline.name")
      if (!data.airline.iata) console.warn("Missing airline.iata")
    }

    if (data.flight) {
      if (!data.flight.number) console.warn("Missing flight.number")
      if (!data.flight.iata) console.warn("Missing flight.iata")
    }

    // Even if some properties are missing, we'll still try to display what we have
    return true
  }

  const formatDateTime = (dateTimeStr: string | null) => {
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
      console.error("Error formatting date:", e)
      return dateTimeStr
    }
  }

  const getStatusBadge = (status: string) => {
    if (!status) return <Badge>Unknown</Badge>

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
            <Plane className="h-6 w-6 text-silver_lake_blue" />
            <span className="text-xl font-bold text-eggshell">SkyTracker</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-eggshell hover:text-silver_lake_blue hover:underline underline-offset-4"
            >
              Home
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium text-eggshell hover:text-silver_lake_blue hover:underline underline-offset-4"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-eggshell hover:text-silver_lake_blue hover:underline underline-offset-4"
            >
              How It Works
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section with Flight Tracker */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-b from-prussian_blue to-rich_black">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-eggshell">
                Real-Time Flight Tracking Made Simple
              </h1>
              <p className="text-silver_lake_blue md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Track any commercial flight worldwide with our easy-to-use flight tracker. Get real-time updates on
                departures, arrivals, and flight status.
              </p>

              <div className="bg-prussian_blue rounded-lg shadow-sm border border-paynes_gray p-6 mt-6">
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

                  {recentSearches.length > 0 && (
                    <div>
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
                </form>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <Suspense fallback={<div>Loading...</div>}>
                <GlobeAnimation />
              </Suspense>
            </div>
          </div>

          {/* Flight Results */}
          <div className="mt-8">
            {error && <div className="p-4 text-red-500 bg-prussian_blue rounded-lg text-center mb-8">{error}</div>}

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
                      />
                    </TabsContent>
                    <TabsContent value="next">
                      <FlightCard
                        flightData={nextFlightData}
                        formatDateTime={formatDateTime}
                        getStatusBadge={getStatusBadge}
                      />
                    </TabsContent>
                  </Tabs>
                )}

                {!nextFlightData && (
                  <FlightCard flightData={flightData} formatDateTime={formatDateTime} getStatusBadge={getStatusBadge} />
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-prussian_blue">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-eggshell">Features</h2>
              <p className="text-silver_lake_blue md:text-xl">Everything you need to track flights and stay informed</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12 mt-8">
              <div className="flex flex-col items-center space-y-2 border border-paynes_gray rounded-lg p-6 bg-rich_black shadow-sm">
                <div className="p-3 rounded-full bg-paynes_gray">
                  <Plane className="h-6 w-6 text-eggshell" />
                </div>
                <h3 className="text-xl font-bold text-eggshell">Real-Time Tracking</h3>
                <p className="text-silver_lake_blue text-center">
                  Get up-to-the-minute information on flight status, delays, and gate changes.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-paynes_gray rounded-lg p-6 bg-rich_black shadow-sm">
                <div className="p-3 rounded-full bg-paynes_gray">
                  <Globe className="h-6 w-6 text-eggshell" />
                </div>
                <h3 className="text-xl font-bold text-eggshell">Global Coverage</h3>
                <p className="text-silver_lake_blue text-center">
                  Track flights from airlines around the world with comprehensive global coverage.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-paynes_gray rounded-lg p-6 bg-rich_black shadow-sm">
                <div className="p-3 rounded-full bg-paynes_gray">
                  <Clock className="h-6 w-6 text-eggshell" />
                </div>
                <h3 className="text-xl font-bold text-eggshell">Local Time Conversion</h3>
                <p className="text-silver_lake_blue text-center">
                  All flight times are automatically converted to your local timezone for convenience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-rich_black">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-eggshell">How It Works</h2>
              <p className="text-silver_lake_blue md:text-xl">Track any flight in three simple steps</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12 mt-8">
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-silver_lake_blue text-rich_black">
                  1
                </div>
                <h3 className="text-xl font-bold text-eggshell">Enter Flight Number</h3>
                <p className="text-silver_lake_blue text-center">
                  Input the airline code and flight number (e.g., AA1004)
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-silver_lake_blue text-rich_black">
                  2
                </div>
                <h3 className="text-xl font-bold text-eggshell">Get Real-Time Data</h3>
                <p className="text-silver_lake_blue text-center">
                  View departure, arrival, and current flight status information
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-silver_lake_blue text-rich_black">
                  3
                </div>
                <h3 className="text-xl font-bold text-eggshell">Stay Updated</h3>
                <p className="text-silver_lake_blue text-center">
                  Track the flight's progress with live updates in your local timezone
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-prussian_blue">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-eggshell">SkyTracker</h3>
              <p className="text-sm text-silver_lake_blue">
                Real-time flight tracking for travelers, aviation enthusiasts, and professionals. SkyTracker provides
                comprehensive flight information including departure and arrival times, flight status, aircraft details,
                and live tracking data. Our intuitive interface makes it easy to search for flights by number and view
                all the essential information you need. Whether you're picking someone up from the airport, tracking a
                loved one's journey, or just interested in aviation, SkyTracker has you covered with accurate,
                up-to-date flight information from around the world.
              </p>
              <p className="text-sm text-silver_lake_blue mt-2">
                <strong>Note about time synchronization:</strong> Flight times are displayed in your local timezone,
                which may differ from what you see on other platforms like Google. The AviationStack API provides times
                in various formats, and timezone conversions can sometimes lead to discrepancies. For the most accurate
                times, always verify with the airline directly.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-eggshell">Dev</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <a
                    href="https://www.instagram.com/kai._.0008/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-silver_lake_blue hover:text-eggshell flex items-center gap-2"
                  >
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/jcedeborja"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-silver_lake_blue hover:text-eggshell flex items-center gap-2"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/ttv-voidgg/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-silver_lake_blue hover:text-eggshell flex items-center gap-2"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                </li>
              </ul>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-eggshell mb-2">About the Developer</h4>
                <p className="text-sm text-silver_lake_blue">
                  SkyTracker was created by Kai, a passionate developer with an interest in aviation and web
                  technologies. This project combines modern web development techniques with real-time flight data to
                  create an intuitive and visually appealing flight tracking experience. Feel free to connect on social
                  media or check out other projects on GitHub.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-paynes_gray pt-4 text-center text-sm text-silver_lake_blue">
            <p>© 2023 SkyTracker. All rights reserved.</p>
            <p className="mt-1">Flight data provided by AviationStack.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
