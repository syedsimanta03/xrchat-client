import AFRAME from 'aframe'
import Camera, { CameraComponentOptions, defaultCameraComponentOptions } from './camera'
import FuseCursor from './fuse-cursor'
import MouseCursor from './mouse-cursor'
import { setComponent } from '../aframe-component'

export default class CameraRig {
  camera: Camera
  el: AFRAME.Entity | null = null
  cameraEl: AFRAME.Entity | null = null
  className: string
  cursorType: string
  cursor: any

  constructor(className = 'player-camera',
    cameraOptions: Partial<CameraComponentOptions> = defaultCameraComponentOptions,
    cursorType: string = 'mouse') {
    this.camera = new Camera(cameraOptions)
    this.className = className
    this.cursorType = cursorType
    this.setupCameraRig()
  }

  setupCameraRig(): void {
    this.el = document.createElement('a-entity')
    this.el.classList.add('camera-rig')

    this.cameraEl = document.createElement('a-entity')
    this.cameraEl.classList.add('class')
    this.cameraEl.classList.add(this.className)
    setComponent(this.cameraEl, this.camera)

    this.el.appendChild(this.cameraEl)

    this.setupCursor()
  }

  tearDownCameraRig(): void {
    this.cameraEl?.parentElement.removeChild(this.cameraEl)
    this.cursor.el?.parentElement.removeChild(this.cursor.el)
  }

  setupCursor(): void {
    if (!this.el) return
    let cursor
    switch (this.cursorType) {
      case 'fuse':
        cursor = new FuseCursor()
        this.cameraEl.appendChild(cursor.el as AFRAME.Entity)
        cursor.el?.object3D.position.set(0, 0, -1)
        break
      case 'mouse':
        cursor = new MouseCursor()
        this.el.appendChild(cursor.el as AFRAME.Entity)
        break
      default:
        break
    }
    this.cursor = cursor
  }

  updateCursor(): void {
    if (!this.el) return
    if (this.cursor) {
      this.cursor.el.parentElement.removeChild(this.cursor.el)
    }
  }

  setActive(): void {
    const cameraSystem = this.el?.sceneEl?.systems.camera
    if (cameraSystem) (cameraSystem as any).setActiveCamera(this.cameraEl)
  }

  removeDefaultCamera(): void {
    const cams = document.querySelectorAll('[camera]')
    cams.forEach(el => { if (el.classList.contains('data-aframe-default-camera')) el.parentElement?.removeChild(el) })
  }
}
