'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'

interface FullSimulationRunnerProps {
  onResultsUpdate: (results: any) => void
}

export default function FullSimulationRunner({ onResultsUpdate }: FullSimulationRunnerProps) {
  const [pattern, setPattern] = useState('spot')
  const [feedRate, setFeedRate] = useState('0.055')
  const [killRate, setKillRate] = useState('0.062')
  const [meshShape, setMeshShape] = useState('cube')
  const [numSteps, setNumSteps] = useState('100')
  const [dt, setDt] = useState('0.01')
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleRunFullSimulation = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)
      setProgress(0)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev
          return prev + Math.random() * 30
        })
      }, 500)

      const response = await fetch('/api/simulation/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          morphogen_params: {
            f: parseFloat(feedRate),
            k: parseFloat(killRate),
            D_u: 1.0,
            D_v: 0.5,
          },
          mesh: {
            shape: meshShape,
          },
          controller_params: {},
          initial_conditions: {
            pattern: pattern,
          },
          num_steps: parseInt(numSteps),
          dt: parseFloat(dt),
        }),
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        throw new Error('Simulation failed')
      }

      const data = await response.json()
      
      if (data.status === 'success') {
        setSuccess('Full simulation completed successfully!')
        onResultsUpdate(data.data)
      } else {
        throw new Error(data.message || 'Simulation returned error')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setProgress(0)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-slate-800 bg-slate-900/50">
      <CardHeader>
        <CardTitle className="text-purple-400">Full End-to-End Simulation</CardTitle>
        <CardDescription>
          Morphogen → Physics → Control: Complete pipeline execution
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Morphogen Configuration */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-200">Morphogen Field Parameters</h3>
          <Field>
            <FieldLabel>Initial Pattern</FieldLabel>
            <Select value={pattern} onValueChange={setPattern}>
              <SelectTrigger className="bg-slate-800 border-slate-700">
                <SelectValue placeholder="Select pattern" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="spot">Spot</SelectItem>
                <SelectItem value="stripes">Stripes</SelectItem>
                <SelectItem value="random">Random</SelectItem>
                <SelectItem value="uniform">Uniform</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Feed Rate (f)</FieldLabel>
              <Input
                type="number"
                value={feedRate}
                onChange={(e) => setFeedRate(e.target.value)}
                min="0.01"
                max="0.1"
                step="0.001"
                className="bg-slate-800 border-slate-700"
                placeholder="0.055"
              />
            </Field>
            <Field>
              <FieldLabel>Kill Rate (k)</FieldLabel>
              <Input
                type="number"
                value={killRate}
                onChange={(e) => setKillRate(e.target.value)}
                min="0.01"
                max="0.1"
                step="0.001"
                className="bg-slate-800 border-slate-700"
                placeholder="0.062"
              />
            </Field>
          </div>
        </div>

        {/* Physics Configuration */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-200">Soft Body Configuration</h3>
          <Field>
            <FieldLabel>Mesh Shape</FieldLabel>
            <Select value={meshShape} onValueChange={setMeshShape}>
              <SelectTrigger className="bg-slate-800 border-slate-700">
                <SelectValue placeholder="Select shape" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="cube">Cube</SelectItem>
                <SelectItem value="cylinder">Cylinder</SelectItem>
                <SelectItem value="sphere">Sphere</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        {/* Simulation Settings */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-200">Simulation Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Number of Steps</FieldLabel>
              <Input
                type="number"
                value={numSteps}
                onChange={(e) => setNumSteps(e.target.value)}
                min="10"
                max="1000"
                step="10"
                className="bg-slate-800 border-slate-700"
                placeholder="100"
              />
            </Field>
            <Field>
              <FieldLabel>Time Step (dt)</FieldLabel>
              <Input
                type="number"
                value={dt}
                onChange={(e) => setDt(e.target.value)}
                min="0.001"
                max="0.1"
                step="0.001"
                className="bg-slate-800 border-slate-700"
                placeholder="0.01"
              />
            </Field>
          </div>
        </div>

        {/* Progress */}
        {isLoading && progress > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Running simulation...</span>
              <span className="text-cyan-400 font-semibold">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Messages */}
        {error && (
          <Alert className="border-red-900/50 bg-red-950/30">
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="border-green-900/50 bg-green-950/30">
            <AlertDescription className="text-green-400">{success}</AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <Button
          onClick={handleRunFullSimulation}
          disabled={isLoading}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {isLoading ? (
            <>
              <Spinner className="mr-2 w-4 h-4" />
              Running Pipeline...
            </>
          ) : (
            'Run Full Simulation'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
