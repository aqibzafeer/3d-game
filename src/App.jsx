import React, { Suspense } from 'react'
import Menu from './components/Menu'
import { GameProvider } from './components/GameContext'
import Scene from './components/Scene'
import StartScreen from './components/StartScreen'
import { useState } from 'react'

export default function App() {
  const [started, setStarted] = useState(false)

  return (
    <GameProvider>
      <div className={started ? 'app fullscreen' : 'app'}>
        {!started ? (
          <StartScreen onStart={() => setStarted(true)} />
        ) : (
          <>
            <Menu />
            <Scene className="fullscreen-canvas" />
          </>
        )}
      </div>
    </GameProvider>
  )
}
