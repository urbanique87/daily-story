export type ModalType = "success" | "error" | "info"

export interface ModalContent {
  type: ModalType
  title: string
  message: string
  actionText?: string
  onAction?: () => void
}

export interface ModalContextType {
  isOpen: boolean
  modalContent: ModalContent | null
  openModal: (content: ModalContent) => void
  closeModal: () => void
}

export interface ModalProps {
  type: "success" | "error" | "info"
  title: string
  message: string
  actionText?: string
  onAction?: () => void
  onClose: () => void
}
