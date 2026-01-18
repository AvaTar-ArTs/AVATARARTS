import { ReactNode, useState, useCallback, useEffect, useRef } from 'react'
import { cn } from '@/utils/cn'

interface ThreeColumnLayoutProps {
  leftPanel: ReactNode
  centerPanel: ReactNode
  rightPanel: ReactNode
  defaultLeftWidth?: number
  defaultRightWidth?: number
  minLeftWidth?: number
  maxLeftWidth?: number
  minRightWidth?: number
  maxRightWidth?: number
  minCenterWidth?: number
  className?: string
}

export default function ThreeColumnLayout({
  leftPanel,
  centerPanel,
  rightPanel,
  defaultLeftWidth = 280,
  defaultRightWidth = 320,
  minLeftWidth = 200,
  maxLeftWidth = 500,
  minRightWidth = 250,
  maxRightWidth = 500,
  minCenterWidth = 400,
  className,
}: ThreeColumnLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth)
  const [rightWidth, setRightWidth] = useState(defaultRightWidth)
  const [isDraggingLeft, setIsDraggingLeft] = useState(false)
  const [isDraggingRight, setIsDraggingRight] = useState(false)

  // Handle left divider drag.
  const handleLeftMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDraggingLeft(true)
  }, [])

  // Handle right divider drag.
  const handleRightMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDraggingRight(true)
  }, [])

  // Handle mouse movement.
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const containerWidth = containerRect.width

      if (isDraggingLeft) {
        const newLeftWidth = e.clientX - containerRect.left
        const maxAllowedLeft = containerWidth - rightWidth - minCenterWidth

        setLeftWidth(
          Math.min(Math.max(newLeftWidth, minLeftWidth), Math.min(maxLeftWidth, maxAllowedLeft))
        )
      }

      if (isDraggingRight) {
        const newRightWidth = containerRect.right - e.clientX
        const maxAllowedRight = containerWidth - leftWidth - minCenterWidth

        setRightWidth(
          Math.min(Math.max(newRightWidth, minRightWidth), Math.min(maxRightWidth, maxAllowedRight))
        )
      }
    }

    const handleMouseUp = () => {
      setIsDraggingLeft(false)
      setIsDraggingRight(false)
    }

    if (isDraggingLeft || isDraggingRight) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDraggingLeft, isDraggingRight, leftWidth, rightWidth, minLeftWidth, maxLeftWidth, minRightWidth, maxRightWidth, minCenterWidth])

  return (
    <div ref={containerRef} className={cn('flex h-full overflow-hidden', className)}>
      {/* Left panel - Sources */}
      <aside
        className="flex-shrink-0 border-r border-gray-200 bg-white overflow-hidden flex flex-col"
        style={{ width: leftWidth }}
      >
        {leftPanel}
      </aside>

      {/* Left divider (draggable) */}
      <div
        className={cn(
          'w-1 flex-shrink-0 cursor-col-resize hover:bg-primary-400 transition-colors relative group',
          isDraggingLeft ? 'bg-primary-500' : 'bg-transparent'
        )}
        onMouseDown={handleLeftMouseDown}
      >
        {/* Drag indicator */}
        <div className={cn(
          'absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 transition-colors',
          isDraggingLeft ? 'bg-primary-500' : 'group-hover:bg-primary-400'
        )} />
        {/* Expanded hit area */}
        <div className="absolute inset-y-0 -left-1 -right-1" />
      </div>

      {/* Center panel - Chat */}
      <main className="flex-1 overflow-hidden flex flex-col bg-surface-primary min-w-0">
        {centerPanel}
      </main>

      {/* Right divider (draggable) */}
      <div
        className={cn(
          'w-1 flex-shrink-0 cursor-col-resize hover:bg-primary-400 transition-colors relative group',
          isDraggingRight ? 'bg-primary-500' : 'bg-transparent'
        )}
        onMouseDown={handleRightMouseDown}
      >
        {/* Drag indicator */}
        <div className={cn(
          'absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 transition-colors',
          isDraggingRight ? 'bg-primary-500' : 'group-hover:bg-primary-400'
        )} />
        {/* Expanded hit area */}
        <div className="absolute inset-y-0 -left-1 -right-1" />
      </div>

      {/* Right panel - Studio */}
      <aside
        className="flex-shrink-0 border-l border-gray-200 bg-white overflow-hidden flex flex-col"
        style={{ width: rightWidth }}
      >
        {rightPanel}
      </aside>
    </div>
  )
}
