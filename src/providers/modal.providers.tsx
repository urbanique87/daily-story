"use client"

import { useState, ReactNode } from "react"
// types
import { ModalContent } from "@/types/modal.types"
// context
import { ModalContext } from "@/context/modal-context"
// components
import { Modal } from "@/components/ui/modal/Modal"

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [modalContent, setModalContent] = useState<ModalContent | null>(null)

  const openModal = (content: ModalContent) => {
    setModalContent(content)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setModalContent(null)
  }

  return (
    <ModalContext.Provider
      value={{ isOpen, modalContent, openModal, closeModal }}
    >
      {children}

      {isOpen && modalContent && (
        <Modal
          type={modalContent.type}
          title={modalContent.title}
          message={modalContent.message}
          actionText={modalContent.actionText}
          onAction={modalContent.onAction}
          onClose={closeModal}
        />
      )}
    </ModalContext.Provider>
  )
}
