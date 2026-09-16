import { Container, Image, Root, Text } from "@react-three/uikit";
import { Button, Card, Defaults } from "@react-three/uikit-apfel";
import { useXR } from "@react-three/xr";
import { store } from "../App";
import { useSong } from "../hooks/useSong";

import tickIcon from "../assets/icons8-tick-50.png";

// ─── UDP OSI Layer walkthrough data ──────────────────────────────────────────
// These are shown step-by-step inside SecondUI after a UDP packet loss,
// teaching the user that UDP must rebuild the packet from the Application layer.
const UDP_LAYERS = [
  {
    title: "Application Layer",
    description:
      "Rebuilding the message from scratch. The Application Layer is responsible for providing services to the user and enabling communication between applications.\n\nProtocols: HTTP, FTP, SMTP, DNS, DHCP, SNMP, SSH.\n\nActual Data: \"Hello Server\" (binary: 01001000 01100101 …)",
  },
  {
    title: "Network Layer",
    description:
      "Attaching IP header. The Network Layer routes data packets between devices on different networks.\n\nProtocol: IP — addresses the packet with source IP and destination IP so routers can forward it to the correct destination.",
  },
  {
    title: "Data Link Layer",
    description:
      "Attaching MAC header. The Data Link Layer ensures reliable communication between two devices on the same network segment.\n\nProtocols: Ethernet, Wi-Fi — adds source/destination MAC addresses and an error-detection checksum (CRC).",
  },
  {
    title: "Physical Layer",
    description:
      "Converting to raw bits. The Physical Layer transmits raw binary data over a physical medium such as copper wires, fiber optic cables, or wireless signals.\n\nVoltage levels, timing, and signal encoding are handled here.",
  },
  {
    title: "Ethernet Header — Ready to Transmit",
    description:
      "All layers are encapsulated. The packet now has the Ethernet header attached and is ready to be transmitted from the Left Laptop.\n\nClick \"Send Packet\" to start transmission.",
  },
];

