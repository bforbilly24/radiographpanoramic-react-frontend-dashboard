// src/features/radiographs/context/radiographs-context.tsx
import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Radiograph } from '../data/schema'

type RadiographsDialogType = 'create' | 'update' | 'delete' | 'import'

interface RadiographsContextType {
  open: RadiographsDialogType | null
  setOpen: (str: RadiographsDialogType | null) => void
  currentRow: Radiograph | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Radiograph | null>>
}

const RadiographsContext = React.createContext<RadiographsContextType | null>(
  null
)

interface Props {
  children: React.ReactNode
}

export default function RadiographsProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<RadiographsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Radiograph | null>(null)
  return (
    <RadiographsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </RadiographsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRadiographs = () => {
  const radiographsContext = React.useContext(RadiographsContext)

  if (!radiographsContext) {
    throw new Error('useRadiographs has to be used within <RadiographsContext>')
  }

  return radiographsContext
}
