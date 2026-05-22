import React, { Suspense } from 'react'
import { GameProvider } from './components/GameContext'
import Scene from './components/Scene'

export default function App() {
  return (
    <GameProvider>
      <div className="app fullscreen">
        <Scene className="fullscreen-canvas" />
      </div>
    </GameProvider>
  )
}
