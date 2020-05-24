import { Entity } from 'aframe-react'

import getConfig from 'next/config'
const config = getConfig().publicRuntimeConfig.xr.environment.floor

export const Floor = () =>
  config.src ? (
    <Entity
      primitive="a-plane"
      src="#groundTexture"
      rotation="-90 0 0"
      height={config.height}
      width={config.height}
    />
  ) : (
    ''
  )

export default Floor
