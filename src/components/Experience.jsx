// import { Environment, Gltf, OrbitControls, useFont } from "@react-three/drei";
// import { useThree } from "@react-three/fiber";
// import { useEffect } from "react";
// import { useSong } from "../hooks/useSong";
// import { Combo } from "./Combo";
// import { Model } from "./Laptop";
// import { RouterGLB } from "./Router";
// import { Cable } from "./Cable";
// import { Chip } from "./Chip";
// import { DragableUI } from "./DragableUI";
// export const Experience = ({ isLayerComplete }) => {
//   const playNote = useSong((state) => state.playNote);
//   const [isAtLeftRouter, setIsAtLeftRouter] = useState(false);
//   const [isAtCenterRouter, setIsAtCenterRouter] = useState(false);
//   const [isAtRightRouter, setIsAtRightRouter] = useState(false);
//   const [isAtRightLaptop, setIsAtRightLaptop] = useState(false);
//   const handleDragUpdate = (currentPos) => {
//     const threshold = 0.8; // Target ke paas aane ka radius distance

//     const getDistance = (p1, p2) =>
//       Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2 + (p1[2] - p2[2]) ** 2);

//     setIsAtLeftRouter(getDistance(currentPos, routerLeftPos) < threshold);
//     setIsAtCenterRouter(getDistance(currentPos, routerCenterPos) < threshold);
//     setIsAtRightRouter(getDistance(currentPos, routerRightPos) < threshold);
//     setIsAtRightLaptop(getDistance(currentPos, laptopRightPos) < threshold);
//   };
//   useEffect(() => {
//     const onKeyPress = (event) => {
//       if (event.repeat) return;
//       switch (event.key) {
//         case "s":
//           playNote("Middle");
//           break;
//         case "d":
//           playNote("Side");
//           break;
//         case "f":
//           playNote("Crash");
//           break;
//         default:
//           break;
//       }
//     };

//     document.addEventListener("keypress", onKeyPress);
//     return () => {
//       document.removeEventListener("keypress", onKeyPress);
//     };
//   }, [playNote]);

//   const controls = useThree((state) => state.controls);

//   useEffect(() => {
//     if (!controls) return;
//     controls.target.set(0, 0.5, 0);
//     controls.update();
//   }, [controls]);

//   const passthrough = useSong((state) => state.passthrough);

//   // 3D Space Coordinates Definition
//   const laptopRightPos = [3, 0.2, 0];
//   const laptopLeftPos = [-3, 0.2, 0.6];

//   // Chip ko laptop ke bilkul upar visibility ke liye thoda lift kar rahe hain [x, y, z]
//   const chipPos = [-3, 1.8, 0.6];

//   const routerLeftPos = [-2, 0.2, -2.5];
//   const routerCenterPos = [0, 0.2, -2.5];
//   const routerRightPos = [2, 0.2, -2.5];

//   return (
//     <>
//       {/* Laptops */}
//       <Model scale={5} position={laptopRightPos} />
//       <Model scale={5} position={laptopLeftPos} rotation-y={Math.PI} />

//       {/* Chip display when layers finish */}
//       {/* {!isLayerComplete && (
//         <DragableUI scale={0.2} position={chipPos} rotation-x={Math.PI} />
//       )} */}
//       {/* {!isLayerComplete && (
        
//       )} */}
//       <DragableUI
//         scale={0.8}
//         position={chipPos}
//         rotation={[0, Math.PI / 2, 0]}
//         onPositionUpdate={handleDragUpdate}


//       />
//       {/* Routers */}
//       <RouterGLB scale={0.1} position={routerCenterPos} rotation-y={Math.PI} />
//       <RouterGLB scale={0.1} position={routerLeftPos} rotation-y={Math.PI} />
//       <RouterGLB scale={0.1} position={routerRightPos} rotation-y={Math.PI} />

//       {/* Cables Network */}
//       <Cable start={laptopLeftPos} end={routerLeftPos} color="#00ff88" />
//       <Cable start={laptopRightPos} end={routerRightPos} color="#00ff88" />
//       <Cable start={routerLeftPos} end={routerCenterPos} color="#ffaa00" />
//       <Cable start={routerRightPos} end={routerCenterPos} color="#ffaa00" />

//       {/* Lighting */}
//       <directionalLight
//         castShadow
//         position={[5, 5, 2]}
//         shadow-mapSize-width={1024}
//         shadow-mapSize-height={1024}
//         shadow-camera-left={-20}
//         shadow-camera-right={20}
//         shadow-camera-top={10}
//         shadow-camera-bottom={-10}
//         shadow-bias={-0.00001}
//       />

//       <Gltf src="models/tori.glb" castShadow receiveShadow />
//       <Combo />

//       <OrbitControls makeDefault />

//       {!passthrough && (
//         <Gltf src="models/uploads_files_4381654_LightBlueSky.glb" />
//       )}
//     </>
//   );
// };

