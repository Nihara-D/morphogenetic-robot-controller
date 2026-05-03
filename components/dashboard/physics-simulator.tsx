'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface PhysicsSimulatorProps {
  onResultsUpdate: (results: any) => void
}

export default function PhysicsSimulator({ onResultsUpdate }: PhysicsSimulatorProps) {
  const [meshShape, setMeshShape] = useState('cube')
  const [youngsModulus, setYoungsModulus] = useState('100000')
  const [poissonRatio, setPoissonRatio] = useState('0.4')
  const [damping, setDamping] = useState('0.05')
  const [numSteps, setNumSteps] = useState('100')
  const [dt, setDt] = useState('0.01')
  const [actuationMagnitude, setActuationMagnitude] = useState('0.1')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSimulate = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/simulation/physics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mesh: {
            shape: meshShape,
          },
          material: {
            youngs_modulus: parseFloat(youngsModulus),
            poisson_ratio: parseFloat(poissonRatio),
            damping: parseFloat(damping),
          },
          actuation_field: Array(64).fill(parseFloat(actuationMagnitude)),
          num_steps: parseInt(numSteps),
          dt: parseFloat(dt),
        }),
      })

      if (!response.ok) {
        throw new Error('Simulation failed')
      }

      const data = await response.json()
      
      if (data.status === 'success') {
        setSuccess(`Simulation completed: ${data.data.num_vertices} vertices, ${data.data.num_steps} steps`)
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
        <CardTitle className="text-orange-400">Soft Body Physics Simulator</CardTitle>
        <CardDescription>
          FEM-based deformable body with actuation forces
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mesh Configuration */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-200">Mesh Configuration</h3>
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

        {/* Material Properties */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-200">Material Properties</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Young&apos;s Modulus (Pa)</FieldLabel>
              <Input
                type="number"
                value={youngsModulus}
                onChange={(e) => setYoungsModulus(e.target.value)}
                min="10000"
                max="1000000"
                step="10000"
                className="bg-slate-800 border-slate-700"
                placeholder="100000"
              />
            </Field>
            <Field>
              <FieldLabel>Poisson&apos;s Ratio</FieldLabel>
              <Input
                type="number"
                value={poissonRatio}
                onChange={(e) => setPoissonRatio(e.target.value)}
                min="0.0"
                max="0.5"
                step="0.01"
                className="bg-slate-800 border-slate-700"
                placeholder="0.4"
              />
            </Field>
          </div>
          <Field>
            <FieldLabel>Damping Factor</FieldLabel>
            <Input
              type="number"
              value={damping}
              onChange={(e) => setDamping(e.target.value)}
              min="0.0"
              max="1.0"
              step="0.01"
              className="bg-slate-800 border-slate-700"
              placeholder="0.05"
            />
          </Field>
        </div>

        {/* Actuation */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-200">Actuation</h3>
          <Field>
            <FieldLabel>Actuation Magnitude</FieldLabel>
            <Input
              type="number"
              value={actuationMagnitude}
              onChange={(e) => setActuationMagnitude(e.target.value)}
              min="0.0"
              max="1.0"
              step="0.05"
              className="bg-slate-800 border-slate-700"
              placeholder="0.1"
            />
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
          className="w-full bg-orange-600 hover:bg-orange-700"
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
