import { useState } from "react"

interface WikiArticle {
  id: number
  title: string
  category: string
  content: string
  tags: string[]
  lastEdited: string
}

const articles: WikiArticle[] = [
  {
    id: 1,
    title: "Transformer Architecture",
    category: "Models",
    tags: ["architecture", "attention", "deep-learning"],
    lastEdited: "2 days ago",
    content: `## Overview

The Transformer architecture, introduced in "Attention Is All You Need" (Vaswani et al., 2017), revolutionized natural language processing by replacing recurrence with self-attention mechanisms.

## Key Components

### Self-Attention
Self-attention allows the model to weigh the importance of different tokens in a sequence relative to each other. The mechanism computes:

\`\`\`
Attention(Q, K, V) = softmax(QK^T / √d_k) V
\`\`\`

### Multi-Head Attention
Instead of a single attention function, multi-head attention runs h parallel attention operations, allowing the model to attend to information from different representation subspaces.

### Position Encoding
Since transformers lack inherent sequence ordering, positional encodings are added to input embeddings to provide sequence information.

## Applications
- Large Language Models (GPT, LLaMA, Claude)
- Machine Translation
- Text Summarization
- Code Generation`,
  },
  {
    id: 2,
    title: "Prompt Engineering",
    category: "Techniques",
    tags: ["prompts", "best-practices", "llm"],
    lastEdited: "1 week ago",
    content: `## Fundamentals

Prompt engineering is the practice of designing and optimizing inputs to large language models to elicit desired outputs.

## Core Techniques

### Zero-Shot Prompting
Directly asking the model to perform a task without examples.

### Few-Shot Prompting
Providing 2-5 examples before the actual query to guide the model's behavior.

### Chain-of-Thought (CoT)
Asking the model to reason step-by-step before providing a final answer. This significantly improves performance on complex reasoning tasks.

### Role Prompting
Assigning a specific role or persona to the model to frame its responses.

## Best Practices
1. Be specific and clear in instructions
2. Provide context when needed
3. Use structured output formats
4. Include negative examples
5. Iterate and refine`,
  },
  {
    id: 3,
    title: "RAG (Retrieval Augmented Generation)",
    category: "Architecture",
    tags: ["rag", "retrieval", "vector-db"],
    lastEdited: "3 days ago",
    content: `## What is RAG?

Retrieval Augmented Generation combines information retrieval with text generation to produce more accurate, grounded responses.

## Architecture

\`\`\`
Query → Embedding → Vector Search → Context Assembly → LLM Generation → Response
\`\`\`

## Components

### Embedding Model
Converts text into dense vector representations for semantic search.

### Vector Database
Stores and retrieves embeddings efficiently (Pinecone, Weaviate, ChromaDB).

### Chunking Strategy
Documents are split into overlapping chunks to maintain context while fitting within token limits.

## Benefits
- Reduced hallucination
- Up-to-date information
- Source attribution
- Domain-specific knowledge`,
  },
  {
    id: 4,
    title: "Token Economics",
    category: "Infrastructure",
    tags: ["tokens", "cost", "optimization"],
    lastEdited: "5 days ago",
    content: `## Understanding Tokens

Tokens are the basic units of text processing in LLMs. They roughly correspond to 4 characters or ¾ of a word in English.

## Cost Factors
- Input tokens (cheaper)
- Output tokens (more expensive)
- Context window size
- Model tier (GPT-4 vs GPT-3.5)

## Optimization Strategies
1. Use efficient prompting
2. Cache repeated queries
3. Summarize long contexts
4. Choose appropriate model tier
5. Batch processing where possible`,
  },
  {
    id: 5,
    title: "Fine-Tuning vs Prompting",
    category: "Techniques",
    tags: ["fine-tuning", "prompting", "comparison"],
    lastEdited: "1 day ago",
    content: `## When to Fine-Tune
- Domain-specific terminology
- Consistent output format required
- Performance ceiling reached with prompting
- Large volume of similar tasks

## When to Use Prompting
- Rapid prototyping
- Flexible, varied tasks
- Limited training data
- Quick iteration needed

## Hybrid Approach
Use prompting for general tasks and fine-tuning for specialized, high-volume operations.`,
  },
]

const categories = Array.from(new Set(articles.map((a) => a.category)))

export default function LLMWiki() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [activeArticle, setActiveArticle] = useState<number>(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const filtered = articles.filter((a) => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.tags.some((t) => t.includes(search.toLowerCase()))
    const matchCat = !selectedCategory || a.category === selectedCategory
    return matchSearch && matchCat
  })

  const article = filtered[activeArticle] || articles[0]

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="flex w-56 shrink-0 flex-col border-r border-white/5">
          <div className="border-b border-white/5 p-3">
            <div className="relative">
              <svg className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search wiki..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setActiveArticle(0) }}
                className="w-full rounded-lg border border-white/10 bg-white/5 py-1.5 pr-3 pl-8 text-xs text-white placeholder-white/30 outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="border-b border-white/5 px-3 py-2">
            <span className="text-[10px] font-medium tracking-wider text-white/30 uppercase">Categories</span>
            <div className="mt-2 space-y-0.5">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full rounded-md px-2 py-1 text-left text-xs transition ${!selectedCategory ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white/70"}`}
              >
                All Articles
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setActiveArticle(0) }}
                  className={`w-full rounded-md px-2 py-1 text-left text-xs transition ${selectedCategory === cat ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white/70"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Article list */}
          <div className="flex-1 overflow-auto px-2 py-2">
            {filtered.map((a, i) => (
              <button
                key={a.id}
                onClick={() => setActiveArticle(i)}
                className={`mb-1 w-full rounded-lg px-3 py-2 text-left transition ${i === activeArticle ? "bg-emerald-500/10 border border-emerald-500/20" : "hover:bg-white/5 border border-transparent"}`}
              >
                <div className="truncate text-xs font-medium text-white/80">{a.title}</div>
                <div className="mt-0.5 text-[10px] text-white/30">{a.category} • {a.lastEdited}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded p-1 text-white/40 transition hover:bg-white/10 hover:text-white">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">{article.category}</span>
            <span className="text-[10px] text-white/30">Last edited: {article.lastEdited}</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <h1 className="mb-4 text-2xl font-bold text-white">{article.title}</h1>
          <div className="mb-6 flex gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/40">
                #{tag}
              </span>
            ))}
          </div>
          <div className="prose prose-invert prose-sm max-w-none">
            {article.content.split("\n").map((line, i) => {
              if (line.startsWith("## ")) return <h2 key={i} className="mt-6 mb-3 text-lg font-semibold text-white/90">{line.slice(3)}</h2>
              if (line.startsWith("### ")) return <h3 key={i} className="mt-4 mb-2 text-sm font-semibold text-white/80">{line.slice(4)}</h3>
              if (line.startsWith("```")) return <div key={i} className="my-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white/60">
                {line.replace(/```\w*/, "")}
              </div>
              if (line.startsWith("- ")) return <div key={i} className="ml-4 flex items-start gap-2 text-xs leading-relaxed text-white/60">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/30" />{line.slice(2)}
              </div>
              if (/^\d+\./.test(line)) return <div key={i} className="ml-4 text-xs leading-relaxed text-white/60">{line}</div>
              if (line.trim() === "") return <div key={i} className="h-3" />
              return <p key={i} className="text-xs leading-relaxed text-white/60">{line}</p>
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
