import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "SkyTracker - Real-Time Flight Tracking",
  description:
    "Track commercial flights in real-time with SkyTracker. Developed by Kai (Instagram: @kai._.0008, LinkedIn: jcedeborja, GitHub: ttv-voidgg)",
  keywords: "flight tracker, aviation, real-time tracking, flights, travel, airplane tracking",
  authors: [{ name: "Kai", url: "https://github.com/ttv-voidgg/" }],
  creator: "Kai",
  publisher: "SkyTracker",
  openGraph: {
    title: "SkyTracker - Real-Time Flight Tracking",
    description: "Track commercial flights in real-time with SkyTracker. Developed by Kai",
    url: "https://skytracker.vercel.app",
    siteName: "SkyTracker",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkyTracker - Real-Time Flight Tracking",
    description: "Track commercial flights in real-time with SkyTracker. Developed by Kai",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
