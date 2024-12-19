import { createElement, forwardRef } from "react"
import type {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardedRef,
  ReactElement,
  ReactNode,
} from "react"
// utils
import { cn } from "@/utils/cn"

type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl"

const sizeClasses: Record<TextSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-4xl",
}

type TextProps<T extends ElementType = "span"> = {
  as?: T
  className?: string
  size?: TextSize
  children?: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">

export const Text = forwardRef(function Text<
  T extends ElementType = "span",
  R extends HTMLElement = HTMLSpanElement
>(props: TextProps<T>, ref: ForwardedRef<R>) {
  const {
    as: Component = "span" as T,
    className,
    size = "md",
    children,
    ...rest
  } = props

  return createElement(
    Component,
    {
      ref,
      className: cn(sizeClasses[size], className),
      ...rest,
    },
    children
  )
}) as <T extends ElementType = "span", R extends HTMLElement = HTMLSpanElement>(
  props: TextProps<T> & { ref?: ForwardedRef<R> }
) => ReactElement | null
