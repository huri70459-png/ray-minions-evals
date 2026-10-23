import { useState, useCallback, useRef } from "react"

export interface WindowState {
  id: string
  appId: string
  title: string
  x: number
  y: number
  width: number
  height: number
  minWidth: number
  minHeight: number
  zIndex: number
  isMinimized: boolean
  isMaximized: boolean
  prevBounds?: { x: number; y: number; width: number; height: number }
}

let nextZ = 10

export function useWindowManager() {
  const [windows, setWindows] = useState<WindowState[]>([])
  const zCounter = useRef(nextZ)

  const openWindow = useCallback((appId: string, title: string, defaults?: Partial<WindowState>) => {
    setWindows((prev) => {
      const existing = prev.find((w) => w.appId === appId)
      if (existing) {
        if (existing.isMinimized) {
          return prev.map((w) =>
            w.appId === appId ? { ...w, isMinimized: false, zIndex: ++zCounter.current } : w
          )
        }
        return prev.map((w) =>
          w.appId === appId ? { ...w, zIndex: ++zCounter.current } : w
        )
      }
      const id = `${appId}-${Date.now()}`
      const newWin: WindowState = {
        id,
        appId,
        title,
        x: defaults?.x ?? 100 + prev.length * 30,
        y: defaults?.y ?? 80 + prev.length * 30,
        width: defaults?.width ?? 700,
        height: defaults?.height ?? 500,
        minWidth: defaults?.minWidth ?? 400,
        minHeight: defaults?.minHeight ?? 300,
        zIndex: ++zCounter.current,
        isMinimized: false,
        isMaximized: false,
      }
      return [...prev, newWin]
    })
  }, [])

  const closeWindow = useCallback((appId: string) => {
    setWindows((prev) => prev.filter((w) => w.appId !== appId))
  }, [])

  const focusWindow = useCallback((appId: string) => {
    zCounter.current++
    setWindows((prev) =>
      prev.map((w) =>
        w.appId === appId ? { ...w, zIndex: zCounter.current, isMinimized: false } : w
      )
    )
  }, [])

  const minimizeWindow = useCallback((appId: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.appId === appId ? { ...w, isMinimized: true } : w))
    )
  }, [])

  const toggleMaximize = useCallback((appId: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.appId !== appId) return w
        if (w.isMaximized) {
          return {
            ...w,
            isMaximized: false,
            ...(w.prevBounds || {}),
          }
        }
        return {
          ...w,
          isMaximized: true,
          prevBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight - 80,
        }
      })
    )
  }, [])

  const updateWindow = useCallback((appId: string, updates: Partial<WindowState>) => {
    setWindows((prev) =>
      prev.map((w) => (w.appId === appId ? { ...w, ...updates } : w))
    )
  }, [])

  return { windows, openWindow, closeWindow, focusWindow, minimizeWindow, toggleMaximize, updateWindow }
}
