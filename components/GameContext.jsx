import React, { createContext, useContext, useState, useEffect } from 'react'

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [outfitColor, setOutfitColor] = useState('#ffffff')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [selectedAction, setSelectedAction] = useState('Idle')
  const [mode, setMode] = useState('menu') // 'menu' | 'play'

  const [presets, setPresets] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      const raw = window.localStorage.getItem('avatar.presets')
      return raw ? JSON.parse(raw) : []
    } catch (e) { return [] }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    try { window.localStorage.setItem('avatar.presets', JSON.stringify(presets)) } catch (e) {}
  }, [presets])

  const savePreset = (name = `Preset ${presets.length + 1}`) => {
    const p = { name, outfitColor, selectedAction }
    setPresets(prev => [...prev, p])
  }

  const applyPreset = (idx) => {
    const p = presets[idx]
    if (!p) return
    setOutfitColor(p.outfitColor)
    setSelectedAction(p.selectedAction)
  }

  return (
    <GameContext.Provider value={{ outfitColor, setOutfitColor, soundEnabled, setSoundEnabled, selectedAction, setSelectedAction, mode, setMode, presets, savePreset, applyPreset }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside GameProvider')
  return ctx
}

export default GameContext
