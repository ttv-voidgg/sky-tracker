"use client"

import { useRef, useEffect, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Stars } from "@react-three/drei"
import * as THREE from "three"

// Expanded flight path data with more routes
const flightPaths = [
  // Original paths
  {
    from: { lat: 40.7128, lng: -74.006 }, // New York
    to: { lat: 51.5074, lng: -0.1278 }, // London
    progress: 0.7,
  },
  {
    from: { lat: 35.6762, lng: 139.6503 }, // Tokyo
    to: { lat: 22.3193, lng: 114.1694 }, // Hong Kong
    progress: 0.3,
  },
  {
    from: { lat: 19.4326, lng: -99.1332 }, // Mexico City
    to: { lat: -34.6037, lng: -58.3816 }, // Buenos Aires
    progress: 0.5,
  },
  {
    from: { lat: 1.3521, lng: 103.8198 }, // Singapore
    to: { lat: -33.8688, lng: 151.2093 }, // Sydney
    progress: 0.2,
  },
  {
    from: { lat: 48.8566, lng: 2.3522 }, // Paris
    to: { lat: 25.2048, lng: 55.2708 }, // Dubai
    progress: 0.8,
  },
  // Additional paths
  {
    from: { lat: 37.7749, lng: -122.4194 }, // San Francisco
    to: { lat: 41.9028, lng: 12.4964 }, // Rome
    progress: 0.4,
  },
  {
    from: { lat: 55.7558, lng: 37.6173 }, // Moscow
    to: { lat: 31.2304, lng: 121.4737 }, // Shanghai
    progress: 0.6,
  },
  {
    from: { lat: -33.4489, lng: -70.6693 }, // Santiago
    to: { lat: -26.2041, lng: 28.0473 }, // Johannesburg
    progress: 0.3,
  },
  {
    from: { lat: 19.076, lng: 72.8777 }, // Mumbai
    to: { lat: 13.7563, lng: 100.5018 }, // Bangkok
    progress: 0.7,
  },
  {
    from: { lat: 52.52, lng: 13.405 }, // Berlin
    to: { lat: 41.0082, lng: 28.9784 }, // Istanbul
    progress: 0.5,
  },
  {
    from: { lat: -22.9068, lng: -43.1729 }, // Rio de Janeiro
    to: { lat: 40.4168, lng: -3.7038 }, // Madrid
    progress: 0.2,
  },
  {
    from: { lat: 59.3293, lng: 18.0686 }, // Stockholm
    to: { lat: 59.9139, lng: 10.7522 }, // Oslo
    progress: 0.9,
  },
]

// Convert lat/lng to 3D coordinates on a sphere
function latLngToVector3(lat: number, lng: number, radius = 1.5) {
  try {
    // Ensure lat and lng are valid numbers
    if (typeof lat !== "number" || typeof lng !== "number" || isNaN(lat) || isNaN(lng)) {
      console.error("Invalid lat/lng values:", lat, lng)
      return new THREE.Vector3(0, 0, 0)
    }

    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lng + 180) * (Math.PI / 180)

    const x = -radius * Math.sin(phi) * Math.cos(theta)
    const y = radius * Math.cos(phi)
    const z = radius * Math.sin(phi) * Math.sin(theta)

    return new THREE.Vector3(x, y, z)
  } catch (error) {
    console.error("Error in latLngToVector3:", error)
    return new THREE.Vector3(0, 0, 0)
  }
}

// Create a curved path between two points on the globe
function createCurvedPath(from: { lat: number; lng: number }, to: { lat: number; lng: number }, height = 0.2) {
  try {
    const fromVector = latLngToVector3(from.lat, from.lng)
    const toVector = latLngToVector3(to.lat, to.lng)

    // Calculate the midpoint and elevate it
    const midpoint = new THREE.Vector3().addVectors(fromVector, toVector).multiplyScalar(0.5)
    const distance = fromVector.distanceTo(toVector)
    midpoint.normalize().multiplyScalar(1.5 + height + distance * 0.2)

    // Create a quadratic curve
    const curve = new THREE.QuadraticBezierCurve3(fromVector, midpoint, toVector)
    return curve
  } catch (error) {
    console.error("Error in createCurvedPath:", error)
    // Return a default curve in case of error
    const defaultStart = new THREE.Vector3(0, 0, 0)
    const defaultEnd = new THREE.Vector3(0, 0, 1)
    const defaultMid = new THREE.Vector3(0, 0.5, 0.5)
    return new THREE.QuadraticBezierCurve3(defaultStart, defaultMid, defaultEnd)
  }
}

