import CursorRingField from "./components/CursorRingField"

export default function App() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      {/* Full-screen CursorRingField background */}
      <div className="fixed inset-0 z-0">
        <CursorRingField
          background="#000000"
          colors={{
            items: [
              "#A82121",
              "#1724E0",
              "#8A47E3",
              "#E0DEDE",
            ],
          }}
          dotSize={150}
          speed={20}
          cameraDistance={430}
          ring={{
            push: 57,
            width: 11,
            radius: 20,
            turbulence: 180,
          }}
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 py-5 md:px-12">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-500 via-purple-600 to-blue-600" />
            <span className="text-lg font-bold tracking-tight">Nebula</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#" className="text-sm text-white/70 transition hover:text-white">Products</a>
            <a href="#" className="text-sm text-white/70 transition hover:text-white">Solutions</a>
            <a href="#" className="text-sm text-white/70 transition hover:text-white">Developers</a>
            <a href="#" className="text-sm text-white/70 transition hover:text-white">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium transition hover:border-white/40 hover:bg-white/5">
              Sign In
            </button>
            <button className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black transition hover:bg-white/90">
              Get Started
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-medium text-white/80">Now in Public Beta</span>
          </div>

          <h1 className="max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-7xl lg:text-8xl">
            <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
              The Future of
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
              Interactive Design
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-white/60 md:text-xl">
            Build mesmerizing interfaces with GPU-accelerated particle systems.
            Move your cursor to interact with the field above.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <button className="group relative overflow-hidden rounded-full bg-white px-8 py-3.5 text-sm font-bold text-black transition-all hover:shadow-lg hover:shadow-white/20">
              <span className="relative z-10">Start Building Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-purple-500 to-blue-500 opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 transition-opacity group-hover:opacity-100">
                Start Building Free
              </span>
            </button>
            <button className="flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-sm font-medium text-white/80 transition hover:border-white/40 hover:bg-white/5 hover:text-white">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-2xl font-bold md:text-3xl">50K+</div>
              <div className="mt-1 text-xs text-white/50 md:text-sm">Developers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold md:text-3xl">99.9%</div>
              <div className="mt-1 text-xs text-white/50 md:text-sm">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold md:text-3xl">60fps</div>
              <div className="mt-1 text-xs text-white/50 md:text-sm">Performance</div>
            </div>
          </div>
        </main>

        {/* Bottom section */}
        <div className="px-6 pb-8 md:px-12">
          <div className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md md:p-8">
            <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
              <div>
                <h3 className="text-lg font-semibold">Move your cursor around</h3>
                <p className="mt-1 text-sm text-white/50">
                  This WebGL-powered particle field responds to your mouse position in real-time
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-1">
                  <div className="h-6 w-6 rounded-full border-2 border-black bg-red-500" />
                  <div className="h-6 w-6 rounded-full border-2 border-black bg-purple-500" />
                  <div className="h-6 w-6 rounded-full border-2 border-black bg-blue-500" />
                  <div className="h-6 w-6 rounded-full border-2 border-black bg-white" />
                </div>
                <span className="text-xs text-white/40">Powered by WebGL2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
