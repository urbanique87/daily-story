import { ReactNode } from "react"
import { cn } from "@/lib/utils/cn"

type ButtonVariant = "primary" | "secondary" | "outline"
type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-gray-600 text-white hover:bg-gray-700",
  secondary: "bg-gray-600 text-white hover:bg-gray-700",
  outline: "border-2 border-gray-600 hover:bg-gray-600 hover:text-white",
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
}

export const Button = ({
  children,
  className,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
}: ButtonProps) => {
  const buttonClass = variantClasses[variant]
  const sizeClass = sizeClasses[size]

  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full transition-all focus:outline-none",
        buttonClass,
        sizeClass,
        className,
        { "opacity-50 cursor-not-allowed": disabled }
      )}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  )
}
