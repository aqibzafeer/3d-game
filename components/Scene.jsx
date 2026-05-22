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

  useFrame((_, delta) => {
    const target = mode === 'menu' ? menuPos : playPos
    camera.position.lerp(new Vector3(target[0], target[1], target[2]), 0.08)
    camera.lookAt(0, 1, 0)
    if (controls.current) controls.current.enabled = (mode === 'menu')
  })

  return <OrbitControls ref={controls} />
}

export default function Scene({ onLoadAnimations }) {
  const { mode } = useGame()
  return (
    <div className="canvas-wrap">
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
