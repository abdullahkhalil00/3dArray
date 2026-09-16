import { Container, Image, Root, Text } from "@react-three/uikit";
import { Button, Card, Defaults } from "@react-three/uikit-apfel";
import { useXR } from "@react-three/xr";
import { store } from "../App";
import { useSong } from "../hooks/useSong";
import { useState, useEffect } from "react";

import tickIcon from "../assets/icons8-tick-50.png";

export function UI(params) {
  const {
    isLayerComplete,
    setIsLayerComplete,
    onLayersComplete,
    setIsTCP,
    isTCP,
    setProtocol,
    round,
    setRoound,
  } = params;
  const loadSong = useSong((state) => state.loadSong);
  const songs = useSong((state) => state.songs);
  const mode = useXR((state) => state.mode);
  const session = useXR((state) => state.session);
  const songData = useSong((state) => state.songData);
  const passthrough = useSong((state) => state.passthrough);
  const setPassthrough = useSong((state) => state.setPassthrough);

  const [dataLayerNumber, setDataLayerNumber] = useState(-1);
  const [errorMessage, setErrorMessage] = useState("");

  const layers = [
    "Create Application Layer",
    "Create Transport Layer",
    "Create Network Layer",
    "Create Data Link Layer",
    "Create Physical Layer"
  ];

  const freshAttributes = [
    [
      { label: "Actual Data", selected: false },
      { label: "Application Layer Protocols", selected: false },
      { label: "Binary Data", selected: false }
    ],
    [
      { label: "TCP", selected: false },
      { label: "UDP", selected: false }
    ],
    [
      { label: "Routing Data Packets", selected: false },
      { label: "Protocols IP", selected: false }
    ],
    [
      { label: "Reliable Communication", selected: false },
      { label: "Protocols Ethernet and Wi-Fi", selected: false }
    ],
    [
      { label: "Transmitting Raw Binary Data", selected: false },
      { label: "Physical Medium (Wires, Fiber, Wireless)", selected: false }
    ]
  ];

  const [attributes, setAttributes] = useState(freshAttributes);

  // Every time this UI becomes visible (round changes or component mounts),
  // reset back to the Welcome/Intro screen so we always start fresh.
  useEffect(() => {
    setDataLayerNumber(-1);
    setErrorMessage("");
    setAttributes(freshAttributes);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  // Check completion: For Transport Layer (index 1), at least one protocol must be selected.
  // For all other layers, ALL attributes must be selected.
  const isCurrentLayerComplete =
    dataLayerNumber >= 0 &&
    (dataLayerNumber === 1
      ? attributes[1]?.some((attr) => attr.selected) ?? false
      : attributes[dataLayerNumber]?.every((attr) => attr.selected) ?? false);

  const toggleAttribute = (layerIdx, attrIdx) => {
    if (layerIdx < 0) return;
    setErrorMessage("");

    if (layerIdx === 1) {
      const selectedLabel = attributes[1][attrIdx].label.trim();
      setProtocol?.(selectedLabel);
      setIsTCP?.(selectedLabel === "TCP");
    }

    setAttributes((prev) => {
      const updated = [...prev];

      // Special single-choice handling for Transport Layer (index 1)
      if (layerIdx === 1) {
        updated[1] = updated[1].map((attr, idx) => ({
          ...attr,
          selected: idx === attrIdx
        }));
      } else {
        // Multi-select for other layers
        updated[layerIdx] = [...updated[layerIdx]];
        updated[layerIdx][attrIdx] = {
          ...updated[layerIdx][attrIdx],
          selected: !updated[layerIdx][attrIdx].selected
        };
      }

      return updated;
    });
  };

  const nextLayer = () => {
    if (dataLayerNumber >= 0 && !isCurrentLayerComplete) {
      if (dataLayerNumber === 1) {
        setErrorMessage("Please select either TCP or UDP to proceed!");
      } else {
        setErrorMessage("Please select ALL attributes to proceed to the next layer!");
      }
      return;
    }

    setErrorMessage("");

    if (dataLayerNumber === layers.length - 1) {
      const selectedProtocol = attributes[1]?.find((attr) => attr.selected)?.label;
      setProtocol?.(selectedProtocol);
      setIsTCP?.(selectedProtocol === "TCP");
      if (setIsLayerComplete) setIsLayerComplete(false);
      if (onLayersComplete) onLayersComplete();
      return;
    }

    setDataLayerNumber((prev) => prev + 1);
  };

  const dataLayerDescription = [
    `We are going to send message from left laptop to right laptop(look around) . You will create message laeyer by layer and transmit it to final destination. Your messages is Hello Server. Click next to send`,
    `Application Layer Consist of three things:

1. Application Layer Protocols (HTTP, FTP, SMTP, DNS, DHCP, SNMP, Telnet, SSH, POP3, IMAP)
2. Actual Data being sent and received
3. Binary Data (1s and 0s) that is sent over the network.

The Application Layer is responsible for providing services to the user and enabling communication between applications on different devices. It is the topmost layer of the OSI model and interacts directly with the end-user.`,

    `Transport Layer is responsible for providing reliable data transfer between two devices on a network. It ensures that data is delivered in the correct order and without errors.

The Transport Layer uses protocols such as TCP (Transmission Control Protocol) it retransmit data if packets are lost and UDP (User Datagram Protocol) does not transmit data if packets are lost to manage the flow of data between applications on different devices. It also provides error detection and correction mechanisms to ensure that data is transmitted accurately.Choose which you want to use for your message transmission. TCP is reliable but slower, while UDP is faster but less reliable. Click next to send your message using the selected protocol.`,

    `Network Layer is responsible for routing data packets between devices on different networks. It determines the best path for data to travel from the source device to the destination device.

The Network Layer uses protocols such as IP (Internet Protocol) to address and route data packets. It also handles fragmentation and reassembly of data packets to ensure that they can be transmitted across different types of networks.`,

    `Data Link Layer is responsible for providing reliable communication between two devices on the same network. It ensures that data is transmitted without errors and in the correct order.

The Data Link Layer uses protocols such as Ethernet and Wi-Fi to manage the flow of data between devices on a local area network (LAN). It also provides error detection and correction mechanisms to ensure that data is transmitted accurately.`,

    `Physical Layer is responsible for transmitting raw binary data over a physical medium, such as copper wires, fiber optic cables, or wireless signals.

It defines the electrical, mechanical, and procedural aspects of data transmission, including voltage levels.`
  ];

  if (songData) {
    return null;
  }

  const currentDescription = dataLayerDescription[dataLayerNumber + 1] ?? "";
  const currentLayerName = layers[dataLayerNumber] ?? "Welcome / Intro";
  const currentAttributes = attributes[dataLayerNumber] ?? [];

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
              gap={12}
              width="100%"
            >
              {/* Header Title */}
              <Container flexDirection="row" justifyContent="center" alignItems="center" gap={8}>
                <Text fontSize={22} textAlign="center" fontWeight="bold">
                  {currentLayerName}
                </Text>
                {isCurrentLayerComplete && (
                  <Image src={tickIcon} width={20} height={20} />
                )}
              </Container>

              {/* Paragraphs */}
              <Container flexDirection="column" gap={8} width="100%">
                {currentDescription
                  .split("\n")
                  .map((paragraph, index) =>
                    paragraph.trim() === "" ? null : (
                      <Text
                        key={index}
                        fontSize={14}
                        lineHeight={14}
                        textAlign="left"
                      >
                        {paragraph}
                      </Text>
                    )
                  )}
              </Container>

              {/* Attributes Options */}
              {dataLayerNumber >= 0 && (
                <Container flexDirection="column" gap={8} marginTop={12}>
                  <Text fontSize={14} fontWeight="bold">
                    {dataLayerNumber === 1
                      ? "Select one protocol for Transport Layer:"
                      : `Select attributes of ${currentLayerName}:`}
                  </Text>

                  <Container flexDirection="row" gap={8} flexWrap="wrap">
                    {currentAttributes.map((attr, attrIdx) => (
                      <Button
                        key={attrIdx}
                        variant={attr.selected ? "solid" : "rect"}
                        size="sm"
                        onClick={() => toggleAttribute(dataLayerNumber, attrIdx)}
                      >
                        <Container flexDirection="row" alignItems="center" gap={6}>
                          {attr.selected && (
                            <Image src={tickIcon} width={14} height={14} />
                          )}
                          <Text>{attr.label}</Text>
                        </Container>
                      </Button>
                    ))}
                  </Container>
                </Container>
              )}

              {/* Error Message */}
              {errorMessage !== "" && (
                <Text fontSize={12} textAlign="center">
                  {errorMessage}
                </Text>
              )}

              {/* Next Button */}
              <Button
                variant={isCurrentLayerComplete || dataLayerNumber === -1 ? "solid" : "rect"}
                size="sm"
                platter
                marginTop={8}
                onClick={nextLayer}
              >
                <Container flexDirection="row" alignItems="center" gap={6}>
                  {isCurrentLayerComplete && (
                    <Image src={tickIcon} width={16} height={16} />
                  )}
                  <Text>
                    {dataLayerNumber === -1
                      ? "Start Simulation"
                      : dataLayerNumber === layers.length - 1
                      ? "Finish All Layers"
                      : isCurrentLayerComplete
                      ? "Next Layer"
                      : dataLayerNumber === 1
                      ? "Next Layer (Select Protocol)"
                      : "Next Layer (Select All Attributes)"}
                  </Text>
                </Container>
              </Button>

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