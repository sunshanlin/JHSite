// The series' signature object: the JW mark as a real slab with its corner physically turned in.
//
// Why an object at all: the reference the owner picked (Microsoft's own Business Central channel)
// carries its episodes on one lit 3D form that recurs on the title cards, in the studio set and as a
// corner badge. The logo is not what makes that read as a series — the object is. This is ours:
// the mark JWIC already owns, with the fold the owner asked for turned into geometry instead of a
// flat triangle.
//
// Built with @remotion/three (installed 2026-10-14 at the owner's request) so the camera can really
// move around it; the body and the flap are extruded shapes, not images.

import React from 'react';
import { ThreeCanvas } from '@remotion/three';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import * as THREE from 'three';

// The object has to sit clearly OFF the ground, which is the same green family — so the face runs
// several steps lighter than the stage and the key light does the rest.
const GREEN_FACE = '#35977D';
const GREEN_EDGE = '#1B5A4A';
const PINK_BACK = '#D295A0';

/** half-size of the square, in world units */
const S = 1;
/** how far along each edge the fold line starts, measured from the corner */
const CUT = 0.86;
/** slab thickness */
const T = 0.26;
const R = 0.2; // outer corner radius

/** the slab with its top-right corner removed along the fold line */
const bodyShape = () => {
  const s = new THREE.Shape();
  const c = S - CUT; // the fold line meets the edges at +/- c
  s.moveTo(-S + R, -S);
  s.lineTo(S - R, -S);
  s.quadraticCurveTo(S, -S, S, -S + R); // bottom-right
  s.lineTo(S, c); // up the right edge to the fold
  s.lineTo(c, S); // the fold line itself
  s.lineTo(-S + R, S); // along the top
  s.quadraticCurveTo(-S, S, -S, S - R); // top-left
  s.lineTo(-S, -S + R);
  s.quadraticCurveTo(-S, -S, -S + R, -S); // bottom-left
  return s;
};

/** the corner that was removed, as its own thin sheet */
const flapShape = () => {
  const c = S - CUT;
  const f = new THREE.Shape();
  f.moveTo(c, S);
  f.lineTo(S - R, S);
  f.quadraticCurveTo(S, S, S, S - R); // keeps the slab's own rounded corner on the flap
  f.lineTo(S, c);
  f.lineTo(c, S);
  return f;
};

const Slab: React.FC<{ fold: number; spin: number }> = ({ fold, spin }) => {
  const body = React.useMemo(
    () =>
      new THREE.ExtrudeGeometry(bodyShape(), {
        depth: T,
        bevelEnabled: true,
        bevelThickness: 0.035,
        bevelSize: 0.035,
        bevelSegments: 4,
        curveSegments: 24,
      }),
    [],
  );
  const flap = React.useMemo(() => {
    const g = new THREE.ExtrudeGeometry(flapShape(), {
      depth: 0.045,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.012,
      bevelSegments: 2,
      curveSegments: 24,
    });
    // Put the fold line's start through the origin so the group can hinge on it, and push the sheet
    // BELOW the hinge plane: a 180° turn about an in-plane axis also flips z, so a flap extruded
    // upward ends up buried under the slab and invisible. Extruded downward, it lands on the face.
    const c = S - CUT;
    g.translate(-c, -S, -0.045);
    return g;
  }, []);

  // the fold line runs from (c, S) to (S, c) — direction (1,-1)/root2, through (c, S)
  const c = S - CUT;
  const axis = React.useMemo(() => new THREE.Vector3(1, -1, 0).normalize(), []);

  return (
    <group rotation={[-0.42, spin, 0]}>
      <mesh geometry={body} castShadow receiveShadow>
        <meshStandardMaterial color={GREEN_FACE} roughness={0.52} metalness={0.06} />
      </mesh>
      <group
        position={[c, S, T + 0.004]}
        rotation={new THREE.Euler().setFromQuaternion(
          new THREE.Quaternion().setFromAxisAngle(axis, Math.PI * fold),
        )}
      >
        <mesh geometry={flap} castShadow>
          <meshStandardMaterial
            color={PINK_BACK}
            roughness={0.46}
            metalness={0.04}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
};

export const JwSolid: React.FC<{
  width: number;
  height: number;
  /** 0 = corner flat on the page, 1 = fully turned in */
  fold: number;
  /** radians, slow drift */
  spin: number;
  /** camera distance */
  zoom?: number;
}> = ({ width, height, fold, spin, zoom = 4.6 }) => (
  <ThreeCanvas
    width={width}
    height={height}
    camera={{ fov: 32, position: [0, 0, zoom] }}
    gl={{ antialias: true, preserveDrawingBuffer: true }}
    style={{ background: 'transparent' }}
  >
    <ambientLight intensity={0.62} color="#CFE6DD" />
    <directionalLight position={[-3.2, 4.2, 4]} intensity={1.15} color="#FFFFFF" />
    <directionalLight position={[3.5, -1.5, 2]} intensity={0.35} color="#8FE0C0" />
    <Slab fold={fold} spin={spin} />
  </ThreeCanvas>
);

/** convenience wrapper that drives the fold and the drift from the composition clock */
export const JwSolidAuto: React.FC<{
  width: number;
  height: number;
  foldFrom: number;
  foldDur: number;
  zoom?: number;
}> = ({ width, height, foldFrom, foldDur, zoom }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = Math.max(0, Math.min(1, (f - foldFrom) / foldDur));
  const eased = 1 - Math.pow(1 - t, 3);
  const spin = -0.5 + (f / Math.max(1, durationInFrames)) * 0.5;
  return <JwSolid width={width} height={height} fold={eased} spin={spin} zoom={zoom} />;
};
