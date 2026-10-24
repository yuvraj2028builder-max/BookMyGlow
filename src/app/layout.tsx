import type { Metadata } from "next"
import { Inter, Playfair_Display, Geist } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
})

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "BookMyGlow — Your Glow, Booked",
  description: "The booking platform for makeup artists in Delhi NCR. Get your personal booking page, share it on Instagram, and start getting direct bookings from brides.",
  keywords: ["makeup artist", "booking", "Delhi", "bridal makeup", "NCR", "wedding"],
  openGraph: {
    title: "BookMyGlow — Your Glow, Booked",
    description: "The booking platform for makeup artists in Delhi NCR",
    type: "website",
  },
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("h-full", inter.variable, playfair.variable, "font-sans", geist.variable)}>
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  )
}
