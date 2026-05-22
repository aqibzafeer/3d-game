import React from 'react'
import Scene from './Scene'

export default function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <div className="start-content">
        <h1>3D Avatar</h1>
        <div className="preview">
          <Scene className="preview-canvas" />
        </div>
        <button className="start-button" onClick={onStart}>Enter</button>
        <p className="start-hint">Tap to enter — optimized for mobile first</p>
      </div>
    </div>
  )
}
