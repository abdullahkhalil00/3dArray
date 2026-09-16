import { Container, Image, Root, Text } from "@react-three/uikit";
import { Button, Card, Defaults } from "@react-three/uikit-apfel";
import { useXR } from "@react-three/xr";
import { store } from "../App";
import { useSong } from "../hooks/useSong";

import tickIcon from "../assets/icons8-tick-50.png";

export function SecondUI(params) {
  const {
    isAtLeftRouter,
    isAtCenterRouter,
    isAtRightRouter,
    isAtRightLaptop,
    isTCP,
    resetToLeftLaptop,
    fullResetToStart,
    round,
    setRound,
  } = params;

  const mode = useXR((state) => state.mode);
  const session = useXR((state) => state.session);
  const songData = useSong((state) => state.songData);
  const passthrough = useSong((state) => state.passthrough);
  const setPassthrough = useSong((state) => state.setPassthrough);

  // TCP: Round 1 set karke left laptop se dobara start
  const handleTcpRetransmit = () => {
    if (setRound) setRound(1);
    if (resetToLeftLaptop) resetToLeftLaptop();
  };

  // UDP: pehli UI par wapas (layers recreate), round 2
  const handleUdpReset = () => {
    if (fullResetToStart) fullResetToStart();
  };

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
            Path Found: Searching route to transfer data through Central Router.
          </Text>
          <Text fontSize={12} textAlign="center" opacity={0.8}>
            Next Hop: Central Router {round === 1 ? "(Round 1: Unblocked Path)" : ""}
          </Text>
        </Container>
      );
    }

    if (isAtCenterRouter) {
      // Agar Round 0 hai tab error / block hoga
      if (round === 0) {
        if (isTCP) {
          return (
            <Container
              flexDirection="column"
              gap={8}
              padding={12}
              backgroundColor="rgba(80, 0, 0, 0.4)"
              borderRadius={12}
            >
              <Text fontSize={16} fontWeight="bold" textAlign="center" color="#ff4444">
                TCP Error: Central Router
              </Text>
              <Text fontSize={13} textAlign="center" color="#ffffff">
                Cannot proceed! Packet lost at Central Router. Click retransmit to send via Round 1.
              </Text>
              <Button
                variant="solid"
                size="sm"
                marginTop={8}
                onClick={handleTcpRetransmit}
              >
                <Text>Retransmit</Text>
              </Button>
            </Container>
          );
        } else {
          return (
            <Container
              flexDirection="column"
              gap={8}
              padding={12}
              backgroundColor="rgba(80, 40, 0, 0.4)"
              borderRadius={12}
            >
              <Text fontSize={16} fontWeight="bold" textAlign="center" color="#ffaa00">
                UDP Error: Central Router
              </Text>
              <Text fontSize={13} textAlign="center" color="#ffffff">
                Packet lost! UDP cannot retransmit lost data. Start over.
              </Text>
              <Button
                variant="solid"
                size="sm"
                marginTop={8}
                onClick={handleUdpReset}
              >
                <Text>Retransmit</Text>
              </Button>
            </Container>
          );
        }
      }

      const successfulRoundLabel = `Round ${round} Passed`;

      return (
        <Container
          flexDirection="column"
          gap={6}
          padding={12}
          backgroundColor="rgba(0,0,0,0.2)"
          borderRadius={12}
        >
          <Text fontSize={16} fontWeight="bold" textAlign="center" color="#00ff88">
            Routing Table: Central Router ({successfulRoundLabel})
          </Text>
          <Text fontSize={13} textAlign="center">
            Packet successfully verified! Proceeding to Right Router.
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
            Destination Router Reached: Forwarding data packet to target laptop.
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
          <Text fontSize={16} fontWeight="bold" textAlign="center" color="#f7f7f7">
            Packet Delivered!
          </Text>
          <Text fontSize={13} textAlign="center">
            Data successfully transferred to final destination.
          </Text>
        </Container>
      );
    }

    return null;
  };

  if (songData) return null;

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
                  Network Routing Status
                </Text>
              </Container>

              {renderRouterTableInfo()}

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
            </Container>
          </Card>
        </Container>
      </Root>
    </Defaults>
  );
}