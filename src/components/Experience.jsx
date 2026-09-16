import { Environment, Gltf, OrbitControls, useFont } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useState, useRef } from "react";
import { useSong } from "../hooks/useSong";
import { Combo } from "./Combo";
import { Model } from "./Laptop";
import { RouterGLB } from "./Router";
import { Cable } from "./Cable";
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
  isTCP,
  protocol,
  round,
  udpRetransmitStep,
}) => {
  const playNote = useSong((state) => state.playNote);

  // Steps: 0=Left Laptop, 1=Left Router, 2=Center Router, 3=Right Router, 4=Right Laptop
  const [currentStep, setCurrentStep] = useState(0);

  const laptopLeftPos   = [-3, 1.8, 0.6];
  const routerLeftPos   = [-2, 1.2, -2.5];
  const routerCenterPos = [0,  1.2, -2.5];
  const routerRightPos  = [2,  1.2, -2.5];
  const laptopRightPos  = [3,  1.8, 0];

  const targetPositions = [
    laptopLeftPos,
    routerLeftPos,
    routerCenterPos,
    routerRightPos,
    laptopRightPos,
  ];

  const currentPosRef = useRef(new THREE.Vector3(...laptopLeftPos));
  const [headerPos, setHeaderPos] = useState(laptopLeftPos);

  // Sync packet position with external state flags
  useEffect(() => {
    // If layer UI is showing, reset packet to start
    if (isLayerComplete) {
      setCurrentStep(0);
      currentPosRef.current.set(...laptopLeftPos);
      setHeaderPos(laptopLeftPos);
      return;
    }

    // If all position flags are cleared (retransmit or reset), go back to step 0
    if (!isAtLeftRouter && !isAtCenterRouter && !isAtRightRouter && !isAtRightLaptop) {
      setCurrentStep(0);
      currentPosRef.current.set(...laptopLeftPos);
      setHeaderPos(laptopLeftPos);
      return;
    }

    if (isAtLeftRouter && !isAtCenterRouter) {
      setCurrentStep(1);
    }
  }, [
    isLayerComplete,
    isAtLeftRouter,
    isAtCenterRouter,
    isAtRightRouter,
    isAtRightLaptop,
  ]);

  const getHeaderRotation = () => {
    if (isAtLeftRouter)   return [0,  Math.PI / 4,        0];
    if (isAtCenterRouter) return [0,  Math.PI / 10,       0];
    if (isAtRightRouter)  return [0,  Math.PI / 20,       0];
    if (isAtRightLaptop)  return [0, -Math.PI / 2,        0];
    return                       [0,  Math.PI / 2,        0];
  };

  // Smooth packet animation
  useFrame((_, delta) => {
    const targetVector = new THREE.Vector3(...targetPositions[currentStep]);
    currentPosRef.current.lerp(targetVector, delta * 4);
    setHeaderPos([
      currentPosRef.current.x,
      currentPosRef.current.y,
      currentPosRef.current.z,
    ]);
  });

  const handleNextStep = () => {
    // Block at Central Router (step 2) on round 0 — error is shown in SecondUI
    if (currentStep === 2 && round === 0) return;

    const nextStep = (currentStep + 1) % targetPositions.length;
    setCurrentStep(nextStep);

    setIsAtLeftRouter(nextStep === 1);
    setIsAtCenterRouter(nextStep === 2);
    setIsAtRightRouter(nextStep === 3);
    setIsAtRightLaptop(nextStep === 4);
  };

  useEffect(() => {
    const onKeyPress = (event) => {
      if (event.repeat) return;
      switch (event.key) {
        case "s": playNote("Middle"); break;
        case "d": playNote("Side");   break;
        case "f": playNote("Crash");  break;
        default:  break;
      }
    };
    document.addEventListener("keypress", onKeyPress);
    return () => document.removeEventListener("keypress", onKeyPress);
  }, [playNote]);

  const controls = useThree((state) => state.controls);
  useEffect(() => {
    if (!controls) return;
    controls.target.set(0, 0.5, 0);
    controls.update();
  }, [controls]);

  const passthrough = useSong((state) => state.passthrough);

  // Hide the moving packet while the UDP OSI walkthrough is in progress
  // (udpRetransmitStep >= 0 means walkthrough is active, -1 = inactive)
  const isUdpWalkthroughActive = udpRetransmitStep >= 0;

  const rawLaptopRightPos  = [3,  0.2, 0];
  const rawLaptopLeftPos   = [-3, 0.2, 0.6];
  const rawRouterLeftPos   = [-2, 0.2, -2.5];
  const rawRouterCenterPos = [0,  0.2, -2.5];
  const rawRouterRightPos  = [2,  0.2, -2.5];

  return (
    <>
      <Model scale={5} position={rawLaptopRightPos} />
      <Model scale={5} position={rawLaptopLeftPos} rotation-y={Math.PI} />

      {/* Packet (DragableUI) — hidden during UDP OSI walkthrough */}
      {!isLayerComplete && !isUdpWalkthroughActive && (
        <DragableUI
          scale={0.8}
          position={headerPos}
          rotation={getHeaderRotation()}
          onMoveClick={handleNextStep}
          currentStep={currentStep}
          round={round}
          isTCP={isTCP}
          protocol={protocol}
        />
      )}

      <RouterGLB scale={0.1} position={rawRouterCenterPos} rotation-y={Math.PI} />
      <RouterGLB scale={0.1} position={rawRouterLeftPos}   rotation-y={Math.PI} />
      <RouterGLB scale={0.1} position={rawRouterRightPos}  rotation-y={Math.PI} />

      <Cable start={rawLaptopLeftPos}   end={rawRouterLeftPos}   color="#00ff88" />
      <Cable start={rawLaptopRightPos}  end={rawRouterRightPos}  color="#00ff88" />
      <Cable start={rawRouterLeftPos}   end={rawRouterCenterPos} color="#ffaa00" />
      <Cable start={rawRouterRightPos}  end={rawRouterCenterPos} color="#ffaa00" />

      <directionalLight castShadow position={[5, 5, 2]} />
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