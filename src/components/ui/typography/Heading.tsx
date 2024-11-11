import { ReactNode } from "react"
import { cn } from "@/lib/utils/cn"

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
type HeadingSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

interface HeadingProps {
  level?: HeadingLevel
  size?: HeadingSize
  children: ReactNode
  className?: string
}

const sizeClasses: Record<HeadingSize, string> = {
  xs: "text-lg font-semibold",
  sm: "text-xl font-semibold",
  md: "text-2xl font-semibold",
  lg: "text-3xl font-bold",
  xl: "text-4xl font-bold",
  "2xl": "text-5xl font-bold",
}

export const Heading = ({
  level = "h2",
  size = "md",
  children,
  className,
}: HeadingProps) => {
  const Component = level
  const defaultClasses = sizeClasses[size]

  return (
    <Component
      className={cn(
        defaultClasses,
        "text-gray-900 dark:text-gray-100",
        className
      )}
    >
      {children}
    </Component>
  )
}
