'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface MeshVisualizerProps {
  data: {
    vertices: number[][]
    tetrahedra: number[][]
    trajectory?: any[]
  }
}

export default function MeshVisualizer({ data }: MeshVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const meshRef = useRef<THREE.Mesh | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0f172a)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 3
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create mesh from vertices and tetrahedra
    const geometry = new THREE.BufferGeometry()
    
    // Convert vertices array to flat Float32Array
    const positions = new Float32Array(data.vertices.flat())
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    // Create faces from tetrahedra
    const indices: number[] = []
    data.tetrahedra.forEach((tet) => {
      // Add 4 triangle faces per tetrahedron
      indices.push(tet[0], tet[1], tet[2])
      indices.push(tet[0], tet[1], tet[3])
      indices.push(tet[0], tet[2], tet[3])
      indices.push(tet[1], tet[2], tet[3])
    })
    
    if (indices.length > 0) {
      geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1))
    }

    geometry.computeVertexNormals()

    // Material and mesh
    const material = new THREE.MeshPhongMaterial({
      color: 0x06b6d4,
      wireframe: false,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.1,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    meshRef.current = mesh

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    // Mouse controls
    let isDragging = false
    let previousMousePosition = { x: 0, y: 0 }

    renderer.domElement.addEventListener('mousedown', (e) => {
      isDragging = true
      previousMousePosition = { x: e.clientX, y: e.clientY }
    })

    renderer.domElement.addEventListener('mousemove', (e) => {
      if (isDragging && mesh) {
        const deltaX = e.clientX - previousMousePosition.x
        const deltaY = e.clientY - previousMousePosition.y

        mesh.rotation.y += deltaX * 0.01
        mesh.rotation.x += deltaY * 0.01
      }
      previousMousePosition = { x: e.clientX, y: e.clientY }
    })

    renderer.domElement.addEventListener('mouseup', () => {
      isDragging = false
    })

    // Mouse wheel zoom
    renderer.domElement.addEventListener('wheel', (e) => {
      e.preventDefault()
      camera.position.z += e.deltaY * 0.005
      camera.position.z = Math.max(1, Math.min(20, camera.position.z))
    })

    // Animation loop
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)

      if (mesh && !isDragging) {
        mesh.rotation.x += 0.0003
        mesh.rotation.y += 0.0005
      }

      renderer.render(scene, camera)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      renderer.domElement.remove()
    }
  }, [data])

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-slate-800/30 border border-slate-700 rounded-lg overflow-hidden"
      style={{ minHeight: '600px' }}
    />
  )
}
