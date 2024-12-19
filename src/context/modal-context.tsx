"use client"

import { createContext, useContext } from "react"
// types
import { ModalContextType } from "@/types/modal.types"

export const ModalContext = createContext<ModalContextType>({
  isOpen: false,
  modalContent: null,
  openModal: () => {},
  closeModal: () => {},
})

export const useModal = () => useContext(ModalContext)
