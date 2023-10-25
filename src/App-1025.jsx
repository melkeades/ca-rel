import { OrbitControls, useTexture } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { XRCanvas, PointerHand, PointerController } from '@coconut-xr/natuerlich/defaults'
import { RootText, clippingEvents } from '@coconut-xr/koestlich'
import { getInputSourceId } from '@coconut-xr/natuerlich'
import { XWebPointers } from '@coconut-xr/xinteraction/react'
import { useEnterXR, NonImmersiveCamera, ImmersiveSessionOrigin, useInputSources, XR, useXR } from '@coconut-xr/natuerlich/react'
import { useEffect, useState } from 'react'
import Lenis from '@studio-freight/lenis'
import Glass from './Glass'
import Hud from './Hud'
import Dome from './Dome'

const lenis = new Lenis()
function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

const sel = (e) => document.querySelector(e)

const sessionOptions = {
  requiredFeatures: ['local-floor'],
  // requiredFeatures: ['local-floor', 'hand-tracking'],
}

function UI() {
  const [blue, setBlue] = useState(false)
  return (
    <RootText onClick={() => setBlue((blue) => !blue)} anchorX="center" anchorY="center" padding={0.05} backgroundColor={blue ? 'blue' : 'green'}>
      Hello World
    </RootText>
  )
}

export default function Index() {
  const enterAR = useEnterXR('immersive-vr', sessionOptions)
  const inputSources = useInputSources()

  const [orbitControl, setOrbitControl] = useState(true)
  const [photoIndex, setPhotoIndex] = useState(1)

  const btnVr$ = sel('.btn--vr')
  const btnPrev$ = sel('.btn--prev')
  const btnNext$ = sel('.btn--next')

  useEffect(() => {
    btnVr$.addEventListener('click', () => {
      enterAR()
    })
    btnPrev$.addEventListener('click', function e() {
      this.removeEventListener('click', e)
      setPhotoIndex(photoIndex > 0 ? photoIndex - 1 : 3)
    })
    btnNext$.addEventListener('click', function e() {
      this.removeEventListener('click', e)
      setPhotoIndex(photoIndex < 3 ? photoIndex + 1 : 0)
    })
  }, [photoIndex])
  return (
    <>
      {/* <button className="btn" onClick={enterAR}>
        Enter VR
      </button> */}
      <XRCanvas events={clippingEvents} gl={{ localClippingEnabled: true }}>
        <OrbitControls enableRotate={orbitControl} />
        <ambientLight intensity={0.3} />
        <directionalLight castShadow position={[1, 2, 3]} intensity={2} />
        {/* <ImmersiveSessionOrigin position={[0, 0, 4]}> */}
        {inputSources.map((inputSource) =>
          inputSource.hand != null ? (
            <PointerHand
              id={getInputSourceId(inputSource)}
              key={getInputSourceId(inputSource)}
              inputSource={inputSource}
              hand={inputSource.hand}
              childrenAtJoint="wrist"
            ></PointerHand>
          ) : (
            <PointerController id={getInputSourceId(inputSource)} key={getInputSourceId(inputSource)} inputSource={inputSource}></PointerController>
          )
        )}
        <Dome photoIndex={photoIndex} setPhotoIndex={setPhotoIndex} />
      </XRCanvas>
    </>
  )
}
