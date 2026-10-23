import { useRef, useCallback, useEffect, useState } from "react"
import type { WindowState } from "../hooks/useWindowManager"

interface WindowProps {
  window: WindowState
  onClose: () => void
  onFocus: () => void
  onMinimize: () => void
  onToggleMaximize: () => void
  onUpdate: (updates: Partial<WindowState>) => void
  children: React.ReactNode
  icon: React.ReactNode
}

export default function Window({
  window: win,
  onClose,
  onFocus,
  onMinimize,
  onToggleMaximize,
  onUpdate,
  children,
  icon,
}: WindowProps) {
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null)
  const resizeRef = useRef<{ startX: number; startY: number; origW: number; origH: number; origX: number; origY: number; dir: string } | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDownTitle = useCallback(
    (e: React.MouseEvent) => {
      if (win.isMaximized) return
      e.preventDefault()
      onFocus()
      setIsDragging(true)
      dragRef.current = { startX: e.clientX, startY: e.clientY, origX: win.x, origY: win.y }
    },
    [win.x, win.y, win.isMaximized, onFocus]
  )

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, dir: string) => {
      if (win.isMaximized) return
      e.preventDefault()
      e.stopPropagation()
      onFocus()
      resizeRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        origW: win.width,
        origH: win.height,
        origX: win.x,
        origY: win.y,
        dir,
      }
    },
    [win.width, win.height, win.x, win.y, win.isMaximized, onFocus]
  )

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragRef.current) {
        const dx = e.clientX - dragRef.current.startX
        const dy = e.clientY - dragRef.current.startY
        onUpdate({
          x: Math.max(0, dragRef.current.origX + dx),
          y: Math.max(0, dragRef.current.origY + dy),
        })
      }
      if (resizeRef.current) {
        const r = resizeRef.current
        const dx = e.clientX - r.startX
        const dy = e.clientY - r.startY
        const updates: Partial<WindowState> = {}
        if (r.dir.includes("e")) updates.width = Math.max(win.minWidth, r.origW + dx)
        if (r.dir.includes("s")) updates.height = Math.max(win.minHeight, r.origH + dy)
        if (r.dir.includes("w")) {
          const newW = Math.max(win.minWidth, r.origW - dx)
          updates.width = newW
          updates.x = r.origX + (r.origW - newW)
        }
        if (r.dir.includes("n")) {
          const newH = Math.max(win.minHeight, r.origH - dy)
          updates.height = newH
          updates.y = r.origY + (r.origH - newH)
        }
        onUpdate(updates)
      }
    }
    const handleMouseUp = () => {
      dragRef.current = null
      resizeRef.current = null
      setIsDragging(false)
    }
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [onUpdate, win.minWidth, win.minHeight])

  if (win.isMinimized) return null

  return (
    <div
      className="absolute flex flex-col overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-black/50 backdrop-blur-xl"
      style={{
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
        background: "rgba(10, 10, 20, 0.85)",
      }}
      onMouseDown={onFocus}
    >
      {/* Title bar */}
      <div
        className={`flex h-10 shrink-0 cursor-grab items-center gap-3 border-b border-white/10 px-4 select-none ${isDragging ? "cursor-grabbing" : ""}`}
        onMouseDown={handleMouseDownTitle}
        onDoubleClick={onToggleMaximize}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onClose() }}
            className="h-3 w-3 rounded-full bg-red-500 transition hover:bg-red-400 hover:shadow-lg hover:shadow-red-500/50"
          />
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize() }}
            className="h-3 w-3 rounded-full bg-yellow-500 transition hover:bg-yellow-400 hover:shadow-lg hover:shadow-yellow-500/50"
          />
          <button
            onClick={(e) => { e.stopPropagation(); onToggleMaximize() }}
            className="h-3 w-3 rounded-full bg-green-500 transition hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/50"
          />
        </div>
        <div className="flex flex-1 items-center justify-center gap-2">
          <span className="text-sm">{icon}</span>
          <span className="text-xs font-medium text-white/60">{win.title}</span>
        </div>
        <div className="w-14" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">{children}</div>

      {/* Resize handles */}
      {!win.isMaximized && (
        <>
          <div className="absolute top-0 right-0 bottom-0 w-1 cursor-e-resize" onMouseDown={(e) => handleResizeStart(e, "e")} />
          <div className="absolute bottom-0 left-0 right-0 h-1 cursor-s-resize" onMouseDown={(e) => handleResizeStart(e, "s")} />
          <div className="absolute top-0 left-0 bottom-0 w-1 cursor-w-resize" onMouseDown={(e) => handleResizeStart(e, "w")} />
          <div className="absolute top-0 left-0 right-0 h-1 cursor-n-resize" onMouseDown={(e) => handleResizeStart(e, "n")} />
          <div className="absolute top-0 left-0 h-3 w-3 cursor-nw-resize" onMouseDown={(e) => handleResizeStart(e, "nw")} />
          <div className="absolute top-0 right-0 h-3 w-3 cursor-ne-resize" onMouseDown={(e) => handleResizeStart(e, "ne")} />
          <div className="absolute bottom-0 left-0 h-3 w-3 cursor-sw-resize" onMouseDown={(e) => handleResizeStart(e, "sw")} />
          <div className="absolute right-0 bottom-0 h-3 w-3 cursor-se-resize" onMouseDown={(e) => handleResizeStart(e, "se")} />
        </>
      )}
    </div>
  )
}
