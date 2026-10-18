// The series' signature object.
//
// Owner 2026-10-14, in order: not the JW mark ("เป็นอะไรก็ได้"), and not a stack of paper —
// "ไม่เอารูปเอกสารเพราะมันดูไม่ทันสมัย เราใช้โปรแกรม". Paper argues against the product: the whole
// point is that nobody types these documents by hand any more.
//
// So the object is what JWIC actually is — a LAYER ADDED ON TOP. Three floating panels in depth:
// the ones behind are the standard system, plain and receding; the front one is ours and is the
// only one carrying brand colour, with the mark's pink on its leading edge. It reads as software
// (Fluent-style cards in space), it means the proposition rather than illustrating a document, and
// it re-poses per episode: pull the layers apart for an architecture episode, close them up for a
// feature one.
//
// three.js via @remotion/three (installed at the owner's request 2026-10-14).

import React from 'react';
import { ThreeCanvas } from '@remotion/three';
import * as THREE from 'three';

// The layers behind have to stay readable as PANELS, not fall away into shadow — too dark and the
// object reads as one card with a smudge behind it.
const BACK_PANEL = '#35776A';
const MID_PANEL = '#3E8E7B';
const TOP_PANEL = '#49B392'; // ours — the only lit, saturated plane
const EDGE_PINK = '#C07F8B'; // the mark's pink, on the top layer's leading edge only

const W = 1.35; // half-width
const H = 0.92; // half-height
const R = 0.14;
const TH = 0.055;

const panelShape = () => {
  const s = new THREE.Shape();
  s.moveTo(-W + R, -H);
  s.lineTo(W - R, -H);
  s.quadraticCurveTo(W, -H, W, -H + R);
  s.lineTo(W, H - R);
  s.quadraticCurveTo(W, H, W - R, H);
  s.lineTo(-W + R, H);
  s.quadraticCurveTo(-W, H, -W, H - R);
  s.lineTo(-W, -H + R);
  s.quadraticCurveTo(-W, -H, -W + R, -H);
  return s;
};

const panelGeo = () =>
  new THREE.ExtrudeGeometry(panelShape(), {
    depth: TH,
    bevelEnabled: true,
    bevelThickness: 0.016,
    bevelSize: 0.016,
    bevelSegments: 3,
    curveSegments: 22,
  });

/** the thin pink strip that runs along the front panel's lower edge */
const edgeGeo = () => new THREE.BoxGeometry(W * 1.52, 0.055, TH * 1.25);

type Layer = { z: number; dx: number; dy: number; rot: number; color: string; opacity: number };

const LAYERS: Layer[] = [
  { z: -0.78, dx: -0.3, dy: 0.26, rot: 0.05, color: BACK_PANEL, opacity: 0.72 },
  { z: -0.39, dx: -0.15, dy: 0.13, rot: 0.025, color: MID_PANEL, opacity: 0.88 },
  { z: 0, dx: 0, dy: 0, rot: 0, color: TOP_PANEL, opacity: 1 },
];

const Layers: React.FC<{ spread: number; spin: number }> = ({ spread, spin }) => {
  const geo = React.useMemo(panelGeo, []);
  const edge = React.useMemo(edgeGeo, []);

  return (
    <group rotation={[-0.34, spin, 0.07]}>
      {LAYERS.map((l, i) => {
        const k = LAYERS.length - 1 - i; // 2 for the backmost
        return (
          <mesh
            key={i}
            geometry={geo}
            // The layers have to peek out from behind the front one or the whole idea is invisible:
            // head-on they hide exactly behind it, so the offset has to be a good fraction of the
            // panel, not a nudge.
            position={[
              l.dx - k * 0.52 * spread,
              l.dy + k * 0.34 * spread,
              l.z - k * 0.5 * spread,
            ]}
            rotation={[0, 0, l.rot]}
            castShadow
            receiveShadow
          >
            {/* clearcoat gives the panels a glass sheen, which is what stops them reading as flat
                cards; the back ones stay rougher so the front one is clearly the lit, live layer */}
            <meshPhysicalMaterial
              color={l.color}
              roughness={i === LAYERS.length - 1 ? 0.18 : 0.46}
              metalness={0.1}
              clearcoat={i === LAYERS.length - 1 ? 0.9 : 0.35}
              clearcoatRoughness={0.18}
              reflectivity={0.4}
              transparent={l.opacity < 1}
              opacity={l.opacity}
            />
          </mesh>
        );
      })}

      {/* The brand edge — only on the layer that is ours. It glows a little so it survives being a
          thin strip: at this size a plain diffuse strip disappears against the panel behind it. */}
      <mesh geometry={edge} position={[0, -H - 0.012, TH / 2]}>
        <meshStandardMaterial
          color={EDGE_PINK}
          roughness={0.35}
          metalness={0.05}
          emissive={EDGE_PINK}
          emissiveIntensity={0.35}
        />
      </mesh>
    </group>
  );
};

export const SeriesObject: React.FC<{
  width: number;
  height: number;
  /** 0 = layers closed up, 1 = pulled apart in depth */
  spread?: number;
  /** radians, slow drift */
  spin: number;
  zoom?: number;
}> = ({ width, height, spread = 0.35, spin, zoom = 7.4 }) => (
  <ThreeCanvas
    width={width}
    height={height}
    camera={{ fov: 32, position: [0, 0, zoom] }}
    gl={{ antialias: true, preserveDrawingBuffer: true }}
    style={{ background: 'transparent' }}
  >
    <ambientLight intensity={0.42} color="#BFE0D6" />
    <directionalLight position={[-3.4, 4.4, 4.6]} intensity={1.5} color="#FFFFFF" />
    <directionalLight position={[3.8, -1.6, 1.6]} intensity={0.4} color="#7FD9BA" />
    {/* rim from behind: separates the three layers from each other and from the ground */}
    <directionalLight position={[1.4, 2.2, -4.5]} intensity={1.0} color="#8FE0C0" />
    <Layers spread={spread} spin={spin} />
  </ThreeCanvas>
);
