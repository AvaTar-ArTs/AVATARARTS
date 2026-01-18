import { useState, useEffect } from 'react'

interface SplashScreenProps {
  duration?: number
  onComplete: () => void
}

export default function SplashScreen({ duration = 3000, onComplete }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Start fade-out animation.
    const fadeTimer = setTimeout(() => {
      setFadeOut(true)
    }, duration - 500) // Start fade-out 500ms early.

    // Switch to the main view when complete.
    const completeTimer = setTimeout(() => {
      onComplete()
    }, duration)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(completeTimer)
    }
  }, [duration, onComplete])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center">
        {/* Logo image */}
        <div className={`transform transition-all duration-1000 ${fadeOut ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
          <img
            src="/logo.jpg"
            alt="Liangyan NoteBookLLM"
            className="w-auto max-w-[80vw] max-h-[60vh] rounded-2xl shadow-2xl animate-fade-in"
          />
        </div>

        {/* Loading indicator */}
        <div className={`mt-8 flex items-center gap-2 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-gray-500 text-sm ml-2">Loading...</span>
        </div>
      </div>
    </div>
  )
}
