import { createContext, useContext } from 'react'

const AwarenessContext = createContext(null)

export function AwarenessProvider({ awareness, children }) {
  return (
    <AwarenessContext.Provider value={awareness}>
      {children}
    </AwarenessContext.Provider>
  )
}

export function useAwareness() {
  return useContext(AwarenessContext)
}
