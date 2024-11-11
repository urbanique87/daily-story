"use client"

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

interface AuthContextType {
  accessToken: string | null
  setAccessToken: (token: string | null) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    if (!accessToken) {
      return
    }

    const originalFetch = window.fetch // 기존 fetch 저장

    window.fetch = (url, options = {}) => {
      const headers = {
        ...options.headers, // 기존 헤더 유지
        Authorization: `Bearer ${accessToken}`, // 액세스 토큰 추가
        "Content-Type": "application/json", // 필요에 따라 다른 헤더 추가
      }

      console.log(headers)

      return originalFetch(url, {
        ...options,
        headers,
      })
    }
  }, [accessToken])

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
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
