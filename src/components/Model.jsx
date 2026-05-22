import React, { useRef, useEffect, useState } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { useAnimations } from '@react-three/drei'
import { Color } from 'three'
import { Howl } from 'howler'
import { useGame } from './GameContext'

export default function Model({ url = '/avatar.glb', onClick, onLoaded }) {
  const group = useRef()
  const gltf = useLoader(GLTFLoader, url, loader => {
    try {
      const draco = new DRACOLoader()
      draco.setDecoderPath('/draco/')
      loader.setDRACOLoader(draco)
    } catch (e) {}
  })
  const scene = gltf.scene
  const animations = gltf.animations || []
  const api = useAnimations(animations, group)
  const { outfitColor, soundEnabled, selectedAction, setSelectedAction } = useGame()
  const [dragging, setDragging] = useState(false)
  const clickSound = useRef()

  useEffect(() => {
    // prepare optional click sound (place /sounds/click.mp3 in public)
    try {
      clickSound.current = new Howl({ src: ['/sounds/click.mp3'] })
    } catch (e) {
      clickSound.current = null
    }
  }, [])

  // report available animation clip names back to parent UI
  useEffect(() => {
    if (animations && animations.length && typeof onLoaded === 'function') {
      const names = animations.map(a => a.name).filter(Boolean)
      onLoaded(names)
      // auto-select Idle if present
      if (names.includes('Idle')) setSelectedAction('Idle')
      else if (names[0]) setSelectedAction(names[0])
    }
  }, [animations, onLoaded, setSelectedAction])

  // apply outfit color to materials
  useEffect(() => {
    if (!scene) return
    scene.traverse(child => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.color && (m.color = new Color(outfitColor)))
        } else {
          child.material.color && (child.material.color = new Color(outfitColor))
        }
        child.material.needsUpdate = true
      }
    })
  }, [scene, outfitColor])

  // handle animation playback when selectedAction changes
  useEffect(() => {
    if (!api || !api.actions) return
    const act = api.actions[selectedAction]
    if (act) {
      Object.values(api.actions).forEach(a => { if (a !== act) a.fadeOut(0.2) })
      act.reset().fadeIn(0.2).play()
    }
  }, [selectedAction, api])

  // pointer drag to rotate model
  const onPointerDown = (e) => {
    e.stopPropagation()
    setDragging(true)
    e.target.setPointerCapture(e.pointerId)
    group.current.userData.startX = e.clientX
  }

  const onPointerMove = (e) => {
    if (!dragging) return
    e.stopPropagation()
    const dx = e.clientX - (group.current.userData.startX || 0)
    const rot = dx * 0.01
    if (group.current) group.current.rotation.y = rot
  }

  const onPointerUp = (e) => {
    e.stopPropagation()
    setDragging(false)
    try { e.target.releasePointerCapture(e.pointerId) } catch (err) {}
  }

  const handleClick = (e) => {
    e.stopPropagation()
    // play click sound
    if (soundEnabled && clickSound.current) clickSound.current.play()
    // toggle to next animation in list
    if (animations && animations.length) {
      const names = animations.map(a => a.name).filter(Boolean)
      const idx = names.indexOf(selectedAction)
      const next = names[(idx + 1) % names.length]
      setSelectedAction(next)
    }
    if (typeof onClick === 'function') onClick(e)
  }

  return (
    <primitive
      ref={group}
      object={scene}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onClick={handleClick}
      dispose={null}
    />
  )
}

// Preload is not available for customized loader here.
