import { useState } from "react"

interface Memory {
  id: number
  title: string
  content: string
  tags: string[]
  timestamp: string
  color: string
}

const initialMemories: Memory[] = [
  { id: 1, title: "Project Architecture", content: "Using microservices with event-driven architecture. Main services: auth, content, analytics.", tags: ["architecture", "backend"], timestamp: "2 min ago", color: "#8A47E3" },
  { id: 2, title: "User Preferences", content: "Dark mode preferred. Short responses. Code examples in TypeScript.", tags: ["user", "preferences"], timestamp: "15 min ago", color: "#1724E0" },
  { id: 3, title: "Meeting Notes - Q4 Planning", content: "Focus on AI features. Budget approved for GPU cluster expansion. Deadline: Dec 15.", tags: ["meeting", "planning"], timestamp: "1 hour ago", color: "#A82121" },
  { id: 4, title: "API Rate Limits", content: "Free tier: 100 req/min. Pro: 1000 req/min. Enterprise: unlimited with SLA.", tags: ["api", "limits"], timestamp: "3 hours ago", color: "#E0DEDE" },
  { id: 5, title: "Bug Fix Pattern", content: "Memory leak in WebSocket handler. Fix: clear interval on disconnect, null check refs.", tags: ["bug", "fix"], timestamp: "Yesterday", color: "#8A47E3" },
]

export default function AIMemory() {
  const [memories, setMemories] = useState<Memory[]>(initialMemories)
  const [search, setSearch] = useState("")
  const [showAdd, setShowAdd] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  const [newTags, setNewTags] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const allTags = Array.from(new Set(memories.flatMap((m) => m.tags)))

  const filtered = memories.filter((m) => {
    const matchSearch = !search || m.title.toLowerCase().includes(search.toLowerCase()) || m.content.toLowerCase().includes(search.toLowerCase())
    const matchTag = !selectedTag || m.tags.includes(selectedTag)
    return matchSearch && matchTag
  })

  const addMemory = () => {
    if (!newTitle.trim()) return
    const colors = ["#8A47E3", "#1724E0", "#A82121", "#E0DEDE"]
    setMemories([
      {
        id: Date.now(),
        title: newTitle,
        content: newContent,
        tags: newTags.split(",").map((t) => t.trim()).filter(Boolean),
        timestamp: "Just now",
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      ...memories,
    ])
    setNewTitle("")
    setNewContent("")
    setNewTags("")
    setShowAdd(false)
  }

  const deleteMemory = (id: number) => {
    setMemories(memories.filter((m) => m.id !== id))
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
        <div className="relative flex-1">
          <svg className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search memories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pr-4 pl-9 text-sm text-white placeholder-white/30 outline-none focus:border-purple-500/50"
          />
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="rounded-lg bg-purple-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-purple-500"
        >
          {showAdd ? "Cancel" : "+ New"}
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="border-b border-white/5 bg-white/5 p-4">
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="mb-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-purple-500/50"
          />
          <textarea
            placeholder="Memory content..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="mb-2 w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-purple-500/50"
            rows={3}
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-purple-500/50"
            />
            <button onClick={addMemory} className="rounded-lg bg-purple-600 px-4 py-2 text-xs font-medium text-white hover:bg-purple-500">
              Save
            </button>
          </div>
        </div>
      )}

      {/* Tags filter */}
      <div className="flex gap-2 overflow-x-auto border-b border-white/5 px-4 py-2">
        <button
          onClick={() => setSelectedTag(null)}
          className={`shrink-0 rounded-full px-3 py-1 text-xs transition ${!selectedTag ? "bg-white/20 text-white" : "bg-white/5 text-white/50 hover:bg-white/10"}`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs transition ${selectedTag === tag ? "bg-white/20 text-white" : "bg-white/5 text-white/50 hover:bg-white/10"}`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Memory cards */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid gap-3">
          {filtered.map((memory) => (
            <div
              key={memory.id}
              className="group relative rounded-xl border border-white/5 bg-white/5 p-4 transition hover:border-white/10 hover:bg-white/[0.07]"
            >
              <div className="mb-1 flex items-start justify-between">
                <h3 className="text-sm font-semibold text-white">{memory.title}</h3>
                <button
                  onClick={() => deleteMemory(memory.id)}
                  className="text-white/20 opacity-0 transition group-hover:opacity-100 hover:text-red-400"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <p className="mb-2 text-xs leading-relaxed text-white/60">{memory.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {memory.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{ backgroundColor: `${memory.color}22`, color: memory.color }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] text-white/30">{memory.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
