import { useGLTF } from "@react-three/drei";

export function Chip(props) {
  const { nodes, materials } = useGLTF('/models/dataShip.glb')

  return (
    <group {...props} dispose={null}>
      <group scale={100}>
        <mesh geometry={nodes.CPU_1.geometry} material={materials.Green} />
        <mesh geometry={nodes.CPU_2.geometry} material={materials['Material.005']} />
        <mesh geometry={nodes.CPU_3.geometry} material={materials.Material} />
        <mesh geometry={nodes.CPU_4.geometry} material={materials['Material.006']} />
        <mesh geometry={nodes.CPU_5.geometry} material={materials.conduct} />
      </group>
    </group>
  )
}

useGLTF.preload('/models/dataShip.glb')