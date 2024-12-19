import { forwardRef } from "react"
import type { ComponentPropsWithoutRef } from "react"
// components
import { Text } from "@/components/ui/typography/Text"

type InputProps = {
  label: string
  errorMessage?: string
} & ComponentPropsWithoutRef<"input"> &
  ComponentPropsWithoutRef<"label">

export const InputField = forwardRef<HTMLInputElement, InputProps>(
  function InputField(
    { type = "text", id, label, errorMessage, ...rest },
    ref
  ) {
    return (
      <>
        <Text
          as="label"
          htmlFor={id}
          className="block mb-1 text-gray-500 text-sm"
        >
          {label}
        </Text>

        <input
          ref={ref}
          id={id}
          type={type}
          {...rest}
          className="w-full h-12 p-2 border border-gray-300 rounded text-sm placeholder:text-gray-400 placeholder:text-sm"
        />

        {errorMessage && (
          <Text as="p" size="sm" className="mt-1 text-red-500">
            {errorMessage}
          </Text>
        )}
      </>
    )
  }
)
