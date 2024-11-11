import { ReactNode } from "react"
import { cn } from "@/lib/utils/cn"
import Link from "next/link"

type TextVariant = "body" | "label" | "caption"
type TextSize = "xs" | "sm" | "md" | "lg"
type ButtonStyle = "primary" | "secondary" | "outline"

interface TextLinkProps {
  variant?: TextVariant
  size?: TextSize
  children: ReactNode
  className?: string
  href: string
  buttonStyle?: ButtonStyle
}

const variantClasses: Record<TextVariant, string> = {
  body: "dark:text-blue-400 hover:underline",
  label: "text-gray-600 dark:text-gray-400 font-medium",
  caption: "text-gray-500 dark:text-gray-500",
}

const sizeClasses: Record<TextSize, string> = {
  xs: "text-xs",
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
}

const buttonClasses: Record<ButtonStyle, string> = {
  primary: "bg-gray-600 text-white hover:bg-gray-700",
  secondary: "bg-gray-600 text-white hover:bg-gray-700",
  outline: "border-2 border-gray-600 hover:bg-gray-600 hover:text-white",
}

export const TextLink = ({
  variant = "body",
  size = "md",
  children,
  className,
  href,
  buttonStyle,
}: TextLinkProps) => {
  const buttonClass = buttonStyle ? buttonClasses[buttonStyle] : ""

  return (
    <Link
      href={href}
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        buttonClass,
        "inline-block rounded-full transition-all", // 공통 스타일
        className
      )}
    >
      {children}
    </Link>
  )
}
