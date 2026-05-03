import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const metadata = {
  title: 'Documentation - Morphogenetic Robot Controller',
  description: 'Research methodology, theory, and interactive guides',
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm text-slate-400 hover:text-slate-200 transition">
              ← Home
            </a>
            <h1 className="text-lg font-bold">Documentation</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Morphogenetic Soft Robot Controller
          </h1>
          <p className="text-xl text-slate-400">
            Research platform documentation, methodology, and theory
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="methodology">Methodology</TabsTrigger>
            <TabsTrigger value="theory">Theory</TabsTrigger>
            <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
            <TabsTrigger value="references">References</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
                <CardDescription>
                  Understanding morphogenetic soft robot control
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-300">
                <p>
                  This research platform investigates bio-inspired control of soft robots through morphogenetic principles.
                  By combining reaction-diffusion PDEs, soft body physics, and neuromorphic control, we create deformable
                  robots that adapt their shape for locomotion and task execution.
                </p>

                <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-cyan-400">Key Components</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-3">
                      <span className="text-cyan-400 font-bold">1.</span>
                      <span>
                        <strong>Morphogen Fields:</strong> Turing patterns from Gray-Scott reaction-diffusion equations
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-cyan-400 font-bold">2.</span>
                      <span>
                        <strong>Soft Body Physics:</strong> FEM-based simulation with hyperelastic materials
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-cyan-400 font-bold">3.</span>
                      <span>
                        <strong>Neural Control:</strong> Lyapunov-stable networks and spiking neural networks
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-cyan-400 font-bold">4.</span>
                      <span>
                        <strong>Optimization:</strong> Evolutionary algorithms for controller parameter search
                      </span>
                    </li>
                  </ul>
                </div>

                <p>
                  The platform enables researchers to design, simulate, and optimize soft robot controllers using
                  biologically-inspired mechanisms. Interactive visualization and experiment tracking provide tools for
                  research iteration and knowledge discovery.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Methodology Tab */}
          <TabsContent value="methodology" className="space-y-6">
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle>Research Methodology</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-slate-300">
                <div>
                  <h4 className="font-semibold text-orange-400 mb-3">1. Morphogen Field Generation</h4>
                  <p className="text-sm mb-3">
                    We use the Gray-Scott reaction-diffusion model to generate spatially varying activation patterns:
                  </p>
                  <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 font-mono text-xs mb-3 overflow-x-auto">
                    {`∂u/∂t = D_u∇²u - uv² + f(1-u)
∂v/∂t = D_v∇²v + uv² - (f+k)v`}
                  </div>
                  <p className="text-sm">
                    where u and v are morphogen concentrations, D_u and D_v are diffusion coefficients, and f and k are
                    reaction rates. This produces Turing patterns suitable for shape-change encoding.
                  </p>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <h4 className="font-semibold text-orange-400 mb-3">2. Soft Body Simulation</h4>
                  <p className="text-sm mb-3">
                    Deformable bodies are simulated using finite element methods (FEM) with:
                  </p>
                  <ul className="text-sm space-y-2 ml-4">
                    <li>• Tetrahedral mesh discretization</li>
                    <li>• Hyperelastic material model (St. Venant-Kirchhoff)</li>
                    <li>• Verlet integration for stable dynamics</li>
                    <li>• Actuation forces from morphogen field</li>
                  </ul>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <h4 className="font-semibold text-orange-400 mb-3">3. Neural Control</h4>
                  <p className="text-sm mb-3">
                    The controller integrates morphogen fields with proprioceptive feedback through:
                  </p>
                  <ul className="text-sm space-y-2 ml-4">
                    <li>• Lyapunov-stable recurrent layers ensuring energy dissipation</li>
                    <li>• Spiking neural networks (integrate-and-fire model)</li>
                    <li>• Direct processing of reaction-diffusion patterns</li>
                    <li>• Strain field feedback from soft body</li>
                  </ul>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <h4 className="font-semibold text-orange-400 mb-3">4. Optimization Pipeline</h4>
                  <p className="text-sm">
                    Controller parameters are optimized using evolutionary algorithms (MAP-Elites) to maximize task
                    performance while maintaining behavioral diversity.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Theory Tab */}
          <TabsContent value="theory" className="space-y-6">
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle>Theoretical Framework</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-slate-300">
                <div>
                  <h4 className="font-semibold text-purple-400 mb-3">Morphogenesis & Turing Patterns</h4>
                  <p className="text-sm mb-2">
                    Turing&apos;s 1952 theory of morphogenesis explains how diffusing chemicals can create spatial patterns
                    from uniform initial conditions. In soft robotics, we harness these principles to generate
                    distributed activation maps for shape-change.
                  </p>
                  <p className="text-sm text-slate-400">
                    Gray-Scott parameters determine pattern wavelength and dynamics, allowing tuning of robot behavior
                    through parameter selection.
                  </p>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <h4 className="font-semibold text-purple-400 mb-3">Soft Body Mechanics</h4>
                  <p className="text-sm mb-2">
                    Soft robots exhibit nonlinear elastic behavior captured through hyperelastic material models.
                    The strain-stress relationship follows:
                  </p>
                  <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 font-mono text-xs mb-3 overflow-x-auto">
                    σ = ∂W/∂E
                  </div>
                  <p className="text-sm">
                    where W is the strain energy density and E is the Green strain tensor. This enables accurate prediction
                    of deformation under actuation forces.
                  </p>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <h4 className="font-semibold text-purple-400 mb-3">Lyapunov Stability</h4>
                  <p className="text-sm">
                    Neural controllers are designed to satisfy Lyapunov stability conditions, ensuring bounded trajectories
                    and robust behavior under perturbations. Energy dissipation layers maintain asymptotic stability even
                    with external disturbances.
                  </p>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <h4 className="font-semibold text-purple-400 mb-3">Spiking Neural Networks</h4>
                  <p className="text-sm">
                    SNNs provide event-driven computation with low energy consumption. The integrate-and-fire model
                    captures neuronal dynamics:
                  </p>
                  <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                    dV/dt = -V + I(t)
                  </div>
                  <p className="text-sm mt-3">
                    Spikes occur when V exceeds threshold, enabling temporal coding of actuation signals.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quick Start Tab */}
          <TabsContent value="quickstart" className="space-y-6">
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>
                  Quick start guide for running simulations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 text-slate-300">
                <div>
                  <h4 className="font-semibold text-cyan-400 mb-3">1. Access the Dashboard</h4>
                  <p className="text-sm mb-3">
                    Navigate to the{' '}
                    <Link href="/dashboard" className="text-cyan-400 hover:text-cyan-300">
                      Dashboard
                    </Link>{' '}
                    to control simulations. You&apos;ll find three main simulators.
                  </p>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <h4 className="font-semibold text-cyan-400 mb-3">2. Run a Morphogen Simulation</h4>
                  <p className="text-sm mb-2">Select the Morphogen Fields tab and:</p>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Choose a pattern (spot for localized, stripes for periodic)</li>
                    <li>• Adjust Gray-Scott parameters (f, k, diffusion rates)</li>
                    <li>• Set simulation duration and time step</li>
                    <li>• Click "Run Simulation"</li>
                  </ul>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <h4 className="font-semibold text-cyan-400 mb-3">3. Visualize Results</h4>
                  <p className="text-sm mb-2">
                    After simulation, view results in the Results tab or navigate to the{' '}
                    <Link href="/visualizer" className="text-cyan-400 hover:text-cyan-300">
                      Visualizer
                    </Link>{' '}
                    for interactive 3D visualization.
                  </p>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <h4 className="font-semibold text-cyan-400 mb-3">4. Track Experiments</h4>
                  <p className="text-sm mb-2">
                    Log experiments in the{' '}
                    <Link href="/experiments" className="text-cyan-400 hover:text-cyan-300">
                      Experiment Tracker
                    </Link>{' '}
                    to compare configurations and analyze trends.
                  </p>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <h4 className="font-semibold text-cyan-400 mb-3">Example Parameters</h4>
                  <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 space-y-2 text-sm">
                    <div>
                      <p className="font-semibold text-slate-300">Fast Patterns:</p>
                      <p className="font-mono text-xs text-slate-400">f=0.04, k=0.06, D_u=1.0, D_v=0.5</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-300">Slow Spiral:</p>
                      <p className="font-mono text-xs text-slate-400">f=0.014, k=0.054, D_u=1.0, D_v=0.5</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-300">Spots:</p>
                      <p className="font-mono text-xs text-slate-400">f=0.055, k=0.062, D_u=1.0, D_v=0.5</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* References Tab */}
          <TabsContent value="references" className="space-y-6">
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle>References & Further Reading</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-slate-300">
                <div>
                  <h4 className="font-semibold text-amber-400 mb-3">Foundational Theory</h4>
                  <ul className="text-sm space-y-2">
                    <li className="border-l-2 border-slate-700 pl-3">
                      <strong>Turing, A. M. (1952).</strong> The chemical basis of morphogenesis.{' '}
                      <em>Philosophical Transactions of the Royal Society</em>, 237(641), 37-72.
                    </li>
                    <li className="border-l-2 border-slate-700 pl-3">
                      <strong>Gray-Scott Model.</strong> Classic reaction-diffusion system producing diverse patterns.
                      See <a href="https://www.karlsims.com/rd.html" className="text-cyan-400 hover:text-cyan-300">
                        Karl Sims&apos; visual exploration
                      </a>.
                    </li>
                  </ul>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <h4 className="font-semibold text-amber-400 mb-3">Soft Robotics</h4>
                  <ul className="text-sm space-y-2">
                    <li className="border-l-2 border-slate-700 pl-3">
                      <strong>Laschi, C., et al. (2016).</strong> Soft robotics: Technologies and systems pushing the
                      boundaries of robot abilities. <em>Science Robotics</em>, 1(1).
                    </li>
                    <li className="border-l-2 border-slate-700 pl-3">
                      <strong>Rus, D., & Tolley, M. T. (2015).</strong> Design, fabrication and control of soft robots.
                      <em>Nature</em>, 521(7553), 467-475.
                    </li>
                  </ul>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <h4 className="font-semibold text-amber-400 mb-3">Neuromorphic Computing</h4>
                  <ul className="text-sm space-y-2">
                    <li className="border-l-2 border-slate-700 pl-3">
                      <strong>Maass, W. (1997).</strong> Networks of spiking neurons: The third generation of neural network
                      models. <em>Neural Networks</em>, 10(9), 1659-1671.
                    </li>
                    <li className="border-l-2 border-slate-700 pl-3">
                      <strong>Izhikevich, E. M. (2003).</strong> Simple model of spiking neurons.
                      <em>IEEE Transactions on Neural Networks</em>, 14(6), 1569-1572.
                    </li>
                  </ul>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <h4 className="font-semibold text-amber-400 mb-3">Differentiable Physics</h4>
                  <ul className="text-sm space-y-2">
                    <li className="border-l-2 border-slate-700 pl-3">
                      <strong>de Avila Belbute-Peres, F., et al. (2018).</strong> Learning to simulate.{' '}
                      <em>NeurIPS</em>, 31.
                    </li>
                    <li className="border-l-2 border-slate-700 pl-3">
                      <strong>Qiao, Y. L., et al. (2021).</strong> Efficient differentiable simulation of articulated
                      bodies with contact. <em>ICML</em>.
                    </li>
                  </ul>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <h4 className="font-semibold text-amber-400 mb-3">Evolutionary Optimization</h4>
                  <ul className="text-sm space-y-2">
                    <li className="border-l-2 border-slate-700 pl-3">
                      <strong>Cully, A., et al. (2015).</strong> Robots that can adapt like animals.{' '}
                      <em>Nature</em>, 521(7553), 503-508.
                    </li>
                    <li className="border-l-2 border-slate-700 pl-3">
                      <strong>MAP-Elites:</strong> Quality-diversity algorithm for finding diverse high-performing solutions.
                    </li>
                  </ul>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <h4 className="font-semibold text-amber-400 mb-3">Software & Tools</h4>
                  <ul className="text-sm space-y-2">
                    <li className="border-l-2 border-slate-700 pl-3">
                      <strong>JAX:</strong>{' '}
                      <a href="https://jax.readthedocs.io" className="text-cyan-400 hover:text-cyan-300">
                        Composable transformations of Python+NumPy programs
                      </a>
                    </li>
                    <li className="border-l-2 border-slate-700 pl-3">
                      <strong>Three.js:</strong>{' '}
                      <a href="https://threejs.org" className="text-cyan-400 hover:text-cyan-300">
                        JavaScript 3D library
                      </a>
                    </li>
                    <li className="border-l-2 border-slate-700 pl-3">
                      <strong>React Three Fiber:</strong> React renderer for Three.js
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 pt-12 border-t border-slate-800">
          <p className="text-center text-sm text-slate-500">
            Morphogenetic Soft Robot Controller Research Platform • Documentation © 2024
          </p>
        </div>
      </main>
    </div>
  )
}
