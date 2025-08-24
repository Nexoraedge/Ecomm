import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "SEO Boost - AI-Powered eCommerce Optimization",
  description:
    "Generate perfect product titles, descriptions, and keywords for Amazon, Flipkart, Meesho & more with AI-powered SEO optimization.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${dmSans.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
