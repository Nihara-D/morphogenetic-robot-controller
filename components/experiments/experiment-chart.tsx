'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Experiment {
  id: string
  name: string
  timestamp: string
  parameters: Record<string, any>
  results: Record<string, any>
}

interface ExperimentChartProps {
  experiments: Experiment[]
}

export default function ExperimentChart({ experiments }: ExperimentChartProps) {
  if (experiments.length === 0) {
    return (
      <Card className="border-slate-800 bg-slate-900/50">
        <CardContent className="pt-12 text-center">
          <p className="text-slate-400">No experiments to analyze</p>
        </CardContent>
      </Card>
    )
  }

  // Prepare data for timeline chart
  const timelineData = experiments
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((exp, idx) => ({
      index: idx + 1,
      name: exp.name,
      ...Object.keys(exp.results).reduce(
        (acc, key) => {
          const value = exp.results[key]
          if (typeof value === 'number') {
            acc[key] = value
          }
          return acc
        },
        {} as Record<string, number>
      ),
    }))

  // Extract numeric results for charting
  const numericResults: Record<string, number[]> = {}
  experiments.forEach((exp) => {
    Object.entries(exp.results).forEach(([key, value]) => {
      if (typeof value === 'number') {
        if (!numericResults[key]) {
          numericResults[key] = []
        }
        numericResults[key].push(value)
      }
    })
  })

  const parameterKeys = Object.keys(experiments[0].parameters || {})

  // Prepare parameter comparison data
  const parameterData = parameterKeys.map((key) => ({
    parameter: key,
    ...experiments.reduce(
      (acc, exp, idx) => {
        acc[`exp_${idx}`] = exp.parameters[key]
        return acc
      },
      {} as Record<string, any>
    ),
  }))

  const colors = ['#06b6d4', '#f97316', '#a855f7', '#10b981', '#f59e0b']

  return (
    <div className="space-y-6">
      {/* Results Timeline */}
      {timelineData.length > 0 && Object.keys(numericResults).length > 0 && (
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-cyan-400">Results Timeline</CardTitle>
            <CardDescription>
              Numeric results over experiment sequence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis 
                    dataKey="index" 
                    stroke="rgba(148,163,184,0.5)"
                  />
                  <YAxis stroke="rgba(148,163,184,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend />
                  {Object.keys(numericResults).slice(0, 3).map((key, idx) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={colors[idx % colors.length]}
                      dot={{ r: 4 }}
                      name={key}
                      connectNulls
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Parameter Distribution */}
      {parameterData.length > 0 && experiments.length > 1 && (
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-orange-400">Parameter Distribution</CardTitle>
            <CardDescription>
              Comparison of parameter values across experiments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={parameterData.slice(0, 6)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis 
                    dataKey="parameter" 
                    stroke="rgba(148,163,184,0.5)"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis stroke="rgba(148,163,184,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend />
                  {experiments.map((_, idx) => (
                    <Bar
                      key={idx}
                      dataKey={`exp_${idx}`}
                      fill={colors[idx % colors.length]}
                      name={experiments[idx].name}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Summary */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-purple-400">Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <p className="text-sm text-slate-400 mb-1">Total Experiments</p>
              <p className="text-3xl font-bold text-cyan-400">{experiments.length}</p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <p className="text-sm text-slate-400 mb-1">Avg Results Recorded</p>
              <p className="text-3xl font-bold text-orange-400">
                {(
                  experiments.reduce((sum, e) => sum + Object.keys(e.results).length, 0) /
                  experiments.length
                ).toFixed(1)}
              </p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <p className="text-sm text-slate-400 mb-1">Parameters Used</p>
              <p className="text-3xl font-bold text-purple-400">{parameterKeys.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Statistics */}
      {Object.keys(numericResults).length > 0 && (
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-amber-400">Result Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(numericResults).map(([key, values]) => {
                const sorted = [...values].sort((a, b) => a - b)
                const mean = values.reduce((a, b) => a + b, 0) / values.length
                const min = sorted[0]
                const max = sorted[sorted.length - 1]
                const median = sorted[Math.floor(sorted.length / 2)]

                return (
                  <div key={key} className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
                    <p className="font-mono font-semibold text-slate-200 mb-3">{key}</p>
                    <div className="grid grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-slate-400 text-xs mb-1">Mean</p>
                        <p className="font-mono text-slate-300">{mean.toFixed(4)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-1">Min</p>
                        <p className="font-mono text-slate-300">{min.toFixed(4)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-1">Median</p>
                        <p className="font-mono text-slate-300">{median.toFixed(4)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-1">Max</p>
                        <p className="font-mono text-slate-300">{max.toFixed(4)}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
