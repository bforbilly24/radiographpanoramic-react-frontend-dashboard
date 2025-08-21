// src/context/loading-hooks.tsx
import { createContext, useContext, Dispatch, SetStateAction } from 'react'

interface LoadingContextType {
  isFetching: boolean
  setIsFetching: Dispatch<SetStateAction<boolean>>
  progress: number
  setProgress: Dispatch<SetStateAction<number>>
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

export { LoadingContext }