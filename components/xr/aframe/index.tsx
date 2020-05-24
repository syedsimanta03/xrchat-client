/* eslint-disable no-prototype-builtins */
import arrowComp from './arrow'
import clickableComp from './clickable'
import eaccubeComp from './eaccube'
import gridComp from './grid'
import gridCellComp from './grid-cell'
import highlightComp from './highlight'
import mediaCellComp from './media-cell'
import playerComp from './player'
import playerVrUiComp from './video-player-vr-ui'
import textCell from './text-cell'
import videoDetails from './video-details'

import AFRAME from 'aframe'

type ComponentSystem = {
  name: string
  system?: AFRAME.SystemDefinition
  component?: AFRAME.ComponentDefinition
  primitive?: AFRAME.PrimitiveDefinition
  shader?: AFRAME.ShaderDefinition
}

const ComponentSystemArray: ComponentSystem[] = [
  arrowComp,
  clickableComp,
  eaccubeComp,
  gridComp,
  gridCellComp,
  highlightComp,
  mediaCellComp,
  playerComp,
  playerVrUiComp,
  textCell,
  videoDetails
]

const RegisterComponentSystem = (compsys: ComponentSystem): void => {
  if (compsys.system && !AFRAME.systems.hasOwnProperty(compsys.name)) {
    AFRAME.registerSystem(compsys.name, compsys.system)
  }
  if (compsys.component && !AFRAME.components.hasOwnProperty(compsys.name)) {
    AFRAME.registerComponent(compsys.name, compsys.component)
  }
  if (
    compsys.primitive &&
    !AFRAME.primitives.primitives.hasOwnProperty('a-' + compsys.name)
  ) {
    AFRAME.registerPrimitive('a-' + compsys.name, compsys.primitive)
  }
  if (compsys.shader && !AFRAME.shaders.hasOwnProperty(compsys.name)) {
    AFRAME.registerShader(compsys.name, compsys.shader)
  }
}
export const AframeComponentRegisterer = () => {
  ComponentSystemArray.forEach((compsys) => {
    RegisterComponentSystem(compsys)
  })

  return null
}

export default AframeComponentRegisterer
