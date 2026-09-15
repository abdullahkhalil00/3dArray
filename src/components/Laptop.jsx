import React from 'react';
import { useGLTF, Html } from '@react-three/drei';

export function Model(props) {
  const { nodes, materials } = useGLTF('/models/laptop.glb')

  return (
    <group {...props} dispose={null}>
      <group position={[-0.024, 0.134, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <group position={[-0.05, 0, -0.08]}>
          <mesh geometry={nodes.Box106.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box138.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box137.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box136.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box135.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box134.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box133.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box132.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box131.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box130.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box129.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box128.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box085.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box086.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box087.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box088.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box089.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box090.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box091.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box092.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box093.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box094.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box095.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box096.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box097.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box098.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box099.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box100.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box101.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box102.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box103.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box104.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box105.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box139.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box107.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box108.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box109.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box110.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box111.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box112.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box113.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box114.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box115.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box116.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box117.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box118.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box119.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box120.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box121.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box122.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box123.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box124.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box125.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box126.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box127.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box084.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box083.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box082.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box081.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box080.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box079.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box078.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box077.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box076.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box075.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box074.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
          <mesh geometry={nodes.Box073.geometry} material={materials.Laptop_wire_006135006dsa} position={[0.05, 0, -0.036]} />
        </group>
        <mesh geometry={nodes.Box072.geometry} material={materials.Laptop_wire_006135006} position={[0, 0, -0.116]} />
        
        {/* Laptop Screen Mesh */}
        <mesh geometry={nodes.Box071.geometry} material={materials.Laptop_wire_008110135} position={[0, 0, -0.116]}>
          {/* 3D Space embedded 2D HTML Container */}
          <Html
            transform
            wrapperClass="laptop-screen"
            distanceFactor={0.2}
            position={[0, 0, 0.005]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            {props.children}
          </Html>
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload('models/laptop.glb');