// Flight path component with white color
function FlightPath({ path }: { path: (typeof flightPaths)[0] }) {
  const curve = createCurvedPath(path.from, path.to)
  const points = curve.getPoints(50)
  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  // Create a plane that moves along the path
  const planeRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.LineDashedMaterial>(null)

  // Use white color for flight paths
  const flightPathColor = "#ffffff"

  useFrame(({ clock }) => {
    try {
      if (planeRef.current) {
        // Calculate position along the curve
        const time = clock.getElapsedTime() * 0.1 + path.progress
        const t = (Math.sin(time) + 1) / 2 // Oscillate between 0 and 1
        const position = curve.getPoint(t)

        // Use copy method to avoid direct assignment which can cause read-only errors
        try {
          planeRef.current.position.copy(position)
        } catch (e) {
          console.warn("Could not update plane position:", e)
        }

        // Calculate orientation
        const tangent = curve.getTangent(t)
        const lookAt = new THREE.Vector3().addVectors(position, tangent)
        try {
          planeRef.current.lookAt(lookAt)
        } catch (e) {
          console.warn("Could not update plane orientation:", e)
        }

        // Rotate to align with the path - use safe assignment
        try {
          planeRef.current.rotation.z = Math.PI / 2
        } catch (e) {
          console.warn("Could not update plane rotation:", e)
        }
      }

      // Animate the line
      if (materialRef.current) {
        try {
          materialRef.current.dashOffset = clock.getElapsedTime() * 0.5
        } catch (e) {
          console.warn("Could not update material dashOffset:", e)
        }
      }
    } catch (error) {
      console.error("Error in FlightPath animation:", error)
    }
  })

  return (
    <>
      {/* The path line */}
      <line geometry={geometry}>
        <lineDashedMaterial
          ref={materialRef}
          color={flightPathColor}
          dashSize={0.1}
          gapSize={0.05}
          opacity={0.9}
          transparent
          linewidth={2}
        />
      </line>

      {/* The airplane */}
      <mesh ref={planeRef} scale={0.03}>
        <coneGeometry args={[0.5, 1, 4]} />
        <meshBasicMaterial color={flightPathColor} />
      </mesh>
    </>
  )
}

// Custom grid lines for exactly 24 longitude and 24 latitude lines
function CustomGrid({ size = 1.5, color = "#a1ff0a" }) {
  try {
    const linesMaterial = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.6 })

    // Create latitude lines (horizontal circles) - exactly 24 lines
    const latitudeLines: JSX.Element[] = []
    for (let i = 0; i <= 24; i++) {
      const phi = (Math.PI * i) / 24
      const radius = size * Math.sin(phi)
      const y = size * Math.cos(phi)

      const points = []
      for (let j = 0; j <= 64; j++) {
        const theta = (2 * Math.PI * j) / 64
        const x = radius * Math.sin(theta)
        const z = radius * Math.cos(theta)
        points.push(new THREE.Vector3(x, y, z))
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      latitudeLines.push(<line key={`lat-${i}`} geometry={geometry} material={linesMaterial} />)
    }

    // Create longitude lines (vertical half-circles) - exactly 24 lines
    const longitudeLines: JSX.Element[] = []
    for (let i = 0; i < 24; i++) {
      const theta = (2 * Math.PI * i) / 24

      const points = []
      for (let j = 0; j <= 64; j++) {
        const phi = (Math.PI * j) / 64
        const x = size * Math.sin(phi) * Math.cos(theta)
        const y = size * Math.cos(phi)
        const z = size * Math.sin(phi) * Math.sin(theta)
        points.push(new THREE.Vector3(x, y, z))
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      longitudeLines.push(<line key={`lon-${i}`} geometry={geometry} material={linesMaterial} />)
    }

    return (
      <group>
        {latitudeLines}
        {longitudeLines}
      </group>
    )
  } catch (error) {
    console.error("Error rendering CustomGrid:", error)
    return null
  }
}

