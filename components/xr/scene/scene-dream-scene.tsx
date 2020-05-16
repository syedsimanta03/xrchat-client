import React, { useState, useEffect } from 'react'
import SceneContainer from './scene-container'
import Environment from './environment-dream'
import Player from '../player/player'
import './style.scss'

export const DreamSceneScene = () => {
  const [state, setState] = useState({ appRendered: false })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      require('aframe')
      require('networked-aframe')
      setState({ appRendered: true })
    }
  })

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {state.appRendered && (
        <SceneContainer>
          <Environment />
          <Player />
        </SceneContainer>
      )}
    </div>
  )
}
