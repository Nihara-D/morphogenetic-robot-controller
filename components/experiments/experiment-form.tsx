'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ExperimentFormProps {
  onSubmit: (experiment: any) => void
}

export default function ExperimentForm({ onSubmit }: ExperimentFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [feedRate, setFeedRate] = useState('0.055')
  const [killRate, setKillRate] = useState('0.062')
  const [diffusionU, setDiffusionU] = useState('1.0')
  const [diffusionV, setDiffusionV] = useState('0.5')
  const [meshShape, setMeshShape] = useState('cube')
  const [objective, setObjective] = useState('locomotion_speed')
  const [notes, setNotes] = useState('')
  const [tags, setTags] = useState('')
  const [results, setResults] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      alert('Please enter an experiment name')
      return
    }

    setIsSubmitting(true)

    try {
      const tagsArray = tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0)

      const experiment = {
        name,
        description,
        timestamp: new Date().toISOString(),
        parameters: {
          feed_rate: parseFloat(feedRate),
          kill_rate: parseFloat(killRate),
          D_u: parseFloat(diffusionU),
          D_v: parseFloat(diffusionV),
          mesh_shape: meshShape,
          objective: objective,
        },
        results: results ? JSON.parse(results) : {},
        notes,
        tags: tagsArray,
      }

      onSubmit(experiment)
      
      // Reset form
      setName('')
      setDescription('')
      setNotes('')
      setTags('')
      setResults('')
      setSuccess(true)
      
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      alert('Error parsing results JSON')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-slate-800 bg-slate-900/50">
      <CardHeader>
        <CardTitle className="text-cyan-400">Create New Experiment</CardTitle>
        <CardDescription>
          Log a new simulation configuration and results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-200">Basic Information</h3>
            <Field>
              <FieldLabel>Experiment Name</FieldLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Fast Locomotion Gait v1"
                className="bg-slate-800 border-slate-700"
                required
              />
            </Field>
            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of what you&apos;re testing..."
                className="bg-slate-800 border-slate-700 resize-none"
                rows={2}
              />
            </Field>
          </div>

          {/* Morphogen Parameters */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-200">Morphogen Parameters</h3>
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
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Diffusion U</FieldLabel>
                <Input
                  type="number"
                  value={diffusionU}
                  onChange={(e) => setDiffusionU(e.target.value)}
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  className="bg-slate-800 border-slate-700"
                />
              </Field>
              <Field>
                <FieldLabel>Diffusion V</FieldLabel>
                <Input
                  type="number"
                  value={diffusionV}
                  onChange={(e) => setDiffusionV(e.target.value)}
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  className="bg-slate-800 border-slate-700"
                />
              </Field>
            </div>
          </div>

          {/* Physics Configuration */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-200">Physics Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Mesh Shape</FieldLabel>
                <Select value={meshShape} onValueChange={setMeshShape}>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="cube">Cube</SelectItem>
                    <SelectItem value="cylinder">Cylinder</SelectItem>
                    <SelectItem value="sphere">Sphere</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Optimization Objective</FieldLabel>
                <Select value={objective} onValueChange={setObjective}>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="locomotion_speed">Locomotion Speed</SelectItem>
                    <SelectItem value="energy_efficiency">Energy Efficiency</SelectItem>
                    <SelectItem value="stability">Stability</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-200">Results (Optional)</h3>
            <Field>
              <FieldLabel>Results JSON</FieldLabel>
              <Textarea
                value={results}
                onChange={(e) => setResults(e.target.value)}
                placeholder='{"best_fitness": 0.85, "iterations": 100, ...}'
                className="bg-slate-800 border-slate-700 resize-none font-mono text-xs"
                rows={4}
              />
            </Field>
          </div>

          {/* Tags and Notes */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-200">Tags & Notes</h3>
            <Field>
              <FieldLabel>Tags (comma-separated)</FieldLabel>
              <Input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., fast, optimized, baseline"
                className="bg-slate-800 border-slate-700"
              />
            </Field>
            <Field>
              <FieldLabel>Notes</FieldLabel>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional observations, challenges, future work..."
                className="bg-slate-800 border-slate-700 resize-none"
                rows={3}
              />
            </Field>
          </div>

          {/* Success Message */}
          {success && (
            <Alert className="border-green-900/50 bg-green-950/30">
              <AlertDescription className="text-green-400">
                Experiment saved successfully!
              </AlertDescription>
            </Alert>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-cyan-600 hover:bg-cyan-700"
          >
            {isSubmitting ? 'Saving...' : 'Save Experiment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
