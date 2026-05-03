'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Experiment {
  id: string
  name: string
  parameters: Record<string, any>
  results: Record<string, any>
}

interface ExperimentComparisonProps {
  experiments: Experiment[]
}

export default function ExperimentComparison({ experiments }: ExperimentComparisonProps) {
  // Collect all parameter keys
  const allParamKeys = Array.from(
    new Set(experiments.flatMap((e) => Object.keys(e.parameters)))
  ).sort()

  // Collect all result keys
  const allResultKeys = Array.from(
    new Set(experiments.flatMap((e) => Object.keys(e.results)))
  ).sort()

  const formatValue = (value: any) => {
    if (typeof value === 'number') {
      return value.toFixed(4)
    }
    return String(value)
  }

  return (
    <div className="space-y-6">
      {/* Parameters Comparison */}
      {allParamKeys.length > 0 && (
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-cyan-400">Parameter Comparison</CardTitle>
            <CardDescription>
              Side-by-side comparison of experiment parameters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-800/50">
                  <TableRow>
                    <TableHead className="font-semibold">Parameter</TableHead>
                    {experiments.map((exp) => (
                      <TableHead key={exp.id} className="text-right">
                        <p className="font-semibold text-slate-100">{exp.name}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(exp.id.split('-')[1]).toLocaleDateString()}
                        </p>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allParamKeys.map((key) => (
                    <TableRow key={key} className="border-b border-slate-700">
                      <TableCell className="font-mono text-sm text-slate-300">{key}</TableCell>
                      {experiments.map((exp) => (
                        <TableCell key={exp.id} className="text-right font-mono text-sm">
                          <span className="text-slate-200">
                            {formatValue(exp.parameters[key] ?? '-')}
                          </span>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Comparison */}
      {allResultKeys.length > 0 && (
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-orange-400">Results Comparison</CardTitle>
            <CardDescription>
              Side-by-side comparison of experiment results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-800/50">
                  <TableRow>
                    <TableHead className="font-semibold">Metric</TableHead>
                    {experiments.map((exp) => (
                      <TableHead key={exp.id} className="text-right">
                        <p className="font-semibold text-slate-100">{exp.name}</p>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allResultKeys.map((key) => {
                    // Find best value
                    const values = experiments.map((e) => e.results[key]).filter((v) => v != null)
                    let bestExpId: string | null = null
                    if (values.length > 0 && typeof values[0] === 'number') {
                      const bestIdx = values.indexOf(Math.max(...values))
                      bestExpId = experiments[bestIdx].id
                    }

                    return (
                      <TableRow key={key} className="border-b border-slate-700">
                        <TableCell className="font-mono text-sm text-slate-300">{key}</TableCell>
                        {experiments.map((exp) => (
                          <TableCell
                            key={exp.id}
                            className={`text-right font-mono text-sm ${
                              bestExpId === exp.id ? 'bg-green-950/30' : ''
                            }`}
                          >
                            <span className="text-slate-200">
                              {formatValue(exp.results[key] ?? '-')}
                            </span>
                            {bestExpId === exp.id && (
                              <span className="ml-2 text-xs text-green-400">★</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Statistics */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-purple-400">Experiment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {experiments.map((exp) => (
              <div key={exp.id} className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
                <h4 className="font-semibold text-slate-100 mb-3">{exp.name}</h4>
                <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex justify-between">
                    <span>Parameters:</span>
                    <span className="font-mono text-slate-300">{allParamKeys.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Results:</span>
                    <span className="font-mono text-slate-300">
                      {Object.keys(exp.results).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Metrics Recorded:</span>
                    <span className="font-mono text-slate-300">
                      {allResultKeys.filter((k) => exp.results[k] != null).length} / {allResultKeys.length}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
