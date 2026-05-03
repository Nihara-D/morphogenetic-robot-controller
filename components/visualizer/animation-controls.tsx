'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Field, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Empty } from '@/components/ui/empty'

interface AnimationControlsProps {
  meshData: any
  morphogenData: any
}

export default function AnimationControls({ meshData, morphogenData }: AnimationControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0)
  const [exportFormat, setExportFormat] = useState('json')

  const meshFrames = meshData?.trajectory?.length || 0
  const morphogenFrames = morphogenData?.trajectory?.length || 0
  const maxFrames = Math.max(meshFrames, morphogenFrames)

  if (maxFrames === 0) {
    return (
      <div className="w-full">
        <Empty
          title="No Animation Data"
          description="Load mesh or morphogen data first to access animation controls"
          icon="🎬"
        />
      </div>
    )
  }

  const handleExport = () => {
    const data: any = {}

    if (meshData) {
      data.mesh = {
        vertices: meshData.vertices,
        tetrahedra: meshData.tetrahedra,
        trajectory: meshData.trajectory,
      }
    }

    if (morphogenData) {
      data.morphogen = {
        u: morphogenData.u,
        v: morphogenData.v,
        trajectory: morphogenData.trajectory,
      }
    }

    const element = document.createElement('a')
    const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    element.href = URL.createObjectURL(file)
    element.download = `visualization-${Date.now()}.${exportFormat === 'json' ? 'json' : 'csv'}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-6">
      {/* Main Playback Control */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-purple-400">Animation Playback</CardTitle>
          <CardDescription>
            Control animation timing and export data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Frame display */}
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-300">Current Frame</h3>
              <span className="text-2xl font-bold text-purple-400">
                {currentFrame + 1} <span className="text-sm text-slate-400">/ {maxFrames}</span>
              </span>
            </div>
            <Slider
              value={[currentFrame]}
              onValueChange={(value) => setCurrentFrame(value[0])}
              min={0}
              max={maxFrames - 1}
              step={1}
              className="w-full"
            />
          </div>

          {/* Playback controls */}
          <div className="flex gap-3">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex-1 ${
                isPlaying
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </Button>
            <Button
              onClick={() => setCurrentFrame(0)}
              variant="outline"
              className="border-slate-700 hover:bg-slate-800"
            >
              ⏮ Reset
            </Button>
            <Button
              onClick={() => setCurrentFrame(maxFrames - 1)}
              variant="outline"
              className="border-slate-700 hover:bg-slate-800"
            >
              ⏭ End
            </Button>
          </div>

          {/* Speed control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <FieldLabel>Playback Speed</FieldLabel>
              <span className="text-sm font-mono text-purple-400">{playbackSpeed.toFixed(1)}x</span>
            </div>
            <Slider
              value={[playbackSpeed]}
              onValueChange={(value) => setPlaybackSpeed(value[0])}
              min={0.25}
              max={2.0}
              step={0.25}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Summary */}
      <div className="grid md:grid-cols-2 gap-4">
        {meshData && (
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-sm text-cyan-400">Mesh Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-400">
              <div className="flex justify-between">
                <span>Vertices:</span>
                <span className="font-mono text-slate-300">{meshData.vertices?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Tetrahedra:</span>
                <span className="font-mono text-slate-300">{meshData.tetrahedra?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Frames:</span>
                <span className="font-mono text-slate-300">{meshFrames}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {morphogenData && (
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-sm text-orange-400">Morphogen Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-400">
              <div className="flex justify-between">
                <span>Resolution:</span>
                <span className="font-mono text-slate-300">
                  {morphogenData.u?.length || 0}x{morphogenData.u?.[0]?.length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Components:</span>
                <span className="font-mono text-slate-300">U, V</span>
              </div>
              <div className="flex justify-between">
                <span>Frames:</span>
                <span className="font-mono text-slate-300">{morphogenFrames}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Export Options */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-sm text-amber-400">Export Data</CardTitle>
          <CardDescription>
            Download visualization data for further processing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field>
            <FieldLabel>Export Format</FieldLabel>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger className="bg-slate-800 border-slate-700">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="json">JSON (All data)</SelectItem>
                <SelectItem value="csv">CSV (Summary only)</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Button
            onClick={handleExport}
            className="w-full bg-amber-600 hover:bg-amber-700"
          >
            Download Data
          </Button>
        </CardContent>
      </Card>

      {/* Keyboard Shortcuts */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-sm text-slate-300">Keyboard Shortcuts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-slate-400">
          <div className="grid grid-cols-2 gap-2">
            <div><span className="font-semibold text-slate-300">Space</span> Toggle play</div>
            <div><span className="font-semibold text-slate-300">←/→</span> Frame step</div>
            <div><span className="font-semibold text-slate-300">Home</span> First frame</div>
            <div><span className="font-semibold text-slate-300">End</span> Last frame</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
