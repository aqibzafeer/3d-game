import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { OrbitControls, Environment } from '@react-three/drei'
import Model from './Model'
import { useGame } from './GameContext'

function CameraController({ mode }) {
  const { camera } = useThree()
  const controls = useRef()
  const menuPos = [0, 1.5, 3]
  const playPos = [0, 1.2, 1.8]
  useFrame(() => {
    // keep camera focused on the avatar
    camera.lookAt(0, 1, 0)
  })

  // configure controls for zooming and orbit
  return (
    <OrbitControls
      ref={controls}
      enablePan={false}
      enableZoom={true}
      enableRotate={true}
      minDistance={0.5}
      maxDistance={8}
      makeDefault
    />
  )
}

export default function Scene({ onLoadAnimations, className }) {
  const { mode } = useGame()
  return (
    <div className={className ? `canvas-wrap ${className}` : 'canvas-wrap'}>
      <Canvas shadows camera={{ position: [0, 1.5, 3], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Model url="/avatar.glb" onLoaded={onLoadAnimations} />
          <Environment preset="studio" />
        </Suspense>
        <CameraController mode={mode} />
      </Canvas>
    </div>
  )
}