// useFont.preload("fonts/Inter_Bold.json");







import { Environment, Gltf, OrbitControls, useFont } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useState, useRef } from "react";
import { useSong } from "../hooks/useSong";
import { Combo } from "./Combo";
import { Model } from "./Laptop";
import { RouterGLB } from "./Router";
import { Cable } from "./Cable";
import { Chip } from "./Chip";
import { DragableUI } from "./DragableUI";
import * as THREE from "three";

export const Experience = ({
  isLayerComplete,
  isAtLeftRouter,
  isAtCenterRouter,
  isAtRightRouter,
  isAtRightLaptop,
  setIsAtLeftRouter,
  setIsAtCenterRouter,
  setIsAtRightRouter,
  setIsAtRightLaptop,
}) => {
  const playNote = useSong((state) => state.playNote);

  // Movement Tracking Step (0: Initial Laptop, 1: Left Router, 2: Center Router, 3: Right Router, 4: Right Laptop)
  const [currentStep, setCurrentStep] = useState(0);

  // 3D Space Coordinates
  const laptopLeftPos = [-3, 1.8, 0.6];
  const routerLeftPos = [-2, 1.2, -2.5];
  const routerCenterPos = [0, 1.2, -2.5];
  const routerRightPos = [2, 1.2, -2.5];
  const laptopRightPos = [3, 1.8, 0];

  const targetPositions = [
    laptopLeftPos,
    routerLeftPos,
    routerCenterPos,
    routerRightPos,
    laptopRightPos,
  ];

  // Dynamic Rotation Calculation based on received props
  const getHeaderRotation = () => {
    if (isAtLeftRouter) {
      return [0, Math.PI / 4, 0]; // Left Router Position Rotation
    }
    if (isAtCenterRouter) {
      return [0, Math.PI / 10, 0]; // Center Router Position Rotation
    }
    if (isAtRightRouter) {
      return [0, Math.PI / 20, 0]; // Right Router Position Rotation
    }
    if (isAtRightLaptop) {
      return [0, -1 * (Math.PI / 2), 0]; // Right Laptop Position Rotation
    }
    return [0, Math.PI / 2, 0]; // Initial Laptop Position Rotation (Default)
  };

  // Ref for Smooth Lerp Animation
  const currentPosRef = useRef(new THREE.Vector3(...laptopLeftPos));
  const [headerPos, setHeaderPos] = useState(laptopLeftPos);

  // Smooth Movement Loop
  useFrame((_, delta) => {
    const targetVector = new THREE.Vector3(...targetPositions[currentStep]);
    currentPosRef.current.lerp(targetVector, delta * 4); // Smooth transition
    setHeaderPos([
      currentPosRef.current.x,
      currentPosRef.current.y,
      currentPosRef.current.z,
    ]);
  });

  // Handle Button Click & Toggle Parent States
  const handleNextStep = () => {
    const nextStep = (currentStep + 1) % targetPositions.length;
    setCurrentStep(nextStep);

    // Update parent states
    setIsAtLeftRouter(nextStep === 1);
    setIsAtCenterRouter(nextStep === 2);
    setIsAtRightRouter(nextStep === 3);
    setIsAtRightLaptop(nextStep === 4);
  };

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

  const rawLaptopRightPos = [3, 0.2, 0];
  const rawLaptopLeftPos = [-3, 0.2, 0.6];
  const rawRouterLeftPos = [-2, 0.2, -2.5];
  const rawRouterCenterPos = [0, 0.2, -2.5];
  const rawRouterRightPos = [2, 0.2, -2.5];

  return (
    <>
      {/* Laptops */}
      <Model scale={5} position={rawLaptopRightPos} />
      <Model scale={5} position={rawLaptopLeftPos} rotation-y={Math.PI} />

      {/* Ethernet Header UI with Dynamic Conditional Rotation */}
      {
        !isLayerComplete &&  <DragableUI
        scale={0.8}
        position={headerPos}
        rotation={getHeaderRotation()}
        onMoveClick={handleNextStep}
        currentStep={currentStep}
      />
      }
      

      {/* Routers */}
      <RouterGLB scale={0.1} position={rawRouterCenterPos} rotation-y={Math.PI} />
      <RouterGLB scale={0.1} position={rawRouterLeftPos} rotation-y={Math.PI} />
      <RouterGLB scale={0.1} position={rawRouterRightPos} rotation-y={Math.PI} />

      {/* Cables Network */}
      <Cable start={rawLaptopLeftPos} end={rawRouterLeftPos} color="#00ff88" />
      <Cable start={rawLaptopRightPos} end={rawRouterRightPos} color="#00ff88" />
      <Cable start={rawRouterLeftPos} end={rawRouterCenterPos} color="#ffaa00" />
      <Cable start={rawRouterRightPos} end={rawRouterCenterPos} color="#ffaa00" />

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