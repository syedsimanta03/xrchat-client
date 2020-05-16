import Layout from '../components/ui/Layout'
import React from 'react'

import dynamic from 'next/dynamic'
const Scene = dynamic(
  () => import('../components/xr/scene/scene-environment'),
  { ssr: false }
)

export const Environment = () => {
  return (
    <Layout pageTitle="Environment">
      <Scene />
    </Layout>
  )
}
