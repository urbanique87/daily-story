import type { Metadata } from "next"
// providers
import { Providers } from "@/context/session.providers"
// styles
import "./globals.css"

export const metadata: Metadata = {
  title: "Daily Story",
  description:
    "A daily prompt platform that encourages self-expression through short writing. Reflect, create, and share your thoughts every day.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
