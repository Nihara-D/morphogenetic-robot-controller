import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Morphogenetic Soft Robot Controller',
  description: 'Research platform for bio-inspired shape-changing via reaction-diffusion dynamics and soft body simulation',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <span className="text-sm font-bold text-slate-950">M</span>
            </div>
            <h1 className="text-xl font-bold">MorphoBot</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-slate-400 hover:text-slate-200 transition">
              Dashboard
            </Link>
            <Link href="/visualizer" className="text-sm text-slate-400 hover:text-slate-200 transition">
              Visualizer
            </Link>
            <Link href="/experiments" className="text-sm text-slate-400 hover:text-slate-200 transition">
              Experiments
            </Link>
            <Link href="/docs" className="text-sm text-slate-400 hover:text-slate-200 transition">
              Docs
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Morphogenetic Soft Robot Controller
          </h1>
          <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto">
            Bio-inspired shape-changing through reaction-diffusion dynamics, soft body simulation, and neuromorphic control
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700">
                Launch Dashboard
              </Button>
            </Link>
            <Link href="/visualizer">
              <Button size="lg" variant="outline" className="border-slate-700 hover:bg-slate-800">
                Open Visualizer
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-20">
          <Card className="border-slate-800 bg-slate-900/50 hover:bg-slate-900 transition">
            <CardHeader>
              <CardTitle className="text-cyan-400">Morphogen Fields</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400 text-sm">
              PDE-driven reaction-diffusion controller with spatially distributed actuation signals
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50 hover:bg-slate-900 transition">
            <CardHeader>
              <CardTitle className="text-orange-400">Soft Body Physics</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400 text-sm">
              FEM-based simulation with hyperelastic material models and differentiable gradients
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50 hover:bg-slate-900 transition">
            <CardHeader>
              <CardTitle className="text-amber-400">Learning Algorithms</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400 text-sm">
              Evolutionary search, RL, and spiking neural networks for controller optimization
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50 hover:bg-slate-900 transition">
            <CardHeader>
              <CardTitle className="text-purple-400">Real-time Viz</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400 text-sm">
              3D mesh deformation and morphogen field visualization with interactive controls
            </CardContent>
          </Card>
        </div>

        {/* System Architecture */}
        <section className="mt-24">
          <h2 className="text-3xl font-bold mb-12 text-center">System Architecture</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Input Layer */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-cyan-400">Input Layer</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold mt-0.5">•</span>
                  <span>Reaction-Diffusion Patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold mt-0.5">•</span>
                  <span>Proprioceptive Feedback</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold mt-0.5">•</span>
                  <span>Environmental Gradients</span>
                </li>
              </ul>
            </div>

            {/* Core Processing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-400">Core Processing</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold mt-0.5">•</span>
                  <span>Morphogen Field Controller</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold mt-0.5">•</span>
                  <span>SNN / Lyapunov Networks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold mt-0.5">•</span>
                  <span>Adaptive Control Laws</span>
                </li>
              </ul>
            </div>

            {/* Output Layer */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-400">Output & Learning</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold mt-0.5">•</span>
                  <span>Differentiable Physics Sim</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold mt-0.5">•</span>
                  <span>Evolutionary Optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold mt-0.5">•</span>
                  <span>Locomotion Controllers</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="mt-24 bg-slate-800/30 border border-slate-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Quick Start</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-cyan-400">Frontend</h3>
              <pre className="bg-slate-950 border border-slate-700 rounded-lg p-4 text-sm text-slate-300 overflow-x-auto">
                {`pnpm install
pnpm dev`}
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-orange-400">Backend (Python)</h3>
              <pre className="bg-slate-950 border border-slate-700 rounded-lg p-4 text-sm text-slate-300 overflow-x-auto">
                {`cd python
pip install -r requirements.txt
python app.py`}
              </pre>
            </div>
          </div>
        </section>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 mt-24 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
          <p>Morphogenetic Soft Robot Research Platform • Built with Next.js + Python + JAX</p>
        </div>
      </footer>
    </main>
  )
}
