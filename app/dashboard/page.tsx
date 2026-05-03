'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Spinner } from '@/components/ui/spinner'
import MorphogenSimulator from '@/components/dashboard/morphogen-simulator'
import PhysicsSimulator from '@/components/dashboard/physics-simulator'
import FullSimulationRunner from '@/components/dashboard/full-simulation-runner'
import ResultsViewer from '@/components/dashboard/results-viewer'

export const metadata = {
  title: 'Dashboard - Morphogenetic Robot Controller',
  description: 'Parameter control and simulation interface',
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('morphogen')
  const [lastResults, setLastResults] = useState<Record<string, any> | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm text-slate-400 hover:text-slate-200 transition">
              ← Home
            </a>
            <h1 className="text-lg font-bold">Research Dashboard</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Simulation Control Panel
          </h2>
          <p className="text-slate-400">
            Run morphogen field, physics, and controller simulations with customizable parameters
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="morphogen" className="text-sm">
              Morphogen Fields
            </TabsTrigger>
            <TabsTrigger value="physics" className="text-sm">
              Soft Body Physics
            </TabsTrigger>
            <TabsTrigger value="full" className="text-sm">
              Full Simulation
            </TabsTrigger>
            <TabsTrigger value="results" className="text-sm">
              Results
            </TabsTrigger>
          </TabsList>

          {/* Tab: Morphogen Simulator */}
          <TabsContent value="morphogen" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MorphogenSimulator onResultsUpdate={setLastResults} />
              </div>
              <div>
                <Card className="border-slate-800 bg-slate-900/50 sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-cyan-400">Quick Guide</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-slate-400">
                    <div>
                      <p className="font-semibold text-cyan-300 mb-2">Initial Pattern</p>
                      <p className="text-xs">
                        Choose starting condition: spot creates localized pattern, stripes create periodic patterns
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-cyan-300 mb-2">Feed Rate (f)</p>
                      <p className="text-xs">Controls pattern creation (0.01 - 0.1)</p>
                    </div>
                    <div>
                      <p className="font-semibold text-cyan-300 mb-2">Kill Rate (k)</p>
                      <p className="text-xs">Controls pattern dissolution (0.01 - 0.1)</p>
                    </div>
                    <div>
                      <p className="font-semibold text-cyan-300 mb-2">Diffusion Rates</p>
                      <p className="text-xs">D_u and D_v control pattern wavelength and speed</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Tab: Physics Simulator */}
          <TabsContent value="physics" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PhysicsSimulator onResultsUpdate={setLastResults} />
              </div>
              <div>
                <Card className="border-slate-800 bg-slate-900/50 sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-orange-400">Quick Guide</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-slate-400">
                    <div>
                      <p className="font-semibold text-orange-300 mb-2">Mesh Shape</p>
                      <p className="text-xs">
                        Choose deformable object: cube, cylinder, or sphere
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-orange-300 mb-2">Young&apos;s Modulus</p>
                      <p className="text-xs">Stiffness (higher = less deformable)</p>
                    </div>
                    <div>
                      <p className="font-semibold text-orange-300 mb-2">Damping</p>
                      <p className="text-xs">Energy loss per step (0 = no loss, 1 = full stop)</p>
                    </div>
                    <div>
                      <p className="font-semibold text-orange-300 mb-2">Actuation Field</p>
                      <p className="text-xs">Force pattern applied to vertices</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Tab: Full Simulation */}
          <TabsContent value="full" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FullSimulationRunner onResultsUpdate={setLastResults} />
              </div>
              <div>
                <Card className="border-slate-800 bg-slate-900/50 sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-purple-400">Pipeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-slate-400">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500 flex items-center justify-center text-xs font-bold text-cyan-400">
                          1
                        </div>
                        <span>Morphogen field evolution</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500 flex items-center justify-center text-xs font-bold text-orange-400">
                          2
                        </div>
                        <span>Soft body physics with actuation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center text-xs font-bold text-purple-400">
                          3
                        </div>
                        <span>Neural controller output</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Tab: Results */}
          <TabsContent value="results">
            <ResultsViewer data={lastResults} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
