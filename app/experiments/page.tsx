'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import ExperimentForm from '@/components/experiments/experiment-form'
import ExperimentComparison from '@/components/experiments/experiment-comparison'
import ExperimentChart from '@/components/experiments/experiment-chart'

export const metadata = {
  title: 'Experiments - Morphogenetic Robot Controller',
  description: 'Track and compare simulation experiments',
}

interface Experiment {
  id: string
  name: string
  description: string
  timestamp: string
  parameters: Record<string, any>
  results: Record<string, any>
  notes: string
  tags: string[]
}

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [selectedExperiments, setSelectedExperiments] = useState<string[]>([])
  const [filterTag, setFilterTag] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')

  // Load experiments from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('morpho-experiments')
    if (saved) {
      try {
        setExperiments(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load experiments')
      }
    }
  }, [])

  // Save experiments to localStorage
  useEffect(() => {
    localStorage.setItem('morpho-experiments', JSON.stringify(experiments))
  }, [experiments])

  const handleAddExperiment = (newExperiment: Omit<Experiment, 'id'>) => {
    const experiment: Experiment = {
      id: `exp-${Date.now()}`,
      ...newExperiment,
    }
    setExperiments([experiment, ...experiments])
  }

  const handleDeleteExperiment = (id: string) => {
    setExperiments(experiments.filter((e) => e.id !== id))
    setSelectedExperiments(selectedExperiments.filter((x) => x !== id))
  }

  const handleToggleSelection = (id: string) => {
    setSelectedExperiments((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleExportAll = () => {
    const element = document.createElement('a')
    const file = new Blob([JSON.stringify(experiments, null, 2)], {
      type: 'application/json',
    })
    element.href = URL.createObjectURL(file)
    element.download = `experiments-${Date.now()}.json`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const filteredExperiments = experiments.filter((exp) => {
    const matchesSearch =
      exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = !filterTag || exp.tags.includes(filterTag)
    return matchesSearch && matchesTag
  })

  const allTags = Array.from(
    new Set(experiments.flatMap((e) => e.tags))
  )

  const selectedData = experiments.filter((e) => selectedExperiments.includes(e.id))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm text-slate-400 hover:text-slate-200 transition">
              ← Home
            </a>
            <h1 className="text-lg font-bold">Experiment Tracker</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Experiment Management
          </h2>
          <p className="text-slate-400">
            Log, track, and compare simulation configurations and results
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="new" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="new">New Experiment</TabsTrigger>
            <TabsTrigger value="list">All Experiments ({experiments.length})</TabsTrigger>
            <TabsTrigger value="compare">Compare</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          {/* New Experiment Tab */}
          <TabsContent value="new">
            <ExperimentForm onSubmit={handleAddExperiment} />
          </TabsContent>

          {/* All Experiments Tab */}
          <TabsContent value="list" className="space-y-6">
            {/* Filters */}
            <Card className="border-slate-800 bg-slate-900/50">
              <CardContent className="pt-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <Field>
                    <FieldLabel>Search</FieldLabel>
                    <Input
                      placeholder="Search experiments..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-slate-800 border-slate-700"
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Filter by Tag</FieldLabel>
                    <select
                      value={filterTag}
                      onChange={(e) => setFilterTag(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200"
                    >
                      <option value="">All Tags</option>
                      {allTags.map((tag) => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <div className="flex items-end gap-2">
                    <Button
                      onClick={handleExportAll}
                      className="bg-cyan-600 hover:bg-cyan-700"
                    >
                      Export All
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Experiments Table */}
            <Card className="border-slate-800 bg-slate-900/50 overflow-hidden">
              {filteredExperiments.length === 0 ? (
                <CardContent className="pt-12 text-center">
                  <p className="text-slate-400">No experiments found</p>
                </CardContent>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-800/50 border-b border-slate-700">
                      <TableRow>
                        <TableHead className="w-12">
                          <input
                            type="checkbox"
                            checked={selectedExperiments.length === filteredExperiments.length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedExperiments(filteredExperiments.map((e) => e.id))
                              } else {
                                setSelectedExperiments([])
                              }
                            }}
                            className="cursor-pointer"
                          />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExperiments.map((exp) => (
                        <TableRow
                          key={exp.id}
                          className="border-b border-slate-700 hover:bg-slate-800/30"
                        >
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedExperiments.includes(exp.id)}
                              onChange={() => handleToggleSelection(exp.id)}
                              className="cursor-pointer"
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-semibold text-slate-100">{exp.name}</p>
                              <p className="text-xs text-slate-400">{exp.description}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-slate-400">
                            {new Date(exp.timestamp).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {exp.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-block px-2 py-1 text-xs rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              onClick={() => handleDeleteExperiment(exp.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Compare Tab */}
          <TabsContent value="compare">
            {selectedData.length === 0 ? (
              <Card className="border-slate-800 bg-slate-900/50">
                <CardContent className="pt-12 text-center">
                  <p className="text-slate-400 mb-4">Select experiments to compare</p>
                  <p className="text-sm text-slate-500">
                    Choose at least 2 experiments from the list above
                  </p>
                </CardContent>
              </Card>
            ) : (
              <ExperimentComparison experiments={selectedData} />
            )}
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis">
            <ExperimentChart experiments={experiments} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