export function SecondUI(params) {
  const {
    isAtLeftRouter,
    isAtCenterRouter,
    isAtRightRouter,
    isAtRightLaptop,
    isTCP,
    protocol,
    resetToLeftLaptop,
    fullResetToStart,
    round,
    setRound,
    udpRetransmitStep,
    setUdpRetransmitStep,
    onUdpLayersComplete,
  } = params;

  const mode = useXR((state) => state.mode);
  const session = useXR((state) => state.session);
  const songData = useSong((state) => state.songData);
  const passthrough = useSong((state) => state.passthrough);
  const setPassthrough = useSong((state) => state.setPassthrough);

  // ── Handlers ───────────────────────────────────────────────────────────────

  // TCP: restart packet from Left Laptop (round 1)
  const handleTcpRetransmit = () => {
    if (resetToLeftLaptop) resetToLeftLaptop();
  };

  // UDP: begin OSI layer walkthrough inside SecondUI (round 2)
  const handleUdpRetransmit = () => {
    if (fullResetToStart) fullResetToStart();
  };

  // Advance through UDP OSI walkthrough steps
  const handleUdpNext = () => {
    const nextStep = udpRetransmitStep + 1;
    if (nextStep >= UDP_LAYERS.length) {
      // All layers shown + Ethernet header → start packet animation
      if (onUdpLayersComplete) onUdpLayersComplete();
    } else {
      if (setUdpRetransmitStep) setUdpRetransmitStep(nextStep);
    }
  };

  // ── XR Controls (shared footer) ───────────────────────────────────────────
  const renderXRControls = () => (
    <Container flexDirection="row" justifyContent="space-evenly" gap={8} marginTop={12}>
      {mode === null ? (
        <Button variant="rect" size="sm" platter flexGrow={1} onClick={() => store.enterAR()}>
          <Text>VR/AR</Text>
        </Button>
      ) : (
        <>
          <Button variant="rect" size="sm" platter flexGrow={1} onClick={() => setPassthrough(!passthrough)}>
            <Text>Passthrough</Text>
          </Button>
          <Button variant="rect" size="sm" platter flexGrow={1} onClick={() => session.end()}>
            <Text>Exit VR</Text>
          </Button>
        </>
      )}
    </Container>
  );

  if (songData) return null;

  // ── UDP OSI Layer Walkthrough ──────────────────────────────────────────────
  // Active when user clicked UDP retransmit and has not yet finished the walkthrough
  if (udpRetransmitStep >= 0 && udpRetransmitStep < UDP_LAYERS.length) {
    const layer = UDP_LAYERS[udpRetransmitStep];
    const isLastStep = udpRetransmitStep === UDP_LAYERS.length - 1;

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
              <Container flexDirection="column" alignItems="stretch" gap={16} width="100%">
                {/* Header */}
                <Container flexDirection="row" justifyContent="center" alignItems="center" gap={8}>
                  <Text fontSize={22} textAlign="center" fontWeight="bold">
                    UDP Retransmit — Rebuilding Packet
                  </Text>
                </Container>

                {/* Step progress indicator */}
                <Container flexDirection="row" justifyContent="center" gap={6}>
                  {UDP_LAYERS.map((_, idx) => (
                    <Container
                      key={idx}
                      width={idx === udpRetransmitStep ? 24 : 10}
                      height={10}
                      borderRadius={5}
                      backgroundColor={
                        idx < udpRetransmitStep
                          ? "#00ff88"
                          : idx === udpRetransmitStep
                            ? "#00aaff"
                            : "#444444"
                      }
                    />
                  ))}
                </Container>

                {/* Layer card */}
                <Container
                  flexDirection="column"
                  gap={8}
                  padding={16}
                  backgroundColor="rgba(0, 120, 255, 0.1)"
                  borderRadius={16}
                >
                  <Text fontSize={18} fontWeight="bold" textAlign="center" color="#00aaff">
                    {layer.title}
                  </Text>
                  {layer.description.split("\n").map((line, i) =>
                    line.trim() === "" ? null : (
                      <Text key={i} fontSize={13} lineHeight={13} textAlign="left">
                        {line}
                      </Text>
                    )
                  )}
                </Container>

                {/* Action button */}
                <Button
                  variant="solid"
                  size="sm"
                  marginTop={8}
                  onClick={handleUdpNext}
                >
                  <Container flexDirection="row" alignItems="center" gap={6}>
                    <Image src={tickIcon} width={14} height={14} />
                    <Text>{isLastStep ? "Send Packet" : "Next Layer"}</Text>
                  </Container>
                </Button>

                {renderXRControls()}
              </Container>
            </Card>
          </Container>
        </Root>
      </Defaults>
    );
  }

  // ── Normal SecondUI (router status / error panel) ─────────────────────────
  const renderRouterInfo = () => {
    // ── Left Router ──────────────────────────────────────────────────────────
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
            Path found — searching route to Central Router.
          </Text>
          <Text fontSize={12} textAlign="center" opacity={0.8}>
            Next Hop: Central Router
            {round >= 1 ? " (Retry Path — Unblocked)" : ""}
          </Text>
        </Container>
      );
    }

    // ── Central Router ────────────────────────────────────────────────────────
    if (isAtCenterRouter) {
      // Round 0 → show error for both protocols
      if (round === 0) {
        if (protocol === "TCP") {
          return (
            <Container
              flexDirection="column"
              gap={8}
              padding={16}
              backgroundColor="rgba(80, 0, 0, 0.4)"
              borderRadius={12}
            >
              <Text fontSize={16} fontWeight="bold" textAlign="center" color="#ff4444">
                ⚠ Central Router — Packet Lost (TCP)
              </Text>
              <Text fontSize={13} textAlign="center" color="#ffffff">
                The packet was lost at the Central Router.
              </Text>
              <Text fontSize={13} textAlign="center" color="#ffcccc">
                TCP detected the loss and will automatically retransmit.
                Click Retransmit to resend the packet from the Left Laptop.
              </Text>
              <Button
                variant="solid"
                size="sm"
                marginTop={8}
                onClick={handleTcpRetransmit}
              >
                <Text>Retransmit (TCP)</Text>
              </Button>
            </Container>
          );
        }

        // UDP error
        return (
          <Container
            flexDirection="column"
            gap={8}
            padding={16}
            backgroundColor="rgba(80, 40, 0, 0.4)"
            borderRadius={12}
          >
            <Text fontSize={16} fontWeight="bold" textAlign="center" color="#ffaa00">
              ⚠ Central Router — Packet Lost (UDP)
            </Text>
            <Text fontSize={13} textAlign="center" color="#ffffff">
              The packet was lost at the Central Router.
            </Text>
            <Text fontSize={13} textAlign="center" color="#ffe0a0">
              UDP does NOT retransmit lost packets.
              You must rebuild the packet from the Application Layer and retransmit manually.
            </Text>
            <Button
              variant="solid"
              size="sm"
              marginTop={8}
              onClick={handleUdpRetransmit}
            >
              <Text>Rebuild &amp; Retransmit (UDP)</Text>
            </Button>
          </Container>
        );
      }

      // Round ≥ 1 → success at Central Router
      return (
        <Container
          flexDirection="column"
          gap={6}
          padding={12}
          backgroundColor="rgba(0, 80, 0, 0.3)"
          borderRadius={12}
        >
          <Text fontSize={16} fontWeight="bold" textAlign="center" color="#00ff88">
            ✓ Central Router — Packet Verified
          </Text>
          <Text fontSize={13} textAlign="center">
            Packet successfully forwarded to Right Router.
          </Text>
        </Container>
      );
    }

    // ── Right Router ──────────────────────────────────────────────────────────
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
            Destination router reached — forwarding to target laptop.
          </Text>
        </Container>
      );
    }

    // ── Right Laptop (delivered) ───────────────────────────────────────────────
    if (isAtRightLaptop) {
      return (
        <Container
          flexDirection="column"
          gap={8}
          padding={12}
          backgroundColor="rgba(0, 80, 0, 0.3)"
          borderRadius={12}
        >
          <Text fontSize={16} fontWeight="bold" textAlign="center" color="#00ff88">
            ✓ Packet Delivered!
          </Text>
          <Text fontSize={13} textAlign="center">
            Data successfully transferred to the final destination.
          </Text>
          <Text fontSize={12} textAlign="center" opacity={0.8}>
            Protocol used: {protocol}
          </Text>
          <Button
            variant="solid"
            size="sm"
            marginTop={8}
            onClick={() => window.location.reload()}
          >
            <Text>Start Over</Text>
          </Button>
        </Container>
      );
    }

    return null;
  };

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
            <Container flexDirection="column" alignItems="stretch" gap={16} width="100%">
              <Container flexDirection="row" justifyContent="center" alignItems="center" gap={8}>
                <Text fontSize={22} textAlign="center" fontWeight="bold">
                  Network Routing Status (Look on left router)
                </Text>
              </Container>

              {renderRouterInfo()}

              {renderXRControls()}
            </Container>
          </Card>
        </Container>
      </Root>
    </Defaults>
  );
}