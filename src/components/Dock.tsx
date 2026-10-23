import { useRef, useState } from "react"

export interface DockItem {
  id: string
  label: string
  icon: React.ReactNode
  color: string
  isOpen: boolean
}

interface DockProps {
  items: DockItem[]
  onItemClick: (id: string) => void
}

export default function Dock({ items, onItemClick }: DockProps) {
  const dockRef = useRef<HTMLDivElement>(null)
  const [mouseX, setMouseX] = useState<number | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dockRef.current) return
    const rect = dockRef.current.getBoundingClientRect()
    setMouseX(e.clientX - rect.left)
  }

  const getScale = (index: number) => {
    if (mouseX === null || !dockRef.current) return 1
    const items = dockRef.current.querySelectorAll("[data-dock-item]")
    const item = items[index] as HTMLElement
    if (!item) return 1
    const rect = item.getBoundingClientRect()
    const dockRect = dockRef.current.getBoundingClientRect()
    const itemCenter = rect.left - dockRect.left + rect.width / 2
    const distance = Math.abs(mouseX - itemCenter)
    const maxDistance = 120
    if (distance > maxDistance) return 1
    return 1 + 0.5 * (1 - distance / maxDistance)
  }

  return (
    <div className="fixed right-0 bottom-3 left-0 z-50 flex justify-center">
      <div
        ref={dockRef}
        className="flex items-end gap-1 rounded-2xl border border-white/10 bg-black/40 px-3 py-2 shadow-2xl shadow-black/50 backdrop-blur-xl"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { setMouseX(null); setHoveredId(null) }}
      >
        {items.map((item, i) => {
          const scale = getScale(i)
          const isHovered = hoveredId === item.id
          return (
            <div
              key={item.id}
              className="group relative flex flex-col items-center"
              data-dock-item
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "bottom center",
                transition: "transform 0.15s ease-out",
              }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-10 whitespace-nowrap rounded-md border border-white/10 bg-black/80 px-3 py-1 text-xs font-medium text-white shadow-lg backdrop-blur-sm">
                  {item.label}
                </div>
              )}
              <button
                onClick={() => onItemClick(item.id)}
                className="relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200 hover:bg-white/10"
                style={{
                  background: isHovered
                    ? `linear-gradient(135deg, ${item.color}33, ${item.color}11)`
                    : undefined,
                  boxShadow: isHovered ? `0 0 20px ${item.color}44` : undefined,
                }}
              >
                <span className="text-2xl">{item.icon}</span>
              </button>
              {/* Active indicator */}
              {item.isOpen && (
                <div
                  className="mt-0.5 h-1 w-1 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
