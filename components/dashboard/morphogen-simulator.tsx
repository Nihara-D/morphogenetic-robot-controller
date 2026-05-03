'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface MorphogenSimulatorProps {
  onResultsUpdate: (results: any) => void
}

export default function MorphogenSimulator({ onResultsUpdate }: MorphogenSimulatorProps) {
  const [pattern, setPattern] = useState('spot')
  const [feedRate, setFeedRate] = useState('0.055')
  const [killRate, setKillRate] = useState('0.062')
  const [diffusionU, setDiffusionU] = useState('1.0')
  const [diffusionV, setDiffusionV] = useState('0.5')
  const [numSteps, setNumSteps] = useState('100')
  const [dt, setDt] = useState('0.01')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSimulate = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/simulation/morphogen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          initial_conditions: {
            pattern: pattern,
          },
          parameters: {
            f: parseFloat(feedRate),
            k: parseFloat(killRate),
            D_u: parseFloat(diffusionU),
            D_v: parseFloat(diffusionV),
          },
          num_steps: parseInt(numSteps),
          dt: parseFloat(dt),
        }),
      })

      if (!response.ok) {
        throw new Error('Simulation failed')
      }

      const data = await response.json()
      
      if (data.status === 'success') {
        setSuccess(`Simulation completed: ${data.data.num_steps} steps`)
        onResultsUpdate(data.data)
      } else {
        throw new Error(data.message || 'Simulation returned error')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-slate-800 bg-slate-900/50">
      <CardHeader>
        <CardTitle className="text-cyan-400">Morphogen Field Simulator</CardTitle>
        <CardDescription>
          Gray-Scott reaction-diffusion pattern generation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Initial Conditions */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-200">Initial Conditions</h3>
          <Field>
            <FieldLabel>Pattern Type</FieldLabel>
            <Select value={pattern} onValueChange={setPattern}>
              <SelectTrigger className="bg-slate-800 border-slate-700">
                <SelectValue placeholder="Select pattern" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="spot">Spot (localized)</SelectItem>
                <SelectItem value="stripes">Stripes (periodic)</SelectItem>
                <SelectItem value="random">Random</SelectItem>
                <SelectItem value="uniform">Uniform</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        {/* Parameters */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-200">Gray-Scott Parameters</h3>
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
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Diffusion U (D_u)</FieldLabel>
              <Input
                type="number"
                value={diffusionU}
                onChange={(e) => setDiffusionU(e.target.value)}
                min="0.5"
                max="2.0"
                step="0.1"
                className="bg-slate-800 border-slate-700"
                placeholder="1.0"
              />
            </Field>
            <Field>
              <FieldLabel>Diffusion V (D_v)</FieldLabel>
              <Input
                type="number"
                value={diffusionV}
                onChange={(e) => setDiffusionV(e.target.value)}
                min="0.2"
                max="1.0"
                step="0.05"
                className="bg-slate-800 border-slate-700"
                placeholder="0.5"
              />
            </Field>
          </div>
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
          onClick={handleSimulate}
          disabled={isLoading}
          className="w-full bg-cyan-600 hover:bg-cyan-700"
        >
          {isLoading ? (
            <>
              <Spinner className="mr-2 w-4 h-4" />
              Simulating...
            </>
          ) : (
            'Run Simulation'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
