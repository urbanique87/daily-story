"use client"

import { createContext, ReactNode, useContext, useState } from "react"

interface AuthContextType {
  user: { id: number; email: string } | null
  setUser: (user: { id: number; email: string } | null) => void
  accessToken: string | null
  setAccessToken: (token: string | null) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<{ id: number; email: string } | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        setAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
