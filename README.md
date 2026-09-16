# Wawataiko XR Game

An interactive WebXR networking game built with React, Three.js, React Three Fiber, and `@react-three/xr`. The experience teaches OSI network layers and packet routing by letting the player build a packet, choose TCP or UDP, and move it through a network of laptops and routers.

## Features

- Create the Application, Transport, Network, Data Link, and Physical layers.
- Choose TCP or UDP at the Transport Layer.
- Move a packet step by step from the left laptop through the routers to the right laptop.
- See routing status and packet-delivery feedback in the 3D interface.
- Experience protocol-specific retransmission behavior.
- Enter VR/AR mode and toggle passthrough when supported.
- Play drum sounds with keyboard controls during the experience.

## Getting Started

### Requirements

- Node.js and npm
- A modern browser with WebGL support
- An XR-compatible device and browser for VR/AR mode

### Install and Run

```bash
npm install
npm run dev
```

Open the local URL shown by Vite in your browser. To create a production build:

```bash
npm run build
npm run preview
```

## How to Play

1. Press **Start Simulation**.
2. Complete each OSI layer by selecting its required attributes.
3. At the Transport Layer, select either **TCP** or **UDP**.
4. Press **Finish All Layers** to start packet routing.
5. Use the packet button to move the packet through the left router, central router, right router, and right laptop.

### TCP Rounds

- **Round 0:** The packet stops at the central router and displays an error.
- Press **Retransmit** to restart from the left laptop.
- **Round 1:** The packet can be moved through the complete network successfully.

### UDP Rounds

- **Round 0:** The packet stops at the central router and displays an error.
- Press **Retransmit** to return to the layer-building interface.
- Recreate the layers and press **Finish All Layers**.
- **Round 2:** The packet can be moved through the complete network successfully.

## Controls

- **D**: Play the middle drum sound
- **T**: Play the side drum sound
- **S**: Play the crash drum sound
- **VR/AR**: Enter an XR session
- **Passthrough**: Toggle passthrough while in an XR session
- **Exit VR**: End the XR session

## Technology

- React 18
- Vite
- Three.js and React Three Fiber
- `@react-three/drei`
- `@react-three/xr`
- React Three UI Kit
- Zustand and Tone.js MIDI/audio support

## Project Structure

- `src/App.jsx`: Application state, UI switching, and round transitions
- `src/components/UI.jsx`: Layer creation interface
- `src/components/secondUI.jsx`: Routing status and retransmission interface
- `src/components/Experience.jsx`: 3D scene and packet movement
- `src/components/DragableUI.jsx`: Packet movement control
- `src/hooks/`: Audio and particle-related state/hooks
- `public/`: Models, textures, fonts, MIDI files, and sound effects

## Tutorial

[Video Tutorial](https://www.youtube.com/watch?v=jBh4ftHqC5U)

![Video Thumbnail](https://github.com/user-attachments/assets/92dcb76b-24e9-4e55-a271-38c4bd9401e5)


# Attributions

[Drum](https://poly.pizza/m/5Wp2emwd7xw) by jeremy [CC-BY](https://creativecommons.org/licenses/by/3.0/) via [Poly Pizza](https://poly.pizza/m/5Wp2emwd7xw)

[Drum stick](https://poly.pizza/m/8llOkQCNie_) by Poly by Google [CC-BY](https://creativecommons.org/licenses/by/3.0/) via [Poly Pizza](https://poly.pizza/m/8llOkQCNie_)

[Japanese Torii](https://poly.pizza/m/cXyQGUwmlA5) by Jacques Fourie [CC-BY](https://creativecommons.org/licenses/by/3.0/) via [Poly Pizza](https://poly.pizza/m/cXyQGUwmlA5)

[Tree](https://poly.pizza/m/bk19zLgwVAW) by konta johanna [CC-BY](https://creativecommons.org/licenses/by/3.0/) via [Poly Pizza](https://poly.pizza/m/bk19zLgwVAW)
