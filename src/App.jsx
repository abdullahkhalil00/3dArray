import { useState } from "react";
import { Bvh, Float, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { createXRStore, XR, XROrigin } from "@react-three/xr";
import { degToRad } from "three/src/math/MathUtils.js";
import { DrumStick } from "./components/DrumStick";
import { Experience } from "./components/Experience";
import { ScoreBoard } from "./components/ScoreBoard";
import { UI } from "./components/UI";
import { NOTES_COLORS } from "./hooks/useSong";
import { SecondUI } from "./components/secondUI";

export const store = createXRStore({
  controller: DrumStick,
  meshDetection: false,
  planeDetection: false,
});

function App() {
  const [isLayerComplete, setIsLayerComplete] = useState(true);
  const [isAtLeftRouter, setIsAtLeftRouter] = useState(false);
  const [isAtCenterRouter, setIsAtCenterRouter] = useState(false);
  const [isAtRightRouter, setIsAtRightRouter] = useState(false);
  const [isAtRightLaptop, setIsAtRightLaptop] = useState(false);
  const [isTCP, setIsTCP] = useState(false);
  const [protocol, setProtocol] = useState("UDP");
  const [round, setRound] = useState(0);

  // -1 = inactive (normal flow)
  // 0-4 = UDP OSI layer walkthrough steps inside SecondUI
  // 5   = walkthrough done, trigger packet animation
  const [udpRetransmitStep, setUdpRetransmitStep] = useState(-1);

  // Reset all router/laptop position flags and move packet back to Left Laptop
  const resetPacketPositions = () => {
    setIsAtLeftRouter(false);
    setIsAtCenterRouter(false);
    setIsAtRightRouter(false);
    setIsAtRightLaptop(false);
  };

  // TCP Retransmit: packet restarts from Left Laptop (stays in SecondUI, round → 1)
  const handleResetToLeftLaptop = () => {
    resetPacketPositions();
    setRound(1);
  };

  // UDP Retransmit: stay in SecondUI, show OSI walkthrough, round → 2
  const handleFullReset = () => {
    resetPacketPositions();
    setRound(2);
    setUdpRetransmitStep(0); // begin UDP OSI layer walkthrough inside SecondUI
  };

  // Called when UDP OSI walkthrough is done → start packet animation
  const handleUdpLayersComplete = () => {
    setUdpRetransmitStep(-1); // deactivate walkthrough
    // packet position flags are already reset, so Experience will start from step 0
  };

  // Called when first UI layers are complete
  const handleLayersComplete = () => {
    resetPacketPositions();
    setIsLayerComplete(false);
    setUdpRetransmitStep(-1);
  };

  return (
    <>
      <div className="controls">
        <div className="controls__key" style={{ color: NOTES_COLORS.Middle }}>
          D
        </div>
        <div className="controls__key" style={{ color: NOTES_COLORS.Side }}>
          T
        </div>
        <div className="controls__key" style={{ color: NOTES_COLORS.Crash }}>
          S
        </div>
      </div>
      <Canvas
        camera={{
          position: window.innerWidth < 1024 ? [0, 0.8, 3] : [0, 0.5, 1],
          fov: 70,
        }}
      >
        {window.location.href.includes("localhost") && <Stats />}
        <color attach="background" args={["#ececec"]} />
        <XR store={store}>
          <group position-y={1} position-z={-5}>
            <Float rotationIntensity={0.4} speed={1.5}>
              {isLayerComplete && (
                <UI
                  isLayerComplete={isLayerComplete}
                  setIsLayerComplete={setIsLayerComplete}
                  onLayersComplete={handleLayersComplete}
                  isTCP={isTCP}
                  setIsTCP={setIsTCP}
                  protocol={protocol}
                  setProtocol={setProtocol}
                  round={round}
                  setRound={setRound}
                />
              )}
              {!isLayerComplete && (
                <SecondUI
                  isLayerComplete={isLayerComplete}
                  setIsLayerComplete={setIsLayerComplete}
                  isAtLeftRouter={isAtLeftRouter}
                  isAtCenterRouter={isAtCenterRouter}
                  isAtRightRouter={isAtRightRouter}
                  isAtRightLaptop={isAtRightLaptop}
                  isTCP={isTCP}
                  setIsTCP={setIsTCP}
                  protocol={protocol}
                  round={round}
                  setRound={setRound}
                  resetToLeftLaptop={handleResetToLeftLaptop}
                  fullResetToStart={handleFullReset}
                  udpRetransmitStep={udpRetransmitStep}
                  setUdpRetransmitStep={setUdpRetransmitStep}
                  onUdpLayersComplete={handleUdpLayersComplete}
                />
              )}
            </Float>
          </group>
          <group position-y={2} position-z={-3} rotation-x={degToRad(20)}>
            <ScoreBoard />
          </group>
          <group position-y={-1}>
            <Bvh firstHitOnly>
              <Experience
                isLayerComplete={isLayerComplete}
                isAtLeftRouter={isAtLeftRouter}
                isAtCenterRouter={isAtCenterRouter}
                isAtRightRouter={isAtRightRouter}
                isAtRightLaptop={isAtRightLaptop}
                setIsAtLeftRouter={setIsAtLeftRouter}
                setIsAtCenterRouter={setIsAtCenterRouter}
                setIsAtRightRouter={setIsAtRightRouter}
                setIsAtRightLaptop={setIsAtRightLaptop}
                isTCP={isTCP}
                protocol={protocol}
                round={round}
                udpRetransmitStep={udpRetransmitStep}
              />
            </Bvh>
            <XROrigin position-z={0.2} />
          </group>
        </XR>
      </Canvas>
    </>
  );
}

export default App;