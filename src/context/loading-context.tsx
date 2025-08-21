// src/context/loading-context.tsx
import { createContext, Dispatch, SetStateAction, useState } from 'react'

interface LoadingContextType {
  isFetching: boolean
  setIsFetching: Dispatch<SetStateAction<boolean>>
  progress: number
  setProgress: Dispatch<SetStateAction<number>>
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isFetching, setIsFetching] = useState(false)
  const [progress, setProgress] = useState(15)

  return (
    <LoadingContext.Provider
      value={{ isFetching, setIsFetching, progress, setProgress }}
    >
      {children}
    </LoadingContext.Provider>
  )
}
