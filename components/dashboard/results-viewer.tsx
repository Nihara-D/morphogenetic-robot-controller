'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Empty } from '@/components/ui/empty'

interface ResultsViewerProps {
  data: any
}

export default function ResultsViewer({ data }: ResultsViewerProps) {
  if (!data) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Empty
          title="No Results"
          description="Run a simulation to view results here"
          icon="📊"
        />
      </div>
    )
  }

  const handleExportJSON = () => {
    const element = document.createElement('a')
    const file = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'})
    element.href = URL.createObjectURL(file)
    element.download = `simulation-results-${Date.now()}.json`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleExportCSV = () => {
    // Convert results to CSV format
    let csv = 'Metric,Value\n'
    
    if (data.num_steps) csv += `Steps,${data.num_steps}\n`
    if (data.num_vertices) csv += `Vertices,${data.num_vertices}\n`
    if (data.num_tetrahedra) csv += `Tetrahedra,${data.num_tetrahedra}\n`
    if (data.actuation_magnitude) csv += `Avg Actuation,${data.actuation_magnitude}\n`
    if (data.actuation_std) csv += `Actuation Std Dev,${data.actuation_std}\n`
    if (data.best_fitness) csv += `Best Fitness,${data.best_fitness}\n`
    
    const element = document.createElement('a')
    const file = new Blob([csv], {type: 'text/csv'})
    element.href = URL.createObjectURL(file)
    element.download = `simulation-results-${Date.now()}.csv`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Simulation Results</CardTitle>
            <CardDescription>
              Data from last simulation run
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleExportJSON}
              variant="outline"
              size="sm"
              className="border-slate-700 hover:bg-slate-800"
            >
              Export JSON
            </Button>
            <Button
              onClick={handleExportCSV}
              variant="outline"
              size="sm"
              className="border-slate-700 hover:bg-slate-800"
            >
              Export CSV
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="trajectory">Trajectory</TabsTrigger>
          <TabsTrigger value="raw">Raw Data</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card className="border-slate-800 bg-slate-900/50">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Morphogen Results */}
                {data.num_steps && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-cyan-400">Morphogen Field</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Simulation Steps:</span>
                        <span className="font-mono text-slate-200">{data.num_steps}</span>
                      </div>
                      {data.grid_size && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Grid Size:</span>
                          <span className="font-mono text-slate-200">{data.grid_size}x{data.grid_size}</span>
                        </div>
                      )}
                      {data.parameters && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Feed Rate (f):</span>
                            <span className="font-mono text-slate-200">{data.parameters.f || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Kill Rate (k):</span>
                            <span className="font-mono text-slate-200">{data.parameters.k || 'N/A'}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Physics Results */}
                {data.num_vertices && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-orange-400">Soft Body Physics</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Vertices:</span>
                        <span className="font-mono text-slate-200">{data.num_vertices}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Tetrahedra:</span>
                        <span className="font-mono text-slate-200">{data.num_tetrahedra}</span>
                      </div>
                      {data.strain_field && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Max Strain:</span>
                          <span className="font-mono text-slate-200">
                            {Math.max(...data.strain_field).toFixed(4)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Controller Results */}
                {data.actuation_magnitude !== undefined && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-purple-400">Controller Output</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Avg Actuation:</span>
                        <span className="font-mono text-slate-200">
                          {data.actuation_magnitude?.toFixed(4) || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Actuation Std Dev:</span>
                        <span className="font-mono text-slate-200">
                          {data.actuation_std?.toFixed(4) || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Optimization Results */}
                {data.best_fitness !== undefined && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-amber-400">Optimization</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Objective:</span>
                        <span className="font-mono text-slate-200">{data.objective || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Best Fitness:</span>
                        <span className="font-mono text-slate-200">
                          {data.best_fitness?.toFixed(2) || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Iterations:</span>
                        <span className="font-mono text-slate-200">{data.num_iterations || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Parameters Tab */}
        <TabsContent value="parameters">
          <Card className="border-slate-800 bg-slate-900/50">
            <CardContent className="pt-6">
              {data.parameters ? (
                <pre className="bg-slate-950 border border-slate-700 rounded-lg p-4 text-xs text-slate-300 overflow-x-auto">
                  {JSON.stringify(data.parameters, null, 2)}
                </pre>
              ) : (
                <p className="text-slate-400 text-sm">No parameters available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trajectory Tab */}
        <TabsContent value="trajectory">
          <Card className="border-slate-800 bg-slate-900/50">
            <CardContent className="pt-6">
              {data.trajectory && data.trajectory.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-slate-400">
                    Trajectory frames: {data.trajectory.length}
                  </p>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {data.trajectory.slice(0, 5).map((frame: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-slate-800/30 border border-slate-700 rounded-lg p-3 text-xs"
                      >
                        <p className="text-slate-300 font-mono">
                          Step {frame.step || idx}
                        </p>
                        <p className="text-slate-500 text-xs mt-1">
                          {frame.vertices ? `${frame.vertices.length} vertices` : 'Data available'}
                        </p>
                      </div>
                    ))}
                  </div>
                  {data.trajectory.length > 5 && (
                    <p className="text-xs text-slate-500">
                      ... and {data.trajectory.length - 5} more frames
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-slate-400 text-sm">No trajectory data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Raw Data Tab */}
        <TabsContent value="raw">
          <Card className="border-slate-800 bg-slate-900/50">
            <CardContent className="pt-6">
              <pre className="bg-slate-950 border border-slate-700 rounded-lg p-4 text-xs text-slate-300 overflow-x-auto max-h-96 overflow-y-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
