'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

interface MorphogenHeatmapProps {
  data: {
    u: number[][]
    v: number[][]
    trajectory?: any[]
  }
}

export default function MorphogenHeatmap({ data }: MorphogenHeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [frameIndex, setFrameIndex] = useState(0)
  const [showU, setShowU] = useState(true)
  const [showV, setShowV] = useState(false)

  const colorize = (value: number, colormap: 'viridis' | 'plasma' | 'coolwarm') => {
    // Clamp value to [0, 1]
    value = Math.max(0, Math.min(1, value))

    let r, g, b

    if (colormap === 'viridis') {
      // Viridis-like colormap
      if (value < 0.25) {
        r = 0
        g = value * 4 * 63.75
        b = 255
      } else if (value < 0.5) {
        r = 0
        g = 127.5 + (value - 0.25) * 4 * 127.5
        b = 255 - (value - 0.25) * 4 * 255
      } else if (value < 0.75) {
        r = (value - 0.5) * 4 * 255
        g = 255
        b = 0
      } else {
        r = 255
        g = 255 - (value - 0.75) * 4 * 255
        b = 0
      }
    } else if (colormap === 'coolwarm') {
      // Cool-warm diverging colormap
      if (value < 0.5) {
        r = 0
        g = value * 2 * 255
        b = 255 - value * 2 * 255
      } else {
        r = (value - 0.5) * 2 * 255
        g = 255 - (value - 0.5) * 2 * 255
        b = 0
      }
    } else {
      // Plasma-like
      r = Math.pow(value, 1.2) * 255
      g = Math.sin(value * Math.PI) * 255
      b = Math.pow(1 - value, 1.2) * 255
    }

    return {
      r: Math.round(r),
      g: Math.round(g),
      b: Math.round(b),
    }
  }

  const drawHeatmap = (field: number[][], colormap: 'viridis' | 'plasma' | 'coolwarm') => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = field.length
    const scale = canvas.width / size

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw heatmap
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const value = field[i][j]
        const color = colorize(value, colormap)

        ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`
        ctx.fillRect(i * scale, j * scale, scale, scale)
      }
    }

    // Draw grid
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= size; i += 8) {
      ctx.beginPath()
      ctx.moveTo(i * scale, 0)
      ctx.lineTo(i * scale, canvas.height)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, i * scale)
      ctx.lineTo(canvas.width, i * scale)
      ctx.stroke()
    }
  }

  useEffect(() => {
    const field = showU ? data.u : data.v
    const colormap = showU ? 'viridis' : 'coolwarm'
    drawHeatmap(field, colormap)
  }, [data, showU, showV])

  const trajectory = data.trajectory || []

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="bg-slate-800/30 border border-slate-700 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={512}
          height={512}
          className="w-full h-auto"
        />
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Field selector */}
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setShowU(true)
              setShowV(false)
            }}
            variant={showU ? 'default' : 'outline'}
            className={showU ? 'bg-blue-600 hover:bg-blue-700' : 'border-slate-700'}
          >
            U Component
          </Button>
          <Button
            onClick={() => {
              setShowU(false)
              setShowV(true)
            }}
            variant={showV ? 'default' : 'outline'}
            className={showV ? 'bg-purple-600 hover:bg-purple-700' : 'border-slate-700'}
          >
            V Component
          </Button>
        </div>

        {/* Frame slider */}
        {trajectory.length > 1 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-400">Frame</label>
              <span className="text-sm font-mono text-slate-300">
                {frameIndex + 1} / {trajectory.length}
              </span>
            </div>
            <Slider
              value={[frameIndex]}
              onValueChange={(value) => setFrameIndex(value[0])}
              min={0}
              max={trajectory.length - 1}
              step={1}
              className="w-full"
            />
          </div>
        )}

        {/* Info */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 text-sm text-slate-400 space-y-2">
          <div className="flex justify-between">
            <span>Resolution:</span>
            <span className="font-mono text-slate-300">{data.u.length}x{data.u.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Current Field:</span>
            <span className="font-mono text-slate-300">{showU ? 'U' : 'V'}</span>
          </div>
          {trajectory.length > 0 && (
            <div className="flex justify-between">
              <span>Total Frames:</span>
              <span className="font-mono text-slate-300">{trajectory.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
