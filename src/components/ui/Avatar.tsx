"use client"

import { createContext, useContext, useLayoutEffect, useState } from "react"
import type { Dispatch, ReactNode, SetStateAction } from "react"
// utils
import { cn } from "@/utils/cn"

type ImageLoadingStatus = "idle" | "loaded" | "error"

type AvatarContextType = {
  loadingStatus: ImageLoadingStatus
  setLoadingStatus: Dispatch<SetStateAction<ImageLoadingStatus>>
  className?: string
}

const defaultContextValue: AvatarContextType = {
  loadingStatus: "idle",
  setLoadingStatus: () => {
    throw new Error("setLoadingStatus is not implemented")
  },
}

const AvatarContext = createContext<AvatarContextType>(defaultContextValue)

export function Avatar({
  className = "w-[40px] h-[40px]",
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const [loadingStatus, setLoadingStatus] = useState<ImageLoadingStatus>("idle")

  return (
    <AvatarContext.Provider
      value={{ loadingStatus, setLoadingStatus, className }}
    >
      {children}
    </AvatarContext.Provider>
  )
}

export function AvatarImage({ src, alt }: { src: string; alt: string }) {
  const context = useContext(AvatarContext)
  const { loadingStatus, setLoadingStatus, className } = context

  useLayoutEffect(() => {
    const image = new window.Image()
    image.onload = () => setLoadingStatus("loaded")
    image.onerror = () => setLoadingStatus("error")
    image.src = src
  }, [src, setLoadingStatus])

  if (loadingStatus !== "loaded") {
    return null
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={cn("overflow-hidden rounded-full object-cover", className)}
      src={src}
      alt={alt}
    />
  )
}

export function AvatarFallback({ children }: { children: ReactNode }) {
  const context = useContext(AvatarContext)
  const { loadingStatus, className } = context

  if (loadingStatus === "loaded") {
    return null
  }

  return (
    <div
      className={cn(
        "overflow-hidden flex items-center justify-center rounded-full object-cover bg-gray-200 uppercase",
        className
      )}
    >
      {children}
    </div>
  )
}
