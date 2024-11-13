import { ReactNode } from "react"
import { cn } from "@/utils/cn"

type TextVariant = "body" | "label" | "caption"
type TextSize = "xs" | "sm" | "md" | "lg"

interface TextProps {
  variant?: TextVariant
  size?: TextSize
  children: ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
}

const variantClasses: Record<TextVariant, string> = {
  body: "text-gray-700 dark:text-gray-300",
  label: "text-gray-600 dark:text-gray-400 font-medium",
  caption: "text-gray-500 dark:text-gray-500",
}

const sizeClasses: Record<TextSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
}

export const Text = ({
  variant = "body",
  size = "md",
  children,
  className,
  as: Component = "p",
}: TextProps) => {
  return (
    <Component
      className={cn(variantClasses[variant], sizeClasses[size], className)}
    >
      {children}
    </Component>
  )
}
