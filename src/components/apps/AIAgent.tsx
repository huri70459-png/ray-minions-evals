import { useState, useRef, useEffect } from "react"

interface Message {
  id: number
  role: "user" | "agent" | "system"
  content: string
  timestamp: string
  status?: "sending" | "sent" | "error"
}

const agentResponses = [
  "I've analyzed your request. Based on the current context, I recommend breaking this down into smaller, manageable steps. Would you like me to proceed with the first phase?",
  "Great question! Let me think through this systematically. The key factors to consider are performance, scalability, and maintainability. Here's my recommendation...",
  "I've processed that information and updated my memory. The pattern you're describing is common in distributed systems. Let me suggest an approach that addresses the root cause.",
  "Interesting edge case! I've seen similar patterns before. The solution involves implementing a retry mechanism with exponential backoff. Shall I draft the implementation?",
  "Based on our previous conversations, I believe this aligns with your preference for clean, functional code. Here's a solution that maintains consistency with your codebase patterns.",
  "I've cross-referenced this with the documentation. There are actually three viable approaches here, each with different trade-offs. Let me walk you through them.",
]

const initialMessages: Message[] = [
  {
    id: 1,
    role: "system",
    content: "AI Agent is ready. I have access to your memory, wiki, and tools. How can I help?",
    timestamp: "10:00 AM",
  },
]

export default function AIAgent() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [agentStatus, setAgentStatus] = useState<"online" | "thinking" | "idle">("online")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim() || isTyping) return

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)
    setAgentStatus("thinking")

    // Simulate agent response
    setTimeout(() => {
      const agentMsg: Message = {
        id: Date.now() + 1,
        role: "agent",
        content: agentResponses[Math.floor(Math.random() * agentResponses.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, agentMsg])
      setIsTyping(false)
      setAgentStatus("online")
      inputRef.current?.focus()
    }, 1500 + Math.random() * 1500)
  }

  const tools = [
    { name: "Memory", icon: "🧠", active: true },
    { name: "Wiki", icon: "📚", active: true },
    { name: "Code", icon: "💻", active: false },
    { name: "Web", icon: "🌐", active: false },
  ]

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm">
              🤖
            </div>
            <div className={`absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0a0a14] ${agentStatus === "thinking" ? "bg-yellow-400 animate-pulse" : "bg-green-400"}`} />
          </div>
          <div>
            <div className="text-xs font-semibold text-white">AI Agent</div>
            <div className="text-[10px] text-white/40">
              {agentStatus === "thinking" ? "Processing..." : "Online • Connected to tools"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] ${tool.active ? "bg-white/10 text-white/70" : "bg-white/5 text-white/30"}`}
              title={tool.name}
            >
              <span>{tool.icon}</span>
              <span className="hidden sm:inline">{tool.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto px-4 py-4">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "system" ? (
                <div className="w-full rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-center text-xs text-cyan-300/70">
                  {msg.content}
                </div>
              ) : (
                <div className={`max-w-[80%] ${msg.role === "user" ? "order-1" : ""}`}>
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "rounded-br-md bg-blue-600 text-white"
                        : "rounded-bl-md border border-white/10 bg-white/5 text-white/80"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <div className={`mt-1 flex items-center gap-2 text-[10px] text-white/20 ${msg.role === "user" ? "justify-end" : ""}`}>
                    <span>{msg.timestamp}</span>
                    {msg.role === "user" && msg.status === "sent" && (
                      <svg className="h-3 w-3 text-blue-400/50" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:0ms]" />
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:150ms]" />
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-white/5 p-4">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 focus-within:border-cyan-500/30">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask the agent anything..."
              className="flex-1 bg-transparent text-xs text-white placeholder-white/30 outline-none"
              disabled={isTyping}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="rounded-lg bg-cyan-600 p-1.5 text-white transition hover:bg-cyan-500 disabled:opacity-30"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
        <div className="mx-auto mt-2 max-w-2xl text-center text-[10px] text-white/20">
          Agent has access to Memory, Wiki, and connected tools
        </div>
      </div>
    </div>
  )
}
