import { Container, Image, Root, Text } from "@react-three/uikit";
import { Button, Card, Defaults } from "@react-three/uikit-apfel";
import { useXR } from "@react-three/xr";
import { store } from "../App";
import { useSong } from "../hooks/useSong";
import { useState, useEffect } from "react";

import tickIcon from "../assets/icons8-tick-50.png";

export function SecondUI(params) {
  const {
    isLayerComplete,
    setIsLayerComplete,
    isAtLeftRouter,
    isAtCenterRouter,
    isAtRightRouter,
    isAtRightLaptop,
  } = params;

  const mode = useXR((state) => state.mode);
  const session = useXR((state) => state.session);
  const songData = useSong((state) => state.songData);
  const passthrough = useSong((state) => state.passthrough);
  const setPassthrough = useSong((state) => state.setPassthrough);

  const [dataLayerNumber, setDataLayerNumber] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const layers = [
    "Application Layer",
    "Transport Layer",
    "Network Layer",
    "Data Link Layer",
    "Physical Layer",
  ];

  const [attributes, setAttributes] = useState([
    [
      { label: "Actual Data", selected: false },
      { label: "Application Layer Protocols", selected: false },
      { label: "Binary Data", selected: false },
    ],
    [
      { label: "Reliable Data Transfer", selected: false },
      { label: "Protocols TCP and UDP", selected: false },
    ],
    [
      { label: "Routing Data Packets", selected: false },
      { label: "Protocols IP", selected: false },
    ],
    [
      { label: "Reliable Communication", selected: false },
      { label: "Protocols Ethernet and Wi-Fi", selected: false },
    ],
    [
      { label: "Transmitting Raw Binary Data", selected: false },
      { label: "Physical Medium (Wires, Fiber, Wireless)", selected: false },
    ],
  ]);

  const isCurrentLayerComplete = attributes[dataLayerNumber].every(
    (attr) => attr.selected
  );

  useEffect(() => {
    if (setIsLayerComplete) {
      setIsLayerComplete(isCurrentLayerComplete);
    }
  }, [isCurrentLayerComplete, setIsLayerComplete]);

  const toggleAttribute = (layerIdx, attrIdx) => {
    setErrorMessage("");
    setAttributes((prev) => {
      const updated = [...prev];
      updated[layerIdx] = [...updated[layerIdx]];
      updated[layerIdx][attrIdx] = {
        ...updated[layerIdx][attrIdx],
        selected: !updated[layerIdx][attrIdx].selected,
      };
      return updated;
    });
  };

  // Har router location ke mutabiq dynamic Routing Data Render
  const renderRouterTableInfo = () => {
    if (isAtLeftRouter) {
      return (
        <Container
          flexDirection="column"
          gap={6}
          padding={12}
          backgroundColor="rgba(0,0,0,0.2)"
          borderRadius={12}
        >
          <Text fontSize={16} fontWeight="bold" textAlign="center" color="#00ff88">
            Routing Table: Router 1 (Left)
          </Text>
          <Text fontSize={13} textAlign="center">
            Path Found: Searching route to transfer data from Central Router to Right Router then Destination.
          </Text>
          <Text fontSize={12} textAlign="center" opacity={0.8}>
            Next Hop: Central Router
          </Text>
        </Container>
      );
    }

    if (isAtCenterRouter) {
      return (
        <Container
          flexDirection="column"
          gap={6}
          padding={12}
          backgroundColor="rgba(0,0,0,0.2)"
          borderRadius={12}
        >
          <Text fontSize={16} fontWeight="bold" textAlign="center" color="#ffaa00">
            Routing Table: Central Router
          </Text>
          <Text fontSize={13} textAlign="center">
            Central Router Processing: Target path verified. Forwarding packet to Right Router.
          </Text>
          <Text fontSize={12} textAlign="center" opacity={0.8}>
            Next Hop: Right Router
          </Text>
        </Container>
      );
    }

    if (isAtRightRouter) {
      return (
        <Container
          flexDirection="column"
          gap={6}
          padding={12}
          backgroundColor="rgba(0,0,0,0.2)"
          borderRadius={12}
        >
          <Text fontSize={16} fontWeight="bold" textAlign="center" color="#00aaff">
            Routing Table: Right Router
          </Text>
          <Text fontSize={13} textAlign="center">
            Destination Router Reached: Forwarding data packet directly to target laptop.
          </Text>
          <Text fontSize={12} textAlign="center" opacity={0.8}>
            Next Hop: Destination Laptop
          </Text>
        </Container>
      );
    }

    if (isAtRightLaptop) {
      return (
        <Container
          flexDirection="column"
          gap={6}
          padding={12}
          backgroundColor="rgba(10, 12, 10, 0.15)"
          borderRadius={12}
        >
          <Text fontSize={16} fontWeight="bold" textAlign="center" color="#f7f7f7ff">
            Packet Delivered!
          </Text>
          <Text fontSize={13} textAlign="center">
            Data successfully transferred through all network routers to the final destination.
          </Text>
        </Container>
      );
    }

    return null;
  };

  if (songData) {
    return null;
  }

  return (
    <Defaults>
      <Root>
        <Container
          flexDirection="column"
          md={{ flexDirection: "row" }}
          alignItems="center"
          gap={32}
        >
          <Card
            borderRadius={32}
            padding={24}
            flexDirection="column"
            alignItems="center"
            gap={16}
            width={800}
          >
            <Container
              flexDirection="column"
              alignItems="stretch"
              gap={16}
              width="100%"
            >
              {/* Header Title */}
              <Container
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                gap={8}
              >
                <Text fontSize={22} textAlign="center" fontWeight="bold">
                  Network Routing Status (See Ethernet Header on Devices)
                </Text>
                {isCurrentLayerComplete && (
                  <Image src={tickIcon} width={20} height={20} />
                )}
              </Container>

              {/* Routing Table Info Component */}
              {renderRouterTableInfo()}

              {/* Attributes Selection */}
              <Container flexDirection="column" gap={8} marginTop={8}>
                <Text fontSize={14} fontWeight="bold">
                  Containt all your data and meta data
                </Text>

                <Container flexDirection="row" gap={8} flexWrap="wrap">
                  {attributes[dataLayerNumber].map((attr, attrIdx) => (
                    <Button
                      key={attrIdx}
                      variant={attr.selected ? "solid" : "rect"}
                      size="sm"
                      onClick={() => toggleAttribute(dataLayerNumber, attrIdx)}
                    >
                      
                    </Button>
                  ))}
                </Container>
              </Container>

              {/* Error Message */}
              {errorMessage !== "" && (
                <Text fontSize={12} textAlign="center">
                  {errorMessage}
                </Text>
              )}

              {/* XR Controls */}
              <Container
                flexDirection="row"
                justifyContent="space-evenly"
                gap={8}
                marginTop={12}
              >
                {mode === null ? (
                  <Button
                    variant="rect"
                    size="sm"
                    platter
                    flexGrow={1}
                    onClick={() => store.enterAR()}
                  >
                    <Text>VR/AR</Text>
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="rect"
                      size="sm"
                      platter
                      flexGrow={1}
                      onClick={() => setPassthrough(!passthrough)}
                    >
                      <Text>Passthrough</Text>
                    </Button>
                    <Button
                      variant="rect"
                      size="sm"
                      platter
                      flexGrow={1}
                      onClick={() => session.end()}
                    >
                      <Text>Exit VR</Text>
                    </Button>
                  </>
                )}
              </Container>
            </Container>
          </Card>
        </Container>
      </Root>
    </Defaults>
  );
}