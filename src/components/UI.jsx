import { Container, Root, Text } from "@react-three/uikit";
import { Button, Card, Defaults } from "@react-three/uikit-apfel";
import { useState, useCallback } from "react";

// Generate a random 3x3x3 array with values 1-99
function generateRandom3DArray() {
  const arr = [];
  for (let i = 0; i < 3; i++) {
    arr[i] = [];
    for (let j = 0; j < 3; j++) {
      arr[i][j] = [];
      for (let k = 0; k < 3; k++) {
        arr[i][j][k] = Math.floor(Math.random() * 99) + 1;
      }
    }
  }
  return arr;
}

// Deep clone a 3D array
function cloneArray(arr) {
  return arr.map((layer) => layer.map((row) => [...row]));
}

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

  // ── State ──────────────────────────────────────────────────────────
  const [array3D, setArray3D] = useState(() => generateRandom3DArray());
  const [greatest, setGreatest] = useState(null); // the value held "on top"
  const [sortStarted, setSortStarted] = useState(false);
  const [sortDone, setSortDone] = useState(false);

  // Current position in the three nested loops
  const [loopI, setLoopI] = useState(0); // outer loop  (layer)
  const [loopJ, setLoopJ] = useState(0); // middle loop (row)
  const [loopK, setLoopK] = useState(0); // inner loop  (column)

  // Phase within each step:
  //   "ask"     → show comparison, ask user if condition is true
  //   "holding" → user said yes, greatest is held, waiting to place
  //   "idle"    → ready for next comparison
  const [phase, setPhase] = useState("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const [swapCount, setSwapCount] = useState(0);
  const [comparisonCount, setComparisonCount] = useState(0);

  // Flatten helper — returns { flatIdx, i, j, k } for position n in a 3×3×3
  const flatToIJK = (n) => ({
    i: Math.floor(n / 9),
    j: Math.floor((n % 9) / 3),
    k: n % 3,
  });
  const ijkToFlat = (i, j, k) => i * 9 + j * 3 + k;

  // Total elements
  const TOTAL = 27; // 3*3*3

  // ── Advance to next comparison position ─────────────────────────
  const advancePosition = useCallback(
    (currentFlat) => {
      // Bubble sort on flattened 3D array:
      // outer pass i: 0..TOTAL-2  (controls how many passes)
      // inner pass through j: 0..TOTAL-2-i  (compare adjacent elements)
      // We use loopI as the outer pass index, and loopJ*3+loopK as the inner comparison index
      // But the user wants three visible loops, so we keep i, j, k as layer/row/col of the
      // "current element being compared" in the flat traversal.

      let nextFlat = currentFlat + 1;
      const maxInner = TOTAL - 1 - loopI; // last valid comparison position for this pass

      if (nextFlat < maxInner) {
        const pos = flatToIJK(nextFlat);
        setLoopJ(pos.j);
        setLoopK(pos.k);
        // loopI stays the same (same outer pass)
        // Update i component of inner position for display
        const posI = flatToIJK(nextFlat);
        setLoopJ(posI.j);
        setLoopK(posI.k);
        return true; // more comparisons in this pass
      } else {
        // This pass is done, move to next outer pass
        const nextI = loopI + 1;
        if (nextI < TOTAL - 1) {
          setLoopI(nextI);
          setLoopJ(0);
          setLoopK(0);
          return true; // more passes
        } else {
          return false; // sort complete
        }
      }
    },
    [loopI]
  );

  // ── Start sorting ──────────────────────────────────────────────
  const handleStart = () => {
    setSortStarted(true);
    setSortDone(false);
    setLoopI(0);
    setLoopJ(0);
    setLoopK(0);
    setGreatest(null);
    setPhase("ask");
    setStatusMsg("");
    setSwapCount(0);
    setComparisonCount(0);
  };

  // ── Reset ──────────────────────────────────────────────────────
  const handleReset = () => {
    setArray3D(generateRandom3DArray());
    setSortStarted(false);
    setSortDone(false);
    setLoopI(0);
    setLoopJ(0);
    setLoopK(0);
    setGreatest(null);
    setPhase("idle");
    setStatusMsg("");
    setSwapCount(0);
    setComparisonCount(0);
  };

  // Current flat index for the inner loop comparison
  // We treat the 3D array as flat for bubble sort.
  // The "inner index" within the current pass = loopJ * 3 + loopK   (but we need layer too)
  // Actually let's simplify: flatten using loopI as outer pass, and a single inner counter.
  // For display we convert the inner counter back to i,j,k.

  // We'll compute the inner flat position from loopJ and loopK and the layer component:
  // innerFlat represents the current position in the flat array we're comparing.
  // Since 3x3x3, row = loopJ, col = loopK, but we also need the layer.
  // Let's use a single flat counter for the inner loop.
  // innerFlat = current position = we derive it from loopJ, loopK
  // Actually, let me restructure: use a single innerFlat state.

  // Let me recalculate: The flat position of the current comparison element.
  // We store the inner loop position as a single flat index derived from (loopI is outer pass).
  // For display, we show the 3 loop indices: pass=loopI, and the current element position in i,j,k.

  // Current comparison: flat position in the array
  // We'll derive this differently. Let's use loopJ as the flat inner index directly.
  // And loopK is unused for logic but we set it for display.

  // SIMPLIFICATION: Let me use loopI = outer pass, and a separate innerIdx state.
  // But since I already have loopJ and loopK, let me combine them:
  // innerFlat = loopJ (I'll just use loopJ as the flat inner index)

  // Actually, the user wants to see 3 loops. Let me map the flat inner index to 3D coords for display.
  const innerFlat = loopJ * 3 + loopK;
  // But we also need the layer dimension. Let me use a different approach:
  // I'll treat innerFlat as just loopJ (relabel), and compute layer/row/col from it.

  // OK let me just simplify the state. loopI = outer pass (0..25), 
  // innerFlat = current comparison index within the pass.
  // For the 3-loop display, I'll decompose innerFlat into layer(i), row(j), col(k).

  // Let me re-derive. I'll use loopJ as the raw inner flat index (0..TOTAL-2-loopI).
  // Display coords:
  const currentPos = flatToIJK(loopJ);
  const nextPos = flatToIJK(loopJ + 1);
  const currentVal =
    loopJ < TOTAL
      ? array3D[currentPos.i]?.[currentPos.j]?.[currentPos.k]
      : null;
  const nextVal =
    loopJ + 1 < TOTAL
      ? array3D[nextPos.i]?.[nextPos.j]?.[nextPos.k]
      : null;

  // ── User says "Yes, condition is true" (currentVal > nextVal → swap) ──
  const handleYes = () => {
    if (phase !== "ask") return;
    setComparisonCount((c) => c + 1);

    if (currentVal > nextVal) {
      // Condition IS true → hold the greater value
      setGreatest(currentVal);
      setStatusMsg(
        `✓ Correct! ${currentVal} > ${nextVal} is TRUE. Holding ${currentVal} as greatest. Click "Place" to swap.`
      );
      setPhase("holding");
    } else {
      // User said yes but condition is actually false
      setStatusMsg(
        `✗ Incorrect. ${currentVal} > ${nextVal} is FALSE. No swap needed. Try again.`
      );
    }
  };

  // ── User says "No, condition is false" (no swap) ──
  const handleNo = () => {
    if (phase !== "ask") return;
    setComparisonCount((c) => c + 1);

    if (currentVal <= nextVal) {
      // Correct — no swap needed
      setGreatest(null);
      setStatusMsg(
        `✓ Correct! ${currentVal} > ${nextVal} is FALSE. No swap needed. Moving to next.`
      );
      // Advance
      moveToNext();
    } else {
      // User said no but condition is actually true
      setStatusMsg(
        `✗ Incorrect. ${currentVal} > ${nextVal} is TRUE. A swap IS needed. Try again.`
      );
    }
  };

  // ── Place the held greatest value (perform the swap) ──
  const handlePlace = () => {
    if (phase !== "holding") return;

    const newArr = cloneArray(array3D);
    const a = currentPos;
    const b = nextPos;

    // Swap
    const temp = newArr[a.i][a.j][a.k];
    newArr[a.i][a.j][a.k] = newArr[b.i][b.j][b.k];
    newArr[b.i][b.j][b.k] = temp;

    setArray3D(newArr);
    setSwapCount((c) => c + 1);
    setGreatest(null);
    setStatusMsg(`Swapped! ${currentVal} ↔ ${nextVal}. Moving to next comparison.`);

    moveToNext();
  };

  // ── Move to the next comparison ──
  const moveToNext = () => {
    const maxInner = TOTAL - 1 - loopI;
    const nextInner = loopJ + 1;

    if (nextInner < maxInner) {
      setLoopJ(nextInner);
      setLoopK(0); // k is derived from display, not used for logic
      setPhase("ask");
      setStatusMsg("");
    } else {
      // This pass is complete
      const nextPass = loopI + 1;
      if (nextPass < TOTAL - 1) {
        setLoopI(nextPass);
        setLoopJ(0);
        setLoopK(0);
        setPhase("ask");
        setStatusMsg(`Pass ${loopI + 1} complete! Starting pass ${nextPass + 1}...`);
      } else {
        // All passes done
        setSortDone(true);
        setPhase("idle");
        setStatusMsg("🎉 Bubble Sort Complete! The 3D array is now sorted.");
        setGreatest(null);
      }
    }
  };

  // ── Render the 3D array as three layers ────────────────────────
  const renderArray = () => {
    const layers = [];
    for (let i = 0; i < 3; i++) {
      const rows = [];
      for (let j = 0; j < 3; j++) {
        const cols = [];
        for (let k = 0; k < 3; k++) {
          const flat = ijkToFlat(i, j, k);
          const isCurrentCompare = sortStarted && !sortDone && loopJ === flat;
          const isNextCompare = sortStarted && !sortDone && loopJ + 1 === flat;
          const isHighlighted = isCurrentCompare || isNextCompare;

          cols.push(
            <Container
              key={`${i}-${j}-${k}`}
              width={56}
              height={40}
              borderRadius={8}
              alignItems="center"
              justifyContent="center"
              backgroundColor={
                isCurrentCompare
                  ? "#ff6b6b"
                  : isNextCompare
                    ? "#ffd93d"
                    : "#e8e8e8"
              }
              borderWidth={isHighlighted ? 2 : 1}
              borderColor={isHighlighted ? "#333" : "#ccc"}
            >
              <Text
                fontSize={isHighlighted ? 16 : 14}
                fontWeight={isHighlighted ? "bold" : "normal"}
                color="#000000"
              >
                {String(array3D[i][j][k])}
              </Text>
            </Container>
          );
        }
        rows.push(
          <Container key={`row-${i}-${j}`} flexDirection="row" gap={4}>
            {cols}
          </Container>
        );
      }
      layers.push(
        <Container key={`layer-${i}`} flexDirection="column" gap={4} alignItems="center">
          <Text fontSize={11} fontWeight="bold">
            {`Layer ${i}`}
          </Text>
          {rows}
        </Container>
      );
    }
    return layers;
  };

  return (
    <Defaults>
      <Root>

        <Container
          flexDirection="column"
          alignItems="center"
          gap={16}
        >
          {/* ── Action Buttons ── */}
          <Container flexDirection="row" gap={12} justifyContent="center" marginTop={0}>
            {!sortStarted && !sortDone && (
              <Button variant="solid" size="sm" platter onClick={handleStart}>
                <Text>Start Bubble Sort</Text>
              </Button>
            )}
            {sortDone && (
              <Text fontSize={16} fontWeight="bold">
                {"Array Sorted Successfully!"}
              </Text>
            )}
            <Button variant="rect" size="sm" platter onClick={handleReset}>
              <Text>Reset / New Array</Text>
            </Button>
          </Container>
          <Card
            borderRadius={32}
            padding={24}
            flexDirection="column"
            alignItems="center"
            gap={14}
            width={850}
          >
            {/* ── Title ── */}
            <Text fontSize={22} fontWeight="bold" textAlign="center">
              {"3D Array Bubble Sort (3x3x3)"}
            </Text>

            {/* ── Greatest Value Holder (Top Text) ── */}
            <Card
              borderRadius={16}
              padding={12}
              width="100%"
              backgroundColor={greatest !== null ? "#ffe066" : "#f0f0f0"}
              alignItems="center"
              justifyContent="center"
            >
              <Text
                fontSize={18}
                fontWeight="bold"
                textAlign="center"
              >
                {greatest !== null
                  ? `Greatest (Held): ${greatest}`
                  : "Greatest: -- (No value held)"}
              </Text>
            </Card>

            {/* ── Loop Indices Display ── */}
            {sortStarted && !sortDone && (
              <Container flexDirection="row" gap={16} justifyContent="center">
                <Container
                  backgroundColor="#dfe6e9"
                  borderRadius={8}
                  padding={6}
                  paddingLeft={10}
                  paddingRight={10}
                >
                  <Text fontSize={12} fontWeight="bold" color="#000000">
                    {`Pass (i): ${loopI}`}
                  </Text>
                </Container>
                <Container
                  backgroundColor="#dfe6e9"
                  borderRadius={8}
                  padding={6}
                  paddingLeft={10}
                  paddingRight={10}
                >
                  <Text fontSize={12} fontWeight="bold" color="#000000">
                    {`Comparing [${currentPos.i}][${currentPos.j}][${currentPos.k}]`}
                  </Text>
                </Container>
                <Container
                  backgroundColor="#dfe6e9"
                  borderRadius={8}
                  padding={6}
                  paddingLeft={10}
                  paddingRight={10}
                >
                  <Text fontSize={12} fontWeight="bold" color="#000000">
                    {`vs [${nextPos.i}][${nextPos.j}][${nextPos.k}]`}
                  </Text>
                </Container>
              </Container>
            )}

            {/* ── 3D Array Visualization ── */}
            <Container flexDirection="row" gap={20} justifyContent="center">
              {renderArray()}
            </Container>

            {/* ── Comparison Question ── */}
            {sortStarted && !sortDone && phase === "ask" && (
              <Card
                borderRadius={12}
                padding={14}
                width="100%"
                backgroundColor="#f8f9fa"
                flexDirection="column"
                gap={10}
                alignItems="center"
              >
                <Text fontSize={15} fontWeight="bold" textAlign="center">
                  {`Is ${currentVal} > ${nextVal} ? (Check the condition)`}
                </Text>
                <Container flexDirection="row" gap={12} justifyContent="center">
                  <Button variant="solid" size="sm" onClick={handleYes}>
                    <Text>Yes, True</Text>
                  </Button>
                  <Button variant="rect" size="sm" onClick={handleNo}>
                    <Text>No, False</Text>
                  </Button>
                </Container>
              </Card>
            )}

            {/* ── Holding / Place Button ── */}
            {phase === "holding" && (
              <Card
                borderRadius={12}
                padding={14}
                width="100%"
                backgroundColor="#000000ff"
                flexDirection="column"
                gap={10}
                alignItems="center"
              >
                <Text fontSize={14} fontWeight="bold" textAlign="center">
                  {`Holding ${greatest} as greatest. Place it to swap positions?`}
                </Text>
                <Button variant="solid" size="sm" onClick={handlePlace}>
                  <Text>Place / Swap</Text>
                </Button>
              </Card>
            )}

            {/* ── Status Message ── */}
            {statusMsg !== "" && (
              <Text fontSize={12} textAlign="center">
                {statusMsg}
              </Text>
            )}

            {/* ── Stats ── */}
            {sortStarted && (
              <Container flexDirection="row" gap={20} justifyContent="center">
                <Text fontSize={11}>
                  {`Comparisons: ${comparisonCount}`}
                </Text>
                <Text fontSize={11}>
                  {`Swaps: ${swapCount}`}
                </Text>
              </Container>
            )}


          </Card>
        </Container>
      </Root>
    </Defaults>
  );
}