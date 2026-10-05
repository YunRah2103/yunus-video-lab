import React, {useMemo} from 'react';
import * as THREE from 'three';
import {
  APPROVED_STATIC_FLAP_BOUNDS,
  type AeroMode,
  type CarTransform,
  createFlowPaths,
  DEFAULT_CAR_TRANSFORM,
  DRAG_ANCHOR,
  type FlapBounds,
  FORCE_ANCHORS,
  tracerT,
  visualStateFor,
} from './flowPaths';

const FLOW_GREEN = '#b9d1b3';
const FLOW_IVORY = '#ddd4c2';
const FLOW_COPPER = '#c39469';

export type AeroFlowProps = {
  frame: number;
  mode: AeroMode;
  /** 0..1 smooth interpolation from fromMode to mode. */
  progress?: number;
  fromMode?: AeroMode;
  carTransform?: CarTransform;
  /** Prefer Agent A's current moving-flap bounds when available. */
  flapBounds?: FlapBounds;
  opacity?: number;
  /** Tight close-ups can suppress the low underbody traces without changing the model. */
  showUnderbody?: boolean;
};

const DownforceMark: React.FC<{
  position: [number, number, number];
  strength: number;
  opacity: number;
}> = ({position, strength, opacity}) => {
  const length = 0.26 + 0.24 * strength;
  return <group position={position}>
    <mesh position={[0, -length * 0.42, 0]}>
      <cylinderGeometry args={[0.012, 0.012, length * 0.68, 8]}/>
      <meshBasicMaterial
        color={FLOW_IVORY}
        transparent
        opacity={opacity * 0.62}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
    <mesh position={[0, -length * 0.82, 0]} rotation={[0, 0, Math.PI]}>
      <coneGeometry args={[0.048, 0.12, 9]}/>
      <meshBasicMaterial
        color={FLOW_IVORY}
        transparent
        opacity={opacity * 0.74}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  </group>;
};

const RearwardDragMark: React.FC<{strength: number; opacity: number}> = ({strength, opacity}) => {
  const length = 0.34 + strength * 0.50;
  return <group position={DRAG_ANCHOR}>
    <mesh position={[0, 0, -length * 0.42]} rotation={[-Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.015, 0.015, length * 0.68, 8]}/>
      <meshBasicMaterial
        color={FLOW_COPPER}
        transparent
        opacity={opacity * 0.66}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
    <mesh position={[0, 0, -length * 0.84]} rotation={[-Math.PI / 2, 0, 0]}>
      <coneGeometry args={[0.052, 0.13, 9]}/>
      <meshBasicMaterial
        color={FLOW_COPPER}
        transparent
        opacity={opacity * 0.80}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  </group>;
};

/**
 * Qualitative airflow layer for YUNEX 002.
 * This is an illustrative visualization, not computed CFD or measured force data.
 */
export const AeroFlow: React.FC<AeroFlowProps> = ({
  frame,
  mode,
  progress = 1,
  fromMode = mode,
  carTransform = DEFAULT_CAR_TRANSFORM,
  flapBounds = APPROVED_STATIC_FLAP_BOUNDS,
  opacity = 1,
  showUnderbody = true,
}) => {
  const state = visualStateFor(mode, progress, fromMode);
  const paths = useMemo(
    () => createFlowPaths({mode, transition: progress, fromMode, flapBounds}),
    [
      mode,
      progress,
      fromMode,
      flapBounds.min[0],
      flapBounds.min[1],
      flapBounds.min[2],
      flapBounds.max[0],
      flapBounds.max[1],
      flapBounds.max[2],
      flapBounds.clearance,
    ],
  );

  const curves = useMemo(
    () => paths.map((path) => new THREE.CatmullRomCurve3(
      path.points.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
      false,
      'centripetal',
      0.42,
    )),
    [paths],
  );

  return <group position={carTransform.position} rotation={carTransform.rotation}>
    {paths.map((path, index) => {
      if (path.kind === 'underbody' && !showUnderbody) return null;
      const curve = curves[index];
      const pathColor = path.kind === 'roof' ? FLOW_GREEN : FLOW_IVORY;
      const pathOpacity = opacity * path.opacity;

      return <React.Fragment key={path.id}>
        <mesh renderOrder={5}>
          <tubeGeometry args={[curve, 48, path.radius, 5, false]}/>
          <meshBasicMaterial
            color={pathColor}
            transparent
            opacity={pathOpacity}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        {[0, 0.43].map((offset, tracerIndex) => {
          const t = tracerT(frame, path.tracerPhase + offset);
          const p = curve.getPointAt(t);
          return <mesh key={`${path.id}-tracer-${tracerIndex}`} position={p} renderOrder={6}>
            <sphereGeometry args={[path.kind === 'underbody' ? 0.024 : 0.032, 8, 8]}/>
            <meshBasicMaterial
              color={pathColor}
              transparent
              opacity={opacity * (tracerIndex === 0 ? 0.82 : 0.48)}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>;
        })}
      </React.Fragment>;
    })}

    {FORCE_ANCHORS.map((anchor, index) => <DownforceMark
      key={`force-${index}`}
      position={anchor}
      strength={state.forceStrength}
      opacity={opacity * state.forceStrength * (index < 2 ? 0.58 : 0.72)}
    />)}

    <RearwardDragMark
      strength={state.dragStrength}
      opacity={opacity * state.dragStrength * (mode === 'airbrake' ? 0.90 : 0.32)}
    />
  </group>;
};
