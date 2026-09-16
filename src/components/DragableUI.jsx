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
}) {
  // Center Router (Step 2) par round === 0 hone se block condition apply hogi
  const isBlocked = currentStep === 2 && round === 0;

  const getButtonText = () => {
    switch (currentStep) {
      case 0:
        return "Move to Left Router";
      case 1:
        return "Move to Center Router";
      case 2:
        if (isBlocked) {
          return isTCP ? "Packet Lost (Retransmit Required)" : "Packet Lost (Reset Required)";
        }
        return "Move to Right Router";
      case 3:
        return "Move to Right Laptop";
      default:
        return "Reset Position";
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
                <Container flexDirection="row" justifyContent="center" alignItems="center" gap={8}>
                  <Text fontSize={22} textAlign="center" fontWeight="bold">
                    Ethernet Header
                  </Text>
                </Container>
                
                <Button 
                  onClick={isBlocked ? null : onMoveClick} 
                  padding={12} 
                  marginTop={8}
                  variant={isBlocked ? "rect" : "solid"}
                >
                  <Text fontSize={14} textAlign="center" color={isBlocked ? "#ff4444" : "#ffffff"}>
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