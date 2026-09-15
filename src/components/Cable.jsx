import React from 'react';
import { Line } from '@react-three/drei';

export function Cable({ start, end, color = "#5555ff" }) {
    return (
        <Line
            points={[start, end]}
            color={color}
            lineWidth={3}
        />
    );
}


// import React, { useMemo } from 'react';
// import { Line } from '@react-three/drei';
// import * as THREE from 'three';

// export function Cable({ start, end, color = "#5555ff", sag = 0.5 }) {
//   // Cable ko realistic curve dene ke liye mid-point calculate karna
//   const points = useMemo(() => {
//     const midX = (start[0] + end[0]) / 2;
//     const midY = (start[1] + end[1]) / 2 - sag; // sag matlab kitni jhuki honi chahiye
//     const midZ = (start[2] + end[2]) / 2;

//     const curve = new THREE.CatmullRomCurve3([
//       new THREE.Vector3(...start),
//       new THREE.Vector3(midX, midY, midZ),
//       new THREE.Vector3(...end)
//     ]);

//     return curve.getPoints(20); // Smooth curve ke liye 20 points
//   }, [start, end, sag]);

//   return (
//     <Line
//       points={points}
//       color={color}
//       lineWidth={3}
//     />
//   );
// }