import { useState } from 'react'
import dynamic from 'next/dynamic'
import Menu from '../components/Menu'
import { GameProvider } from '../components/GameContext'

const Scene = dynamic(() => import('../components/Scene'), { ssr: false })

export default function Home() {
  const [clips, setClips] = useState([])

  return (
    <GameProvider>
      <div>
        <Menu actions={clips} />
        <Scene onLoadAnimations={setClips} />
      </div>
    </GameProvider>
  )
}
