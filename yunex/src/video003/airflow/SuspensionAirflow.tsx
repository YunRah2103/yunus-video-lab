import React, {useEffect, useMemo} from 'react';
import * as THREE from 'three';
import {
  airflowVisibility,
  auditSuspensionFlowPaths,
  createSuspensionFlowPaths,
  expandedBounds,
  pointInsideBounds,
  suspensionTracerT,
  type FrontSide,
  type SuspensionFlowAnchor,
} from './flowPaths';

const FLOW_GREEN = '#b9d1b3';
const FLOW_IVORY = '#ddd4c2';

export type SuspensionAirflowProps = {
  frame: number;
  fps: number;
  /** A's cumulative vehicle path distance, in metres. */
  travelDistanceMetres: number;
  /**
   * B's installed link profile bounds, expressed in car-local coordinates.
   * Place this component inside the car root transform exactly once.
   */
  anchors: SuspensionFlowAnchor[];
  /** 0..1; Manager uses this to fade airflow out for the mechanical-control beat. */
  visibility?: number;
  focusSide?: FrontSide | 'both';
  opacity?: number;
  showTracers?: boolean;
};

const tupleKey = (anchors: SuspensionFlowAnchor[]) => anchors.map((a) => [
  a.id,
  a.side,
  ...a.profileBoundsCar.min,
  ...a.profileBoundsCar.max,
  ...a.wheelCenterCar,
  a.clearance ?? 0.055,
].join(':')).join('|');

/**
 * Qualitative front-suspension airflow for YUNEX 003.
 *
 * This is deliberately NOT CFD and contains no pressure/velocity scale or force
 * arrows. It only communicates that the installed teardrop-profile links are
 * shaped to manage powerful front wheel-house airflow.
 */
export const SuspensionAirflow: React.FC<SuspensionAirflowProps> = ({
  frame,
  fps,
  travelDistanceMetres,
  anchors,
  visibility = 1,
  focusSide = 'both',
  opacity = 1,
  showTracers = true,
}) => {
  const anchorKey = tupleKey(anchors);
  const visibleAnchors = useMemo(
    () => anchors.filter((a) => focusSide === 'both' || a.side === focusSide),
    [anchorKey, focusSide],
  );

  const pathSpecs = useMemo(
    () => createSuspensionFlowPaths(visibleAnchors),
    [anchorKey, focusSide],
  );

  const curves = useMemo(() => pathSpecs.map((path) => new THREE.CatmullRomCurve3(
    path.points.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    false,
    'centripetal',
    0.35,
  )), [pathSpecs]);

  const renderedCurveAudit = useMemo(() => {
    const issues: string[] = [];
    pathSpecs.forEach((path, index) => {
      const anchor = visibleAnchors.find((candidate) => candidate.id === path.anchorId);
      if (!anchor) {
        issues.push(`${path.id}: missing rendered-curve anchor`);
        return;
      }
      const safe = expandedBounds(anchor.profileBoundsCar, anchor.clearance ?? 0.055);
      for (let sample = 0; sample <= 64; sample++) {
        const point = curves[index].getPoint(sample / 64);
        const tuple: [number, number, number] = [point.x, point.y, point.z];
        if (pointInsideBounds(tuple, safe)) {
          issues.push(`${path.id}: rendered spline enters protected profile volume at sample ${sample}`);
          break;
        }
      }
    });
    return {ok: issues.length === 0, issues};
  }, [anchorKey, curves, focusSide, pathSpecs, visibleAnchors]);

  const geometries = useMemo(() => curves.map((curve, index) => new THREE.TubeGeometry(
    curve,
    32,
    pathSpecs[index].radius,
    5,
    false,
  )), [curves, pathSpecs]);

  useEffect(() => () => {
    geometries.forEach((geometry) => geometry.dispose());
  }, [geometries]);

  const audit = useMemo(
    () => auditSuspensionFlowPaths(visibleAnchors, pathSpecs),
    [anchorKey, focusSide, pathSpecs],
  );

  if (!audit.ok || !renderedCurveAudit.ok) {
    const issues = [...audit.issues, ...renderedCurveAudit.issues];
    throw new Error(`Y003 suspension airflow audit failed: ${issues.join('; ')}`);
  }

  const fade = airflowVisibility(visibility);
  const baseOpacity = Math.max(0, Math.min(1, opacity)) * fade;
  if (baseOpacity <= 0.001) return null;

  const safeFps = Math.max(1, fps);
  const pulseTime = frame / safeFps;

  return <group name="Y003_SuspensionAirflow_CarLocal">
    {pathSpecs.map((path, index) => {
      const curve = curves[index];
      const color = path.kind === 'upper' ? FLOW_GREEN : FLOW_IVORY;
      const tracerT = suspensionTracerT(travelDistanceMetres, path.tracerPhase);
      const tracerPoint = curve.getPointAt(tracerT);
      const pulse = 0.88 + 0.12 * Math.sin(pulseTime * Math.PI * 2.0 + path.tracerPhase * Math.PI * 2);

      return <React.Fragment key={path.id}>
        <mesh renderOrder={4}>
          <primitive object={geometries[index]} attach="geometry"/>
          <meshBasicMaterial
            color={color}
            transparent
            opacity={baseOpacity * path.opacity}
            depthWrite={false}
            depthTest
            toneMapped={false}
          />
        </mesh>

        {showTracers && <mesh position={tracerPoint} renderOrder={5}>
          <sphereGeometry args={[path.kind === 'upper' ? 0.018 : 0.015, 7, 7]}/>
          <meshBasicMaterial
            color={color}
            transparent
            opacity={baseOpacity * 0.58 * pulse}
            depthWrite={false}
            depthTest
            toneMapped={false}
          />
        </mesh>}
      </React.Fragment>;
    })}
  </group>;
};
