import { Environment, Gltf, OrbitControls, useFont } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { useSong } from "../hooks/useSong";
import { Combo } from "./Combo";
import { Model } from "./Laptop";
import { RouterGLB } from "./Router";
import { Cable } from "./Cable";
import { Chip } from "./Chip";

export const Experience = ({ isLayerComplete }) => {
  const playNote = useSong((state) => state.playNote);

  useEffect(() => {
    const onKeyPress = (event) => {
      if (event.repeat) return;
      switch (event.key) {
        case "s":
          playNote("Middle");
          break;
        case "d":
          playNote("Side");
          break;
        case "f":
          playNote("Crash");
          break;
        default:
          break;
      }
    };

    document.addEventListener("keypress", onKeyPress);
    return () => {
      document.removeEventListener("keypress", onKeyPress);
    };
  }, [playNote]);

  const controls = useThree((state) => state.controls);

  useEffect(() => {
    if (!controls) return;
    controls.target.set(0, 0.5, 0);
    controls.update();
  }, [controls]);

  const passthrough = useSong((state) => state.passthrough);

  // 3D Space Coordinates Definition
  const laptopRightPos = [3, 0.2, 0];
  const laptopLeftPos = [-3, 0.2, 0.6];

  // Chip ko laptop ke bilkul upar visibility ke liye thoda lift kar rahe hain [x, y, z]
  const chipPos = [-3, 1, 0.6];

  const routerLeftPos = [-2, 0.2, -2.5];
  const routerCenterPos = [0, 0.2, -2.5];
  const routerRightPos = [2, 0.2, -2.5];

  return (
    <>
      {/* Laptops */}
      <Model scale={5} position={laptopRightPos} />
      <Model scale={5} position={laptopLeftPos} rotation-y={Math.PI} />

      {/* Chip display when layers finish */}
      {!isLayerComplete && (
        <Chip scale={0.2} position={chipPos} rotation-x={Math.PI} />
      )}

      {/* Routers */}
      <RouterGLB scale={0.1} position={routerCenterPos} rotation-y={Math.PI} />
      <RouterGLB scale={0.1} position={routerLeftPos} rotation-y={Math.PI} />
      <RouterGLB scale={0.1} position={routerRightPos} rotation-y={Math.PI} />

      {/* Cables Network */}
      <Cable start={laptopLeftPos} end={routerLeftPos} color="#00ff88" />
      <Cable start={laptopRightPos} end={routerRightPos} color="#00ff88" />
      <Cable start={routerLeftPos} end={routerCenterPos} color="#ffaa00" />
      <Cable start={routerRightPos} end={routerCenterPos} color="#ffaa00" />

      {/* Lighting */}
      <directionalLight
        castShadow
        position={[5, 5, 2]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.00001}
      />

      <Gltf src="models/tori.glb" castShadow receiveShadow />
      <Combo />

      <OrbitControls makeDefault />

      {!passthrough && (
        <Gltf src="models/uploads_files_4381654_LightBlueSky.glb" />
      )}
    </>
  );
};

useFont.preload("fonts/Inter_Bold.json");