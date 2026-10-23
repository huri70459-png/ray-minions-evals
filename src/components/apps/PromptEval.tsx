import { useState } from "react"

interface EvalResult {
  id: number
  input: string
  output: string
  score: number
  latency: number
  tokens: number
}

interface PromptTest {
  id: number
  prompt: string
  results: EvalResult[]
}

const sampleTests: PromptTest[] = [
  {
    id: 1,
    prompt: "You are a helpful coding assistant. Explain the concept briefly and provide a code example.",
    results: [
      { id: 1, input: "What is recursion?", output: "Recursion is when a function calls itself to solve smaller instances of the same problem. Base case stops the recursion.\n\n```js\nfunction factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\n```", score: 92, latency: 340, tokens: 45 },
      { id: 2, input: "Explain closures", output: "A closure is a function that remembers variables from its outer scope even after the outer function has returned.\n\n```js\nfunction counter() {\n  let count = 0;\n  return () => ++count;\n}\n```", score: 88, latency: 280, tokens: 38 },
    ],
  },
]

export default function PromptEval() {
  const [tests, setTests] = useState<PromptTest[]>(sampleTests)
  const [activeTest, setActiveTest] = useState(0)
  const [newInput, setNewInput] = useState("")
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [selectedResult, setSelectedResult] = useState<number | null>(null)

  const currentTest = tests[activeTest]

  const runEval = () => {
    if (!newInput.trim()) return
    setIsEvaluating(true)
    setTimeout(() => {
      const mockOutputs = [
        "This is a well-structured response that addresses the query directly with relevant examples and clear explanations.",
        "A comprehensive answer covering the key aspects. The explanation is accurate and includes practical use cases.",
        "Good response with appropriate depth. Could benefit from more edge case considerations but overall solid.",
      ]
      const newResult: EvalResult = {
        id: Date.now(),
        input: newInput,
        output: mockOutputs[Math.floor(Math.random() * mockOutputs.length)],
        score: Math.floor(Math.random() * 20) + 75,
        latency: Math.floor(Math.random() * 400) + 200,
        tokens: Math.floor(Math.random() * 60) + 20,
      }
      setTests(tests.map((t, i) => (i === activeTest ? { ...t, results: [...t.results, newResult] } : t)))
      setNewInput("")
      setIsEvaluating(false)
    }, 1500)
  }

  const updatePrompt = (prompt: string) => {
    setTests(tests.map((t, i) => (i === activeTest ? { ...t, prompt } : t)))
  }

  const addTest = () => {
    const newTest: PromptTest = { id: Date.now(), prompt: "", results: [] }
    setTests([...tests, newTest])
    setActiveTest(tests.length)
  }

  const avgScore = currentTest.results.length > 0
    ? Math.round(currentTest.results.reduce((a, r) => a + r.score, 0) / currentTest.results.length)
    : 0

  return (
    <div className="flex h-full flex-col">
      {/* Test tabs */}
      <div className="flex items-center gap-1 border-b border-white/5 px-3 py-2">
        {tests.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setActiveTest(i)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${i === activeTest ? "bg-white/10 text-white" : "text-white/40 hover:bg-white/5 hover:text-white/60"}`}
          >
            Test {i + 1}
          </button>
        ))}
        <button onClick={addTest} className="rounded-lg px-2 py-1.5 text-xs text-white/30 transition hover:bg-white/5 hover:text-white/60">
          +
        </button>
      </div>

      {/* Prompt editor */}
      <div className="border-b border-white/5 p-4">
        <label className="mb-1.5 text-[10px] font-medium tracking-wider text-white/30 uppercase">System Prompt</label>
        <textarea
          value={currentTest.prompt}
          onChange={(e) => updatePrompt(e.target.value)}
          placeholder="Enter your system prompt..."
          className="w-full resize-none rounded-lg border border-white/10 bg-white/5 p-3 font-mono text-xs leading-relaxed text-white/80 outline-none focus:border-blue-500/50"
          rows={3}
        />
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 border-b border-white/5 px-4 py-2">
        <div className="flex items-center gap-1.5">
          <div className={`h-2 w-2 rounded-full ${avgScore >= 80 ? "bg-green-400" : avgScore >= 60 ? "bg-yellow-400" : "bg-red-400"}`} />
          <span className="text-xs text-white/50">Avg Score: <span className="font-medium text-white/80">{avgScore}%</span></span>
        </div>
        <span className="text-xs text-white/30">•</span>
        <span className="text-xs text-white/50">Tests: <span className="font-medium text-white/80">{currentTest.results.length}</span></span>
        <span className="text-xs text-white/30">•</span>
        <span className="text-xs text-white/50">Avg Latency: <span className="font-medium text-white/80">{currentTest.results.length > 0 ? Math.round(currentTest.results.reduce((a, r) => a + r.latency, 0) / currentTest.results.length) : 0}ms</span></span>
      </div>

      {/* Results */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-1/2 flex-col border-r border-white/5">
          <div className="border-b border-white/5 px-4 py-2">
            <span className="text-[10px] font-medium tracking-wider text-white/30 uppercase">Test Inputs</span>
          </div>
          <div className="flex-1 overflow-auto p-3">
            {currentTest.results.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelectedResult(r.id)}
                className={`mb-2 cursor-pointer rounded-lg border p-3 transition ${selectedResult === r.id ? "border-blue-500/30 bg-blue-500/5" : "border-white/5 hover:border-white/10 hover:bg-white/5"}`}
              >
                <p className="mb-2 text-xs text-white/70">{r.input}</p>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${r.score >= 80 ? "bg-green-500/20 text-green-400" : r.score >= 60 ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>
                    {r.score}%
                  </span>
                  <span className="text-[10px] text-white/30">{r.latency}ms</span>
                  <span className="text-[10px] text-white/30">{r.tokens} tokens</span>
                </div>
              </div>
            ))}
          </div>
          {/* Input area */}
          <div className="border-t border-white/5 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newInput}
                onChange={(e) => setNewInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runEval()}
                placeholder="Enter test input..."
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-blue-500/50"
              />
              <button
                onClick={runEval}
                disabled={isEvaluating || !newInput.trim()}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-blue-500 disabled:opacity-50"
              >
                {isEvaluating ? (
                  <span className="flex items-center gap-1">
                    <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Running
                  </span>
                ) : "Run"}
              </button>
            </div>
          </div>
        </div>

        {/* Output panel */}
        <div className="flex w-1/2 flex-col">
          <div className="border-b border-white/5 px-4 py-2">
            <span className="text-[10px] font-medium tracking-wider text-white/30 uppercase">Output</span>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {selectedResult ? (
              <div>
                <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-white/70">
                  {currentTest.results.find((r) => r.id === selectedResult)?.output}
                </pre>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-white/20">
                Select a test result to view output
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
