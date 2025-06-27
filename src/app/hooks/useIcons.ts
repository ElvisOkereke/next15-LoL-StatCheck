'use client'
import { useState, useEffect } from 'react'
import { initializeDataDragon, preloadEssentialIcons } from '../utils/iconUtils'

export const useIcons = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeIcons = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Initialize Data Dragon data
        await initializeDataDragon()
        
        // Preload essential icons
        await preloadEssentialIcons()
        
        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize icons:', error)
        setError(error instanceof Error ? error.message : 'Failed to load icons')
      } finally {
        setIsLoading(false)
      }
    }

    if (!isInitialized) {
      initializeIcons()
    }
  }, [isInitialized])

  return {
    isLoading,
    isInitialized,
    error
  }
}
