// types
import { ModalProps } from "@/types/modal.types"
// components
import { Text } from "@/components/ui/typography/Text"
import { Fragment } from "react"

export function Modal({
  type,
  title,
  message,
  actionText,
  onAction,
  onClose,
}: ModalProps) {
  const modalStyles = {
    success: "bg-green-50 border-green-500 text-green-900",
    error: "bg-red-50 border-red-500 text-red-900",
    info: "bg-blue-50 border-blue-500 text-blue-900",
  }

  const handleModalContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  const foo = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    onClose()
  }

  return (
    <div
      className="overflow-y-auto fixed inset-0 z-50 bg-black/50"
      // onClick={onClose}
      onClick={foo}
    >
      <div
        className="flex items-center justify-center min-h-full p-6"
        onClick={handleModalContentClick}
      >
        <div className="w-full max-w-md p-6 rounded-lg bg-white shadow-md">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              aria-hidden="true"
              className="w-6 h-6 stroke-green-600 fill-none"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              ></path>
            </svg>
          </div>
          <Text as="h2" className="mb-4">
            {title}
          </Text>
          <Text as="p">{convertNewLineToJSX(message)}</Text>
        </div>
      </div>

      <div
        className={`
          relative rounded-lg p-6 max-w-md w-full 
          border-2 ${modalStyles[type]}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>

        <div className="flex justify-end space-x-2">
          {onAction && actionText && (
            <button
              onClick={onAction}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {actionText}
            </button>
          )}

          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}

function convertNewLineToJSX(str: string) {
  return str.split("\n").map((line, index) => (
    <Fragment key={index}>
      {index > 0 ? <br /> : ""}
      {line}
    </Fragment>
  ))
}
