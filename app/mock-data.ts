// Mock data for testing when the API is unavailable
export const mockFlightData = {
  pagination: {
    limit: 100,
    offset: 0,
    count: 1,
    total: 1,
  },
  data: [
    {
      flight_date: "2023-05-13",
      flight_status: "active",
      departure: {
        airport: "San Francisco International",
        timezone: "America/Los_Angeles",
        iata: "SFO",
        icao: "KSFO",
        terminal: "2",
        gate: "D11",
        delay: 13,
        scheduled: "2023-05-13T04:20:00+00:00",
        estimated: "2023-05-13T04:20:00+00:00",
        actual: "2023-05-13T04:20:13+00:00",
        estimated_runway: "2023-05-13T04:20:13+00:00",
        actual_runway: "2023-05-13T04:20:13+00:00",
      },
      arrival: {
        airport: "Dallas/Fort Worth International",
        timezone: "America/Chicago",
        iata: "DFW",
        icao: "KDFW",
        terminal: "A",
        gate: "A22",
        baggage: "A17",
        delay: 0,
        scheduled: "2023-05-13T10:20:00+00:00",
        estimated: "2023-05-13T10:20:00+00:00",
        actual: null,
        estimated_runway: null,
        actual_runway: null,
      },
      airline: {
        name: "American Airlines",
        iata: "AA",
        icao: "AAL",
      },
      flight: {
        number: "1004",
        iata: "AA1004",
        icao: "AAL1004",
        codeshared: null,
      },
      aircraft: {
        registration: "N160AN",
        iata: "A321",
        icao: "A321",
        icao24: "A0F1BB",
      },
      live: {
        updated: "2023-05-13T10:00:00+00:00",
        latitude: 36.2856,
        longitude: -106.807,
        altitude: 8846.82,
        direction: 114.34,
        speed_horizontal: 894.348,
        speed_vertical: 1.188,
        is_ground: false,
      },
    },
  ],
}

// Special mock data for UA102
const ua102MockData = {
  pagination: {
    limit: 100,
    offset: 0,
    count: 1,
    total: 1,
  },
  data: [
    {
      flight_date: "2023-05-13",
      flight_status: "active",
      departure: {
        airport: "Newark Liberty International",
        timezone: "America/New_York",
        iata: "EWR",
        icao: "KEWR",
        terminal: "C",
        gate: "C123",
        delay: 0,
        scheduled: "2023-05-13T08:30:00+00:00",
        estimated: "2023-05-13T08:30:00+00:00",
        actual: "2023-05-13T08:30:00+00:00",
        estimated_runway: "2023-05-13T08:45:00+00:00",
        actual_runway: "2023-05-13T08:45:00+00:00",
      },
      arrival: {
        airport: "Los Angeles International",
        timezone: "America/Los_Angeles",
        iata: "LAX",
        icao: "KLAX",
        terminal: "7",
        gate: "73",
        baggage: "7",
        delay: 0,
        scheduled: "2023-05-13T11:30:00+00:00",
        estimated: "2023-05-13T11:30:00+00:00",
        actual: null,
        estimated_runway: null,
        actual_runway: null,
      },
      airline: {
        name: "United Airlines",
        iata: "UA",
        icao: "UAL",
      },
      flight: {
        number: "102",
        iata: "UA102",
        icao: "UAL102",
        codeshared: null,
      },
      aircraft: {
        registration: "N14001",
        iata: "B789",
        icao: "B789",
        icao24: "A1B2C3",
      },
      live: {
        updated: "2023-05-13T10:00:00+00:00",
        latitude: 40.7128,
        longitude: -74.006,
        altitude: 35000,
        direction: 270,
        speed_horizontal: 550,
        speed_vertical: 0,
        is_ground: false,
      },
    },
  ],
}

export function getMockDataForFlight(flightIata: string) {
  console.log(`Generating mock data for flight: ${flightIata}`)

  // Special case for UA102
  if (flightIata === "UA102") {
    console.log("Using special mock data for UA102")

    // Clone the UA102 mock data to avoid modifying the original
    const mockData = JSON.parse(JSON.stringify(ua102MockData))

    // Add some randomness to coordinates to simulate movement
    if (mockData.data && mockData.data.length > 0 && mockData.data[0].live) {
      mockData.data[0].live.latitude += (Math.random() - 0.5) * 0.1
      mockData.data[0].live.longitude += (Math.random() - 0.5) * 0.1

      // Update the timestamp
      mockData.data[0].live.updated = new Date().toISOString()
    }

    return mockData
  }

  // For all other flights, use the standard mock data
  // Clone the base mock data
  const mockData = JSON.parse(JSON.stringify(mockFlightData))

  // Update the flight number
  if (mockData.data && mockData.data.length > 0) {
    mockData.data[0].flight.iata = flightIata
    mockData.data[0].flight.number = flightIata.replace(/[a-zA-Z]+/g, "")
    mockData.data[0].flight.icao = flightIata

    // Update airline info based on flight code
    const airlineCode = flightIata.replace(/[0-9]+/g, "")
    switch (airlineCode) {
      case "UA":
        mockData.data[0].airline.name = "United Airlines"
        mockData.data[0].airline.iata = "UA"
        mockData.data[0].airline.icao = "UAL"
        break
      case "DL":
        mockData.data[0].airline.name = "Delta Air Lines"
        mockData.data[0].airline.iata = "DL"
        mockData.data[0].airline.icao = "DAL"
        break
      case "LH":
        mockData.data[0].airline.name = "Lufthansa"
        mockData.data[0].airline.iata = "LH"
        mockData.data[0].airline.icao = "DLH"
        break
      case "BA":
        mockData.data[0].airline.name = "British Airways"
        mockData.data[0].airline.iata = "BA"
        mockData.data[0].airline.icao = "BAW"
        break
      // Default is American Airlines (already set in the mock data)
    }

    // Add some randomness to coordinates to simulate movement
    if (mockData.data[0].live) {
      mockData.data[0].live.latitude += (Math.random() - 0.5) * 0.1
      mockData.data[0].live.longitude += (Math.random() - 0.5) * 0.1

      // Update the timestamp
      mockData.data[0].live.updated = new Date().toISOString()
    }
  }

  return mockData
}
