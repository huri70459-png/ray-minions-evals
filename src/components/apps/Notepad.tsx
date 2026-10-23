import { useState, useRef, useEffect } from "react"

interface Note {
  id: number
  title: string
  content: string
  updatedAt: string
}

const initialNotes: Note[] = [
  { id: 1, title: "Untitled Note", content: "Start writing your thoughts here...\n\nThis notepad supports plain text editing with auto-save.", updatedAt: "Just now" },
]

export default function Notepad() {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [activeNote, setActiveNote] = useState(0)
  const [isSaved, setIsSaved] = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineCountRef = useRef<HTMLDivElement>(null)

  const currentNote = notes[activeNote]

  const updateContent = (content: string) => {
    setNotes(notes.map((n, i) => (i === activeNote ? { ...n, content, updatedAt: "Just now" } : n)))
    setIsSaved(false)
    setTimeout(() => setIsSaved(true), 1000)
  }

  const updateTitle = (title: string) => {
    setNotes(notes.map((n, i) => (i === activeNote ? { ...n, title } : n)))
  }

  const addNote = () => {
    const newNote: Note = { id: Date.now(), title: "Untitled Note", content: "", updatedAt: "Just now" }
    setNotes([newNote, ...notes])
    setActiveNote(0)
  }

  const deleteNote = (index: number) => {
    if (notes.length === 1) return
    const newNotes = notes.filter((_, i) => i !== index)
    setNotes(newNotes)
    if (activeNote >= newNotes.length) setActiveNote(newNotes.length - 1)
    else if (activeNote > index) setActiveNote(activeNote - 1)
  }

  const wordCount = currentNote.content.trim() ? currentNote.content.trim().split(/\s+/).length : 0
  const charCount = currentNote.content.length
  const lineCount = currentNote.content.split("\n").length

  useEffect(() => {
    const syncScroll = () => {
      if (textareaRef.current && lineCountRef.current) {
        lineCountRef.current.scrollTop = textareaRef.current.scrollTop
      }
    }
    const ta = textareaRef.current
    ta?.addEventListener("scroll", syncScroll)
    return () => ta?.removeEventListener("scroll", syncScroll)
  }, [])

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="flex w-52 shrink-0 flex-col border-r border-white/5">
        <div className="flex items-center justify-between border-b border-white/5 px-3 py-2">
          <span className="text-xs font-medium text-white/50">Notes</span>
          <button onClick={addNote} className="rounded p-1 text-white/40 transition hover:bg-white/10 hover:text-white">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          {notes.map((note, i) => (
            <div
              key={note.id}
              onClick={() => setActiveNote(i)}
              className={`group cursor-pointer border-b border-white/5 px-3 py-3 transition ${i === activeNote ? "bg-white/10" : "hover:bg-white/5"}`}
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium text-white/80">{note.title || "Untitled"}</div>
                  <div className="mt-0.5 truncate text-[10px] text-white/30">
                    {note.content.slice(0, 40) || "No content"}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteNote(i) }}
                  className="ml-1 text-white/20 opacity-0 transition group-hover:opacity-100 hover:text-red-400"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex flex-1 flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
          <input
            type="text"
            value={currentNote.title}
            onChange={(e) => updateTitle(e.target.value)}
            className="bg-transparent text-sm font-medium text-white outline-none"
          />
          <div className="flex items-center gap-3 text-[10px] text-white/30">
            <span className={`flex items-center gap-1 ${isSaved ? "text-green-400/60" : "text-yellow-400/60"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isSaved ? "bg-green-400" : "bg-yellow-400 animate-pulse"}`} />
              {isSaved ? "Saved" : "Saving..."}
            </span>
            <span>{wordCount} words</span>
            <span>{charCount} chars</span>
            <span>{lineCount} lines</span>
          </div>
        </div>

        {/* Editor area */}
        <div className="relative flex flex-1 overflow-hidden">
          {/* Line numbers */}
          <div
            ref={lineCountRef}
            className="w-10 shrink-0 overflow-hidden border-r border-white/5 bg-white/[0.02] py-4 text-right pr-2 font-mono text-[11px] leading-5 text-white/20 select-none"
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            value={currentNote.content}
            onChange={(e) => updateContent(e.target.value)}
            className="flex-1 resize-none bg-transparent p-4 font-mono text-sm leading-5 text-white/80 outline-none placeholder-white/20"
            placeholder="Start typing..."
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  )
}
