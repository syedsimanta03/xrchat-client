import React from 'react'
import dynamic from 'next/dynamic'

const Scene = dynamic(() => import('./scene-dream'), { ssr: false })

export const SceneRoot = () => <Scene />
