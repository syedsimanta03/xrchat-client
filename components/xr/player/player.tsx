
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectInVrModeState } from '../../../redux/app/selector'

import DeviceDetector from 'device-detector-js'

// @ts-ignore
import { Entity } from 'aframe-react'

const PlayerComp = () => {
  const inVrMode = useSelector(state => selectInVrModeState(state))

  const [fuse, setFuse] = useState(false)

  const deviceDetector = new DeviceDetector()
  const userAgent = navigator.userAgent
  const device = deviceDetector.parse(userAgent)
  const devicetype = device.device.type

  useEffect(() => {
    setFuse(inVrMode)
  }, [inVrMode])
  return (
    <Entity
      primitive='a-player'
      fuse-enabled={fuse}
      device-type={devicetype}
      in-vr={inVrMode}
    />
  )
}

export default PlayerComp
