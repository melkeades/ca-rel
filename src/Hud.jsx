import { Suspense, useEffect, useState } from 'react'
import { RootContainer, Container, Image, Text, clippingEvents, noAnimation } from '@coconut-xr/koestlich'
import Glass from './glass'
import { useThree, useFrame } from '@react-three/fiber'
import { useSpring, a } from '@react-spring/three'
import { useXR, useSessionChange } from '@coconut-xr/natuerlich/react'

export default function Hud({ setOrbitControl, setPhotoIndex }) {
  const [isVr, setIsVr] = useState(false)
  const { gl, camera } = useThree()
  let pre = { position: [0, 0, -20], rotation: [0, 0, 1] }
  let pres = false

  const [props, set] = useSpring(() => ({
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    config: { mass: 1, friction: 20, tension: 50 },
  }))
  useEffect(() => {
    setIsVr(!isVr)
  }, [pres])
  let xp, yp, zp, xr, yr, zr
  useSessionChange(() => {
    if (useXR.getState().mode !== 'none' && !isVr) {
      setIsVr(true)
      console.log('ch')
    } else if (useXR.getState().mode === 'none' && isVr) {
      setIsVr(false)

      console.log('ch')
    }
  })
  useFrame(() => {
    const getCamera = camera
    // const getCamera = isPresenting ? gl.xr.getCamera(camera) : camera
    // const getCamera = gl.xr.getCamera(camera)
    const { x, y, z } = getCamera.position
    const { x: rotX, y: rotY, z: rotZ } = getCamera.rotation

    xp = camera.position.x
    yp = camera.position.y
    zp = camera.position.z
    xr = camera.rotation._x
    yr = camera.rotation._y
    zr = camera.rotation._z
    // console.log(gl.xr.getCamera())
    set({ position: [x, y, z], rotation: [rotX, rotY, rotZ] })
  })
  function imgSelect(index) {
    setPhotoIndex(index)
    // console.log(index)
  }

  return (
    <>
      <a.group position={isVr ? [0, 0, -0] : props.position}>
        <a.group rotation={isVr ? [0, 0, 0] : props.rotation}>
          {/* <a.group rotation={(xr, yr, zr)}> */}
          <RootContainer
            position={[0, -1, -3]}
            rotation={[-0.5, 0, 0]}
            sizeX={4}
            sizeY={1.5}
            // material={GlassMaterial}
            onPointerEnter={() => setOrbitControl(false)}
            onPointerLeave={() => setOrbitControl(true)}
            alignItems="stretch"
          >
            <Glass borderRadius={48} padding={64} alignItems="stretch" height={'100%'}>
              {/* <Container width={480} backgroundColor="blue" /> */}
              <Container alignItems="stretch" animation={noAnimation} height={'100%'}>
                <Container flexDirection="row" gapColumn={48} alignItems="stretch" overflow="scroll" animation={noAnimation} height={'100%'}>
                  <Suspense alignItems="stretch" animation={noAnimation} height={'100%'}>
                    {/* {[...Array(4)].map((e, i) => (
                      <Image key={'img' + i} height={'100%'} url={'/360/w' + (i + 1) + '.webp'} borderRadius={32} onClick={() => imgSelect(i)} />
                    ))} */}
                  </Suspense>
                </Container>
              </Container>
            </Glass>
          </RootContainer>
        </a.group>
      </a.group>
    </>
  )
}
