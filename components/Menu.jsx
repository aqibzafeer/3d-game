import React from 'react'
import { useGame } from './GameContext'

const fallback = ['Idle', 'Wave', 'Walk', 'Run', 'Jump']

export default function Menu({ actions = [] }) {
  const list = (actions && actions.length) ? actions : fallback
  const { outfitColor, setOutfitColor, soundEnabled, setSoundEnabled, selectedAction, setSelectedAction } = useGame()
  const { presets, savePreset, applyPreset, mode, setMode } = useGame()

  const colors = ['#ffffff', '#ffcc00', '#ff7b7b', '#7bd389', '#7bbcff']

  return (
    <div className="menu">
      <h3>Avatar Menu</h3>
      <div className="buttons">
        {list.map(a => (
          <button key={a} className={a === selectedAction ? 'active' : ''} onClick={() => setSelectedAction(a)}>
            {a}
          </button>
        ))}
      </div>
      <div style={{marginTop:8}}>
        <strong>Outfit:</strong>
        <div style={{marginTop:6}}>
          {colors.map(c => (
            <button key={c} onClick={() => setOutfitColor(c)} style={{background:c,border:'1px solid #ddd',marginRight:6,width:28,height:28}} />
          ))}
        </div>
      </div>
      <div style={{marginTop:8}}>
        <label>
          <input type="checkbox" checked={soundEnabled} onChange={e => setSoundEnabled(e.target.checked)} /> Sound
        </label>
      </div>
      <div style={{marginTop:8}}>
        <button onClick={() => savePreset()}>Save Preset</button>
        <button style={{marginLeft:8}} onClick={() => setMode(mode === 'menu' ? 'play' : 'menu')}>{mode === 'menu' ? 'Play' : 'Back'}</button>
      </div>
 
    </div>
  )
}
