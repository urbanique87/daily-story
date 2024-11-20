import type { Metadata } from "next"
// providers
import { Providers } from "@/context/session.providers"
// components
import Header from "@/components/layout/Header"
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
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}
