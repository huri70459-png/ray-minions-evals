import { useCallback } from "react"
import CursorRingField from "./components/CursorRingField"
import Dock from "./components/Dock"
import type { DockItem } from "./components/Dock"
import Window from "./components/Window"
import { useWindowManager } from "./hooks/useWindowManager"
import AIMemory from "./components/apps/AIMemory"
import Notepad from "./components/apps/Notepad"
import PromptEval from "./components/apps/PromptEval"
import LLMWiki from "./components/apps/LLMWiki"
import AIAgent from "./components/apps/AIAgent"

const APP_CONFIG = {
  "ai-memory": {
    title: "AI Memory",
    icon: "🧠",
    color: "#8A47E3",
    defaults: { width: 650, height: 520, minWidth: 450, minHeight: 350 },
  },
  notepad: {
    title: "Notepad",
    icon: "📝",
    color: "#1724E0",
    defaults: { width: 700, height: 480, minWidth: 500, minHeight: 300 },
  },
  "prompt-eval": {
    title: "Prompt Eval",
    icon: "⚡",
    color: "#F59E0B",
    defaults: { width: 800, height: 550, minWidth: 600, minHeight: 400 },
  },
  "llm-wiki": {
    title: "LLM Wiki",
    icon: "📚",
    color: "#10B981",
    defaults: { width: 750, height: 520, minWidth: 550, minHeight: 380 },
  },
  "ai-agent": {
    title: "AI Agent",
    icon: "🤖",
    color: "#06B6D4",
    defaults: { width: 600, height: 550, minWidth: 400, minHeight: 400 },
  },
}

function AppContent({ appId }: { appId: string }) {
  switch (appId) {
    case "ai-memory": return <AIMemory />
    case "notepad": return <Notepad />
    case "prompt-eval": return <PromptEval />
    case "llm-wiki": return <LLMWiki />
    case "ai-agent": return <AIAgent />
    default: return null
  }
}

export default function App() {
  const { windows, openWindow, closeWindow, focusWindow, minimizeWindow, toggleMaximize, updateWindow } = useWindowManager()

  const handleDockClick = useCallback(
    (appId: string) => {
      const config = APP_CONFIG[appId as keyof typeof APP_CONFIG]
      if (!config) return
      openWindow(appId, config.title, config.defaults)
    },
    [openWindow]
  )

  const dockItems: DockItem[] = Object.entries(APP_CONFIG).map(([id, config]) => ({
    id,
    label: config.title,
    icon: <span>{config.icon}</span>,
    color: config.color,
    isOpen: windows.some((w) => w.appId === id && !w.isMinimized),
  }))

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Particle background */}
      <div className="fixed inset-0 z-0">
        <CursorRingField
          background="#000000"
          colors={{
            items: ["#A82121", "#1724E0", "#8A47E3", "#E0DEDE"],
          }}
          dotSize={150}
          speed={20}
          cameraDistance={430}
          ring={{ push: 57, width: 11, radius: 20, turbulence: 180 }}
        />
      </div>

      {/* Desktop area */}
      <div className="relative z-10 h-full w-full">
        {/* Top bar */}
        <div className="flex h-8 items-center justify-between border-b border-white/5 bg-black/30 px-4 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-white/80">⬡ NebulaOS</span>
            <span className="text-[10px] text-white/30">|</span>
            <span className="text-[10px] text-white/40">
              {windows.filter((w) => !w.isMinimized).length} window{windows.filter((w) => !w.isMinimized).length !== 1 ? "s" : ""} open
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-white/30">
              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
              <span className="text-[10px] text-white/40">Connected</span>
            </div>
          </div>
        </div>

        {/* Welcome screen when no windows open */}
        {windows.length === 0 && (
          <div className="flex h-[calc(100%-80px)] flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium text-white/80">System Ready</span>
            </div>
            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                Your AI
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
                Workspace
              </span>
            </h1>
            <p className="mt-4 max-w-md text-sm text-white/50">
              Open apps from the dock below. Move your cursor to interact with the particle field.
            </p>

            {/* Quick launch */}
            <div className="mt-8 grid grid-cols-5 gap-3">
              {Object.entries(APP_CONFIG).map(([id, config]) => (
                <button
                  key={id}
                  onClick={() => handleDockClick(id)}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/10"
                >
                  <span className="text-2xl transition group-hover:scale-110">{config.icon}</span>
                  <span className="text-[10px] font-medium text-white/60 group-hover:text-white/80">{config.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Windows */}
        {windows.map((win) => (
          <Window
            key={win.appId}
            window={win}
            onClose={() => closeWindow(win.appId)}
            onFocus={() => focusWindow(win.appId)}
            onMinimize={() => minimizeWindow(win.appId)}
            onToggleMaximize={() => toggleMaximize(win.appId)}
            onUpdate={(updates) => updateWindow(win.appId, updates)}
            icon={<span>{APP_CONFIG[win.appId as keyof typeof APP_CONFIG]?.icon}</span>}
          >
            <AppContent appId={win.appId} />
          </Window>
        ))}
      </div>

      {/* Dock */}
      <div className="relative z-20">
        <Dock items={dockItems} onItemClick={handleDockClick} />
      </div>
    </div>
  )
}
