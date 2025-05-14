import { type NextRequest, NextResponse } from "next/server"
import { getMockDataForFlight } from "@/app/mock-data"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const flightIata = searchParams.get("flight_iata")
  const useMock = searchParams.get("mock") === "true"

  if (!flightIata) {
    return NextResponse.json({ error: { message: "Flight IATA code is required" } }, { status: 400 })
  }

  // Log the request
  console.log(`Flight search request for: ${flightIata}, useMock: ${useMock}`)

  // If mock data is requested, return it immediately
  if (useMock) {
    console.log(`Returning mock data for flight: ${flightIata}`)
    return NextResponse.json(getMockDataForFlight(flightIata))
  }

  const apiKey = process.env.AVIATIONSTACK_API_KEY

  if (!apiKey) {
    console.error("API key not configured")
    return NextResponse.json({ error: { message: "API key not configured" } }, { status: 500 })
  }

  try {
    // Try HTTPS first (required for paid plans)
    const apiUrl = `https://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_iata=${flightIata}`
    console.log("Fetching from API:", apiUrl.replace(apiKey, "API_KEY_HIDDEN"))

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
      },
    })

    // Check if the response is OK (status in the range 200-299)
    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Error Response:", errorText)

      // Special handling for the HTTPS error
      if (errorText.includes("only https is supported") || errorText.includes("Invalid request")) {
        console.error("HTTPS error detected. The free tier of AviationStack may not support HTTPS.")

        // Fall back to mock data
        console.log("Falling back to mock data for flight:", flightIata)
        return NextResponse.json(getMockDataForFlight(flightIata))
      }

      try {
        // Try to parse as JSON if possible
        const errorJson = JSON.parse(errorText)
        console.error("Parsed error JSON:", JSON.stringify(errorJson, null, 2))

        // Check for validation errors specifically
        if (errorJson.error?.code === "validation_error") {
          console.error("Validation error detected:", errorJson.error.context)

          // Special handling for flight_date validation errors
          if (errorJson.error.context?.flight_date) {
            console.error("Flight date validation error. Using mock data instead.")
            return NextResponse.json(getMockDataForFlight(flightIata))
          }
        }

        return NextResponse.json(
          {
            error: {
              message: errorJson.error?.info || errorJson.error?.message || "Failed to fetch flight data",
              details: errorJson,
            },
          },
          { status: response.status },
        )
      } catch (parseError) {
        // If not JSON, return the text
        console.error("Failed to parse error response as JSON:", parseError)
        return NextResponse.json(
          {
            error: {
              message: "Failed to fetch flight data",
              details: errorText,
            },
          },
          { status: response.status },
        )
      }
    }

    // Check content type to ensure we're getting JSON
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text()
      console.error("Unexpected content type:", contentType, "Response:", text)

      // Fall back to mock data due to non-JSON response
      console.log("Falling back to mock data due to non-JSON response")
      return NextResponse.json(getMockDataForFlight(flightIata))
    }

    const data = await response.json()

    // Log the raw API response structure
    console.log(
      `Raw API response structure for ${flightIata}:`,
      Object.keys(data),
      data.data ? `Data array length: ${data.data.length}` : "No data array",
    )

    // Log the full response structure for debugging
    console.log(`API Response for ${flightIata}:`, JSON.stringify(data, null, 2))

    // Check if we have flight data and log the structure
    if (data.data && data.data.length > 0) {
      console.log(
        `Flight data structure for ${flightIata}:`,
        Object.keys(data.data[0]),
        data.data[0].live ? "Has live data" : "No live data",
      )

      // Special handling for UA102 - log detailed structure of live data
      if (flightIata === "UA102" && data.data[0].live) {
        console.log("UA102 live data details:", JSON.stringify(data.data[0].live, null, 2))
      }

      // Validate flight_date format
      const flightDate = data.data[0].flight_date
      if (flightDate && !/^\d{4}-\d{2}-\d{2}$/.test(flightDate)) {
        console.error(`Invalid flight_date format for ${flightIata}: ${flightDate}`)
        console.log("Fixing flight_date format and continuing")

        // Fix the date format if possible
        try {
          const fixedDate = new Date(flightDate).toISOString().split("T")[0]
          data.data[0].flight_date = fixedDate
          console.log(`Fixed flight_date to: ${fixedDate}`)
        } catch (e) {
          console.error("Could not fix flight_date, using today's date")
          data.data[0].flight_date = new Date().toISOString().split("T")[0]
        }
      }

      // Validate live data if present
      if (data.data[0].live) {
        const live = data.data[0].live
        const requiredProps = ["latitude", "longitude", "altitude", "direction", "speed_horizontal"]

        let missingProps = false
        for (const prop of requiredProps) {
          if (live[prop] === undefined || live[prop] === null) {
            console.error(`Missing required live.${prop} for ${flightIata}`)
            missingProps = true
          } else if (typeof live[prop] !== "number" || isNaN(live[prop])) {
            console.error(`Invalid live.${prop} value for ${flightIata}: ${live[prop]}`)
            missingProps = true
          }
        }

        if (missingProps) {
          console.log("Fixing live data structure")
          // Provide default values for missing properties
          data.data[0].live = {
            updated: live.updated || new Date().toISOString(),
            latitude: typeof live.latitude === "number" && !isNaN(live.latitude) ? live.latitude : 0,
            longitude: typeof live.longitude === "number" && !isNaN(live.longitude) ? live.longitude : 0,
            altitude: typeof live.altitude === "number" && !isNaN(live.altitude) ? live.altitude : 10000,
            direction: typeof live.direction === "number" && !isNaN(live.direction) ? live.direction : 0,
            speed_horizontal:
              typeof live.speed_horizontal === "number" && !isNaN(live.speed_horizontal) ? live.speed_horizontal : 800,
            speed_vertical:
              typeof live.speed_vertical === "number" && !isNaN(live.speed_vertical) ? live.speed_vertical : 0,
            is_ground: !!live.is_ground,
          }
        }
      }
    } else {
      console.log(`No flight data found for ${flightIata}`)
    }

    // Check if the API returned an error object
    if (data.error) {
      console.error("AviationStack API Error:", data.error)

      // Special handling for subscription-related errors
      if (
        data.error.code === 104 ||
        (data.error.info && (data.error.info.includes("https") || data.error.info.includes("subscription")))
      ) {
        console.log("Subscription error detected. Falling back to mock data.")
        return NextResponse.json(getMockDataForFlight(flightIata))
      }

      return NextResponse.json(
        {
          error: {
            message: data.error.info || "API returned an error",
            details: data.error,
          },
        },
        { status: 500 },
      )
    }

    // Check if the expected data structure exists
    if (!data.data) {
      console.error("Unexpected API response structure:", data)
      return NextResponse.json(
        {
          error: {
            message: "API returned an unexpected response structure",
            details: "Missing data array in response",
          },
        },
        { status: 500 },
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching flight data:", error)

    // Fall back to mock data on any error
    console.log("Falling back to mock data due to error:", error instanceof Error ? error.message : String(error))
    return NextResponse.json(getMockDataForFlight(flightIata))
  }
}
