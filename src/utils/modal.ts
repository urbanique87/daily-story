// context
import { useModal } from "@/context/modal-context"
// types
import type { ModalContent } from "@/types/modal.types"

export const useCreateModal = () => {
  const { openModal, closeModal } = useModal()

  return {
    open: (content: ModalContent) => openModal(content),
    close: () => closeModal(),
  }
}
