'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MeshVisualizer from '@/components/visualizer/mesh-visualizer'
import MorphogenHeatmap from '@/components/visualizer/morphogen-heatmap'
import AnimationControls from '@/components/visualizer/animation-controls'

export const metadata = {
  title: 'Visualizer - Morphogenetic Robot Controller',
  description: '3D visualization of mesh deformation and morphogen fields',
}

export default function VisualizerPage() {
  const [meshData, setMeshData] = useState<any>(null)
  const [morphogenData, setMorphogenData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadDefaultMesh = () => {
    setIsLoading(true)
    // Simulate loading a cube mesh
    setTimeout(() => {
      setMeshData({
        vertices: generateCubeMesh(),
        tetrahedra: generateTetrahedra(),
        trajectory: generateTrajectory(),
      })
      setIsLoading(false)
    }, 1000)
  }

  const handleLoadDefaultMorphogen = () => {
    setIsLoading(true)
    // Simulate loading morphogen data
    setTimeout(() => {
      setMorphogenData({
        u: generateRandomField(64),
        v: generateRandomField(64),
        trajectory: generateMorphogenTrajectory(),
      })
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm text-slate-400 hover:text-slate-200 transition">
              ← Home
            </a>
            <h1 className="text-lg font-bold">3D Visualization</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Interactive 3D Visualization
          </h2>
          <p className="text-slate-400">
            Real-time rendering of mesh deformation and morphogen field evolution
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="mesh" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="mesh">Mesh Deformation</TabsTrigger>
            <TabsTrigger value="morphogen">Morphogen Fields</TabsTrigger>
            <TabsTrigger value="controls">Controls</TabsTrigger>
          </TabsList>

          {/* Mesh Visualization */}
          <TabsContent value="mesh" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <Card className="border-slate-800 bg-slate-900/50 h-screen">
                  <CardHeader>
                    <CardTitle className="text-cyan-400">Soft Body Mesh</CardTitle>
                    <CardDescription>
                      Real-time 3D visualization with deformation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {meshData ? (
                      <MeshVisualizer data={meshData} />
                    ) : (
                      <div className="w-full h-96 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-slate-400 mb-4">No mesh data loaded</p>
                          <Button
                            onClick={handleLoadDefaultMesh}
                            disabled={isLoading}
                            className="bg-cyan-600 hover:bg-cyan-700"
                          >
                            {isLoading ? 'Loading...' : 'Load Example Mesh'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="border-slate-800 bg-slate-900/50 sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-sm text-cyan-400">Mesh Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-400">
                    {meshData ? (
                      <>
                        <div className="flex justify-between">
                          <span>Vertices:</span>
                          <span className="text-cyan-400 font-mono">
                            {meshData.vertices?.length || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tetrahedra:</span>
                          <span className="text-cyan-400 font-mono">
                            {meshData.tetrahedra?.length || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Frames:</span>
                          <span className="text-cyan-400 font-mono">
                            {meshData.trajectory?.length || 0}
                          </span>
                        </div>
                      </>
                    ) : (
                      <p className="text-xs">Load mesh data to see info</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-slate-800 bg-slate-900/50 sticky top-64">
                  <CardHeader>
                    <CardTitle className="text-sm text-cyan-400">Interactions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs text-slate-400">
                    <p><span className="text-cyan-300 font-semibold">Drag:</span> Rotate view</p>
                    <p><span className="text-cyan-300 font-semibold">Scroll:</span> Zoom</p>
                    <p><span className="text-cyan-300 font-semibold">Right-click:</span> Pan</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Morphogen Visualization */}
          <TabsContent value="morphogen" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <Card className="border-slate-800 bg-slate-900/50">
                  <CardHeader>
                    <CardTitle className="text-orange-400">Morphogen Fields</CardTitle>
                    <CardDescription>
                      2D heatmaps of u and v components
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {morphogenData ? (
                      <MorphogenHeatmap data={morphogenData} />
                    ) : (
                      <div className="w-full h-96 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-slate-400 mb-4">No morphogen data loaded</p>
                          <Button
                            onClick={handleLoadDefaultMorphogen}
                            disabled={isLoading}
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            {isLoading ? 'Loading...' : 'Load Example Morphogen'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="border-slate-800 bg-slate-900/50 sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-sm text-orange-400">Field Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-400">
                    {morphogenData ? (
                      <>
                        <div className="flex justify-between">
                          <span>Resolution:</span>
                          <span className="text-orange-400 font-mono">64×64</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Components:</span>
                          <span className="text-orange-400 font-mono">u, v</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Frames:</span>
                          <span className="text-orange-400 font-mono">
                            {morphogenData.trajectory?.length || 0}
                          </span>
                        </div>
                      </>
                    ) : (
                      <p className="text-xs">Load morphogen data to see info</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-slate-800 bg-slate-900/50 sticky top-64">
                  <CardHeader>
                    <CardTitle className="text-sm text-orange-400">Colormaps</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs text-slate-400">
                    <div>
                      <p className="font-semibold text-orange-300 mb-1">U Component</p>
                      <div className="h-6 rounded bg-gradient-to-r from-blue-950 via-blue-500 to-yellow-400"></div>
                    </div>
                    <div>
                      <p className="font-semibold text-orange-300 mb-1">V Component</p>
                      <div className="h-6 rounded bg-gradient-to-r from-purple-950 via-purple-500 to-pink-400"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Animation Controls */}
          <TabsContent value="controls">
            <AnimationControls meshData={meshData} morphogenData={morphogenData} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

// Helper functions to generate dummy data
function generateCubeMesh() {
  const vertices = []
  const res = 4
  for (let i = 0; i < res; i++) {
    for (let j = 0; j < res; j++) {
      for (let k = 0; k < res; k++) {
        vertices.push([
          (i / res) * 2 - 1,
          (j / res) * 2 - 1,
          (k / res) * 2 - 1,
        ])
      }
    }
  }
  return vertices
}

function generateTetrahedra() {
  return Array.from({ length: 20 }, (_, i) => [
    Math.floor(Math.random() * 64),
    Math.floor(Math.random() * 64),
    Math.floor(Math.random() * 64),
    Math.floor(Math.random() * 64),
  ])
}

function generateTrajectory() {
  return Array.from({ length: 10 }, (_, step) => ({
    step,
    vertices: generateCubeMesh().map((v) => [
      v[0] + Math.sin(step * 0.1) * 0.1,
      v[1] + Math.cos(step * 0.1) * 0.1,
      v[2],
    ]),
  }))
}

function generateRandomField(size: number) {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.random())
  )
}

function generateMorphogenTrajectory() {
  return Array.from({ length: 10 }, (_, step) => ({
    step,
    u: generateRandomField(64),
    v: generateRandomField(64),
  }))
}
