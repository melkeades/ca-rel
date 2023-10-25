import { useTexture } from '@react-three/drei'
import { useState, useEffect } from 'react'
import * as THREE from 'three'

export default function Dome({ photoIndex, setPhotoIndex }) {
  const imgUrl = ['/360/w1.webp', '/360/w2.webp', '/360/w3.webp', '/360/w4.webp']
  // const imgUrl = ['/360/1.webp', '/360/2.webp', '/360/3.webp', '/360/4.webp', '/360/5.webp']
  // const imgUrl = ['/360/1.webp', '/360/2.webp']
  const texture = useTexture(imgUrl)
  const [photo, setPhoto] = useState(texture[photoIndex])

  texture.forEach((item) => {
    item.mapping = THREE.EquirectangularReflectionMapping
    item.colorSpace = THREE.SRGBColorSpace
    item.minFilter = item.magFilter = THREE.LinearFilter
  })
  useEffect(() => {
    console.log('pho: ' + photoIndex)
    setPhoto(texture[photoIndex])
  }, [photoIndex])

  return (
    <>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry attach="geometry" args={[100, 100, 100]} />
        <meshBasicMaterial attach="material" toneMapped={false} map={photo} side={THREE.BackSide} onUpdate={(self) => (self.needsUpdate = true)} />
      </mesh>
    </>
  )
}
