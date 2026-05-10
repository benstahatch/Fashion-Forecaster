import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Butterfly({ phase }) {
  const group = useRef()
  const leftWing = useRef()
  const rightWing = useRef()

  const wingShape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.bezierCurveTo(0.2, 0.5, 0.4, 1, 1, 1)    
    shape.bezierCurveTo(1.5, 1, 1.2, 0.2, 1, 0)   
    shape.bezierCurveTo(1.2, -0.5, 0.8, -1, 0.5, -1.2) 
    shape.bezierCurveTo(0.2, -1, 0, -0.5, 0, 0)   
    return shape
  }, [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (!group.current) return

    const landingSpot = new THREE.Vector3(0.5, -0.1, 0.2)
    const distance = group.current.position.distanceTo(landingSpot)
    
    // Smoothly dampens the movement as it gets within 0.6 units of the spot
    const landingFactor = THREE.MathUtils.clamp(distance / 0.6, 0, 1)

    // Wings transition to a very slow "rest" beat when landingFactor hits 0
    const flapSpeed = phase === 'entering' ? (15 * landingFactor + 1.2) : 15 
    const flapRange = Math.sin(t * flapSpeed) * (0.05 + (1.0 * landingFactor))
    
    if (leftWing.current && rightWing.current) {
      leftWing.current.rotation.y = flapRange
      rightWing.current.rotation.y = -flapRange
    }

    // Flight wobble for realism 
    const wobbleY = (Math.sin(t * 2.5) * 0.4 + Math.cos(t * 1.8) * 0.2) * landingFactor
    const wobbleX = (Math.cos(t * 1.5) * 0.3) * landingFactor

    if (phase === 'entering') {
      // Landing target matches landingSpot 
      const targetX = 0.35 + wobbleX
      const targetY = 0.1 + wobbleY 
      const targetZ = 0.2 + (Math.sin(t) * 0.1 * landingFactor)

      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, 0.02)
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.02)
      group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, targetZ, 0.02)

      // Stopping to rest
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, wobbleX * 0.8, 0.1)
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, wobbleY * 0.5, 0.1)
    } 
    else if (phase === 'leaving') {
      // Smoothly reset rotation for a clean takeoff
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0, 0.1)
      
      group.current.position.x += 4 * delta 
      group.current.position.y += (1.5 + Math.sin(t * 4) * 2) * delta 
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, Math.PI / 6, 0.05)
    }
  })

  return (
    <group ref={group} position={[-8, 4, 0]} rotation={[0, Math.PI / 2, 0]} scale={0.3}>
      <group rotation={[Math.PI / 3, 0, 0]}>
        {/* Head and Body */}
        <mesh position={[0, 0.35, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="black" />
          
          <group position={[0, 0.08, 0.05]}>
            <group>
              <mesh>
                <tubeGeometry args={[
                  useMemo(() => new THREE.QuadraticBezierCurve3(
                    new THREE.Vector3(0.02, 0, 0),
                    new THREE.Vector3(0.15, 0.2, 0.1),
                    new THREE.Vector3(0.1, 0.4, 0.25)
                  ), []), 
                  20, 0.004, 8, false
                ]} />
                <meshStandardMaterial color="black" />
              </mesh>
              <mesh position={[0.1, 0.4, 0.25]}>
                <sphereGeometry args={[0.015, 16, 16]} />
                <meshStandardMaterial color="black" />
              </mesh>
            </group>

            <group>
              <mesh>
                <tubeGeometry args={[
                  useMemo(() => new THREE.QuadraticBezierCurve3(
                    new THREE.Vector3(-0.02, 0, 0),
                    new THREE.Vector3(-0.15, 0.2, 0.1),
                    new THREE.Vector3(-0.1, 0.4, 0.25)
                  ), []), 
                  20, 0.004, 8, false
                ]} />
                <meshStandardMaterial color="black" />
              </mesh>
              <mesh position={[-0.1, 0.4, 0.25]}>
                <sphereGeometry args={[0.015, 16, 16]} />
                <meshStandardMaterial color="black" />
              </mesh>
            </group>
          </group>
        </mesh>
        
        <mesh><capsuleGeometry args={[0.04, 0.6]} /><meshStandardMaterial color="black" /></mesh>
        
        {/* Legs */}
        {[0.1, 0, -0.1].map((pos, i) => (
          <group key={i} position={[0, pos, 0.06]}>
            <mesh rotation={[-0.5, 0, 0.7]} position={[0.06, 0, 0]}><capsuleGeometry args={[0.004, 0.12]} /><meshStandardMaterial color="black" /></mesh>
            <mesh rotation={[-0.5, 0, -0.7]} position={[-0.06, 0, 0]}><capsuleGeometry args={[0.004, 0.12]} /><meshStandardMaterial color="black" /></mesh>
          </group>
        ))}
      </group>

      {/* Wings */}
      <group rotation={[Math.PI / 3, 2, 0]} position={[0, 0.1, -0.02]}>
        <mesh ref={rightWing} position={[0.05, 0, 0]}><shapeGeometry args={[wingShape]} /><meshStandardMaterial color="#111" side={THREE.DoubleSide} /></mesh>
        <mesh ref={leftWing} position={[-0.05, 0, 0]} rotation={[0, Math.PI, 0]}><shapeGeometry args={[wingShape]} /><meshStandardMaterial color="#111" side={THREE.DoubleSide} /></mesh>
      </group>
    </group>
  )
}