// Earth component with custom grid
function Earth() {
  try {
    const earthRef = useRef<THREE.Group>(null)
    const gridColor = "#a1ff0a" // Green color
    const [rotationY, setRotationY] = useState(0)

    // Animation and rotation
    useFrame(({ clock }) => {
      try {
        // Use elapsed time for continuous rotation
        const newRotationY = clock.getElapsedTime() * 0.05
        setRotationY(newRotationY)

        if (earthRef.current) {
          try {
            // Use set method instead of direct assignment to avoid read-only errors
            earthRef.current.rotation.set(earthRef.current.rotation.x, newRotationY, earthRef.current.rotation.z)
          } catch (e) {
            console.warn("Could not update earth rotation:", e)
          }
        }
      } catch (error) {
        console.error("Error in Earth animation:", error)
      }
    })

    return (
      <group ref={earthRef} rotation={[0, 0, (23.5 * Math.PI) / 180]}>
        {/* Ambient light for better visibility */}
        <ambientLight intensity={0.5} />

        {/* Directional light */}
        <directionalLight position={[5, 3, 5]} intensity={1.0} />

        {/* Custom grid for exactly 24 longitude and 24 latitude lines */}
        <CustomGrid size={1.5} color={gridColor} />

        {/* Render all flight paths */}
        {flightPaths.map((path, index) => (
          <FlightPath key={index} path={path} />
        ))}
      </group>
    )
  } catch (error) {
    console.error("Error rendering Earth:", error)
    return (
      <group rotation={[0, 0, (23.5 * Math.PI) / 180]}>
        <ambientLight intensity={0.5} />
        <mesh>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshBasicMaterial color="#a1ff0a" wireframe />
        </mesh>
      </group>
    )
  }
}

// Camera controller with adjusted position
function CameraController() {
  try {
    const { camera } = useThree()

    useEffect(() => {
      // Position the camera closer to the globe for a zoomed-in view
      camera.position.set(0, 0, 3.2) // Changed from 4.5 to 3.2 for closer zoom
      camera.lookAt(0, 0, 0)
    }, [camera])

    return null
  } catch (error) {
    console.error("Error in CameraController:", error)
    return null
  }
}

function Scene() {
  return (
    <>
      <Earth />
      <Stars radius={3} depth={50} count={500} factor={4} saturation={0} fade={true} />
    </>
  )
}

// Main Globe component
export default function GlobeAnimation() {
  const [isClient, setIsClient] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [renderError, setRenderError] = useState<boolean>(false)

  // Initialize refs outside of the useEffect to avoid conditional hook calls
  const planeRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.LineDashedMaterial>(null)

  useEffect(() => {
    setIsClient(true)

    // Check if WebGL is available
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")

      if (!gl) {
        setError("WebGL is not supported in your browser. The globe cannot be displayed.")
      }
    } catch (e) {
      setError("Error initializing WebGL: " + (e instanceof Error ? e.message : String(e)))
    }

    // Add global error handler for Three.js errors
    const handleError = (event: ErrorEvent) => {
      if (
        event.message.includes("Cannot assign to read only property") ||
        event.message.includes("Cannot convert undefined or null to object")
      ) {
        console.error("Caught Three.js error:", event.message)
        setRenderError(true)
        // Prevent the default error handling
        event.preventDefault()
      }
    }

    window.addEventListener("error", handleError)

    return () => {
      window.removeEventListener("error", handleError)
    }
  }, [])

  if (error) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-rich_black rounded-lg">
        <div className="text-center p-4">
          <p className="text-red-500 font-bold">Error</p>
          <p className="text-eggshell">{error}</p>
        </div>
      </div>
    )
  }

  if (renderError) {
    return (
      <div className="w-full h-[450px] rounded-lg overflow-hidden bg-rich_black flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-yellow-500 font-bold">Notice</p>
          <p className="text-eggshell">Globe visualization cannot be displayed.</p>
          <p className="text-silver_lake_blue mt-2 text-sm">
            The 3D globe encountered an error. Please try refreshing the page.
          </p>
        </div>
      </div>
    )
  }

  if (!isClient) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-rich_black rounded-lg">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-silver_lake_blue border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-eggshell">Loading globe visualization...</p>
        </div>
      </div>
    )
  }

  try {
    return (
      <div className="w-full h-[450px] rounded-lg overflow-hidden bg-rich_black">
        <Canvas
          onError={(e) => {
            console.error("Canvas error:", e)
            setRenderError(true)
          }}
        >
          <CameraController />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            rotateSpeed={0.5}
            zoomSpeed={0.5}
            minDistance={2.0} // Changed from 2.5 to 2.0 to allow closer zoom
            maxDistance={6.0} // Changed from 10 to 6.0 to keep the globe in view
            minPolarAngle={Math.PI * 0.1}
            maxPolarAngle={Math.PI * 0.9}
          />
          <Scene />
        </Canvas>
      </div>
    )
  } catch (error) {
    console.error("Error rendering GlobeAnimation:", error)
    return (
      <div className="w-full h-[450px] rounded-lg overflow-hidden bg-rich_black flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-yellow-500 font-bold">Notice</p>
          <p className="text-eggshell">Globe visualization cannot be displayed.</p>
          <p className="text-silver_lake_blue mt-2 text-sm">Please try refreshing the page.</p>
        </div>
      </div>
    )
  }
}
