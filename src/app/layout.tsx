import type { ReactNode } from "react"
import type { Metadata } from "next"
// providers
import { Providers } from "@/providers/session.providers"
import { ModalProvider } from "@/providers/modal.providers"
// components
// import Header from "@/components/layout/Header"
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
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ModalProvider>
            {/* <div className="flex flex-col min-h-screen">
            <Header /> */}
            {children}
            {/* </div> */}
          </ModalProvider>
        </Providers>
      </body>
    </html>
  )
}
