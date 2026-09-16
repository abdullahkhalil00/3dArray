import { Container, Root, Text } from "@react-three/uikit";
import { Card, Button, Defaults } from "@react-three/uikit-apfel";

export function DragableUI({
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
  onMoveClick,
  currentStep = 0,
  round = 0,
  isTCP = true,
  protocol,
}) {
  // At Central Router (step 2) on Round 0 the packet is blocked —
  // the button is disabled here so the user must interact via SecondUI.
  const isBlocked = currentStep === 2 && round === 0;

  const getButtonText = () => {
    switch (currentStep) {
      case 0: return "Move to Left Router";
      case 1: return "Move to Center Router";
      case 2:
        return isBlocked
          ? protocol === "TCP"
            ? "Packet Lost — See Panel"
            : "Packet Lost — See Panel"
          : "Move to Right Router";
      case 3: return "Move to Right Laptop";
      default: return "Reset";
    }
  };

  return (
    <group position={position} scale={scale} rotation={rotation}>
      <Defaults>
        <Root pixelSize={0.005}>
          <Container flexDirection="column" alignItems="center" gap={32}>
            <Card
              borderRadius={32}
              padding={24}
              flexDirection="column"
              alignItems="center"
              gap={16}
              width={220}
            >
              <Container flexDirection="column" alignItems="stretch" gap={12} width="100%">
                {/* Title */}
                <Container flexDirection="row" justifyContent="center" alignItems="center" gap={8}>
                  <Text fontSize={22} textAlign="center" fontWeight="bold">
                    Ethernet Header
                  </Text>
                </Container>

                {/* Protocol badge */}
                <Container flexDirection="row" justifyContent="center">
                  <Text
                    fontSize={12}
                    textAlign="center"
                    color={protocol === "TCP" ? "#00aaff" : "#ffaa00"}
                  >
                    Protocol: {protocol ?? "—"}
                  </Text>
                </Container>

                {/* Move / Blocked button */}
                <Button
                  onClick={isBlocked ? undefined : onMoveClick}
                  padding={12}
                  marginTop={8}
                  variant={isBlocked ? "rect" : "solid"}
                >
                  <Text
                    fontSize={14}
                    textAlign="center"
                    color={isBlocked ? "#ff4444" : "#ffffff"}
                  >
                    {getButtonText()}
                  </Text>
                </Button>
              </Container>
            </Card>
          </Container>
        </Root>
      </Defaults>
    </group>
  );
}