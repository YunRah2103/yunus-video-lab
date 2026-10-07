import React, {useMemo} from 'react';
import * as THREE from 'three';
import {createTeardropLinkGeometry} from './profileGeometry';
import {resolveDamper, resolveLinks} from './topology';
import type {FrontSuspensionState, ResolvedSuspensionLink, Side, Vec3} from './types';

const LINK_GRAPHITE = '#30363a';
const LINK_EDGE = '#9aa6a7';
const JOINT_DARK = '#22272a';
const JOINT_METAL = '#8a9397';
const CLEVIS_DARK = '#343a3d';
const DAMPER_BODY = '#555d61';
const DAMPER_SHAFT = '#b7c0c4';
const SPRING_DARK = '#202426';
const SPRING_SEAT = '#747d81';
const BUMP_STOP = '#433b35';
const UPRIGHT_DARK = '#353b3e';
const HUB_METAL = '#70787c';
const CHASSIS_BRACE = '#41484c';

const UNIT_CYLINDER_Y = new THREE.CylinderGeometry(1, 1, 1, 18);
const UNIT_SPHERE = new THREE.SphereGeometry(1, 18, 12);
const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1);
const UNIT_TORUS = new THREE.TorusGeometry(1, 0.14, 8, 28);

const midpoint = (a: Vec3, b: Vec3): Vec3 => [
  (a[0] + b[0]) / 2,
  (a[1] + b[1]) / 2,
  (a[2] + b[2]) / 2,
];

const orientationFor = (a: Vec3, b: Vec3) => {
  const start = new THREE.Vector3(...a);
  const end = new THREE.Vector3(...b);
  const xAxis = end.clone().sub(start).normalize();
  const desiredChord = new THREE.Vector3(0, 0, 1);
  const zAxis = desiredChord.clone().addScaledVector(xAxis, -desiredChord.dot(xAxis));
  if (zAxis.lengthSq() < 1e-7) zAxis.set(0, 1, 0).addScaledVector(xAxis, -xAxis.y);
  zAxis.normalize();
  const yAxis = zAxis.clone().cross(xAxis).normalize();
  const basis = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);
  return new THREE.Quaternion().setFromRotationMatrix(basis);
};

const JointHousing: React.FC<{position: Vec3; radius?: number; opacity: number}> = ({
  position,
  radius = 0.025,
  opacity,
}) => <group position={position}>
  <mesh geometry={UNIT_SPHERE} scale={[radius, radius, radius]} castShadow>
    <meshStandardMaterial color={JOINT_DARK} metalness={0.55} roughness={0.30} transparent={opacity < 0.999} opacity={opacity}/>
  </mesh>
  <mesh geometry={UNIT_SPHERE} scale={[radius * 0.56, radius * 0.56, radius * 0.56]} castShadow>
    <meshStandardMaterial color={JOINT_METAL} metalness={0.82} roughness={0.20} transparent={opacity < 0.999} opacity={opacity}/>
  </mesh>
</group>;

const ClevisMount: React.FC<{a: Vec3; b: Vec3; opacity: number}> = ({a, b, opacity}) => {
  const quaternion = useMemo(() => orientationFor(a, b), [a[0], a[1], a[2], b[0], b[1], b[2]]);
  return <group position={a} quaternion={quaternion}>
    {[-1, 1].map((sign) => <mesh
      key={sign}
      geometry={UNIT_BOX}
      position={[0.020, 0, sign * 0.027]}
      scale={[0.052, 0.048, 0.010]}
      castShadow
    >
      <meshStandardMaterial color={CLEVIS_DARK} metalness={0.60} roughness={0.31} transparent={opacity < 0.999} opacity={opacity}/>
    </mesh>)}
    <mesh geometry={UNIT_CYLINDER_Y} rotation={[Math.PI / 2, 0, 0]} scale={[0.011, 0.062, 0.011]} castShadow>
      <meshStandardMaterial color={JOINT_METAL} metalness={0.85} roughness={0.18} transparent={opacity < 0.999} opacity={opacity}/>
    </mesh>
  </group>;
};

const RodBetween: React.FC<{
  a: Vec3;
  b: Vec3;
  radius: number;
  color: string;
  opacity: number;
  metalness?: number;
  roughness?: number;
}> = ({a, b, radius, color, opacity, metalness = 0.55, roughness = 0.34}) => {
  const va = new THREE.Vector3(...a);
  const vb = new THREE.Vector3(...b);
  const delta = vb.clone().sub(va);
  const length = delta.length();
  if (length < 1e-6) return null;
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
  return <mesh
    geometry={UNIT_CYLINDER_Y}
    position={midpoint(a, b)}
    quaternion={q}
    scale={[radius, length, radius]}
    castShadow
  >
    <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} transparent={opacity < 0.999} opacity={opacity}/>
  </mesh>;
};

const TeardropLink: React.FC<{link: ResolvedSuspensionLink; opacity: number}> = ({link, opacity}) => {
  if (link.kind === 'tie-rod') {
    return <group>
      <RodBetween a={link.start} b={link.end} radius={0.0115} color={JOINT_METAL} opacity={opacity} metalness={0.82} roughness={0.20}/>
      <JointHousing position={link.start} radius={0.021} opacity={opacity}/>
      <JointHousing position={link.end} radius={0.021} opacity={opacity}/>
    </group>;
  }

  const geometry = useMemo(
    () => createTeardropLinkGeometry({
      chordMetres: link.chordMetres,
      thicknessMetres: link.thicknessMetres,
      profileSegments: 22,
    }),
    [link.chordMetres, link.thicknessMetres],
  );
  const position = midpoint(link.start, link.end);
  const quaternion = useMemo(() => orientationFor(link.start, link.end), [
    link.start[0], link.start[1], link.start[2], link.end[0], link.end[1], link.end[2],
  ]);

  return <group>
    <group position={position} quaternion={quaternion} scale={[link.lengthMetres, 1, 1]}>
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial
          color={LINK_GRAPHITE}
          roughness={0.28}
          metalness={0.66}
          transparent={opacity < 0.999}
          opacity={opacity}
        />
      </mesh>
      <mesh geometry={geometry} scale={[1.006, 1.045, 1.022]} renderOrder={3}>
        <meshBasicMaterial
          color={LINK_EDGE}
          wireframe
          transparent
          opacity={opacity * 0.14}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
    <ClevisMount a={link.start} b={link.end} opacity={opacity}/>
    <JointHousing position={link.start} radius={0.026} opacity={opacity}/>
    <JointHousing position={link.end} radius={0.025} opacity={opacity}/>
  </group>;
};

const UpperDamperChassisMount: React.FC<{
  side: Side;
  state: FrontSuspensionState;
  upper: Vec3;
  lower: Vec3;
  opacity: number;
}> = ({side, state, upper, lower, opacity}) => {
  const sideLinks = resolveLinks(state).filter((link) => link.side === side);
  const upperFrontInboard = sideLinks.find((link) => link.kind === 'upper-front')?.start;
  const upperRearInboard = sideLinks.find((link) => link.kind === 'upper-rear')?.start;
  if (!upperFrontInboard || !upperRearInboard) return null;

  return <group name={'Y003_' + side + '_UpperDamperChassisMount'}>
    <RodBetween a={upperFrontInboard} b={upperRearInboard} radius={0.022} color={CHASSIS_BRACE} opacity={opacity} metalness={0.70} roughness={0.28}/>
    <RodBetween a={upper} b={upperFrontInboard} radius={0.024} color={CHASSIS_BRACE} opacity={opacity} metalness={0.68} roughness={0.30}/>
    <RodBetween a={upper} b={upperRearInboard} radius={0.024} color={CHASSIS_BRACE} opacity={opacity} metalness={0.68} roughness={0.30}/>
    <ClevisMount a={upper} b={lower} opacity={opacity}/>
    <JointHousing position={upper} radius={0.034} opacity={opacity}/>
  </group>;
};

const SpringSeatRing: React.FC<{x: number; opacity: number}> = ({x, opacity}) => <mesh
  geometry={UNIT_TORUS}
  position={[x, 0, 0]}
  rotation={[0, Math.PI / 2, 0]}
  scale={[0.058, 0.058, 0.058]}
  castShadow
>
  <meshStandardMaterial color={SPRING_SEAT} metalness={0.72} roughness={0.24} transparent={opacity < 0.999} opacity={opacity}/>
</mesh>;

const SpringDamper: React.FC<{side: Side; state: FrontSuspensionState; opacity: number}> = ({side, state, opacity}) => {
  const {upper, lower} = resolveDamper(side, state);
  const axis = new THREE.Vector3(...upper).sub(new THREE.Vector3(...lower));
  const length = axis.length();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), axis.clone().normalize());
  const springGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const turns = 8.25;
    const samples = 112;
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const angle = t * turns * Math.PI * 2;
      points.push(new THREE.Vector3(t - 0.5, Math.cos(angle) * 0.051, Math.sin(angle) * 0.051));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 120, 0.0085, 8, false);
  }, []);
  const pos = midpoint(lower, upper);
  const bodyLength = length * 0.43;
  const shaftLength = length * 0.38;

  return <>
    <group position={pos} quaternion={q}>
    <mesh
      geometry={UNIT_CYLINDER_Y}
      position={[-length * 0.10, 0, 0]}
      rotation={[0, 0, Math.PI / 2]}
      scale={[0.036, bodyLength, 0.036]}
      castShadow
    >
      <meshStandardMaterial color={DAMPER_BODY} metalness={0.72} roughness={0.25} transparent={opacity < 0.999} opacity={opacity}/>
    </mesh>
    <mesh
      geometry={UNIT_CYLINDER_Y}
      position={[length * 0.245, 0, 0]}
      rotation={[0, 0, Math.PI / 2]}
      scale={[0.017, shaftLength, 0.017]}
      castShadow
    >
      <meshStandardMaterial color={DAMPER_SHAFT} metalness={0.94} roughness={0.12} transparent={opacity < 0.999} opacity={opacity}/>
    </mesh>
    <mesh scale={[length * 0.66, 1, 1]} geometry={springGeometry} castShadow>
      <meshStandardMaterial color={SPRING_DARK} metalness={0.62} roughness={0.32} transparent={opacity < 0.999} opacity={opacity}/>
    </mesh>
    <SpringSeatRing x={-length * 0.29} opacity={opacity}/>
    <SpringSeatRing x={length * 0.29} opacity={opacity}/>
    {[-1, 0, 1].map((step) => <mesh
      key={step}
      geometry={UNIT_CYLINDER_Y}
      position={[length * 0.145 + step * 0.018, 0, 0]}
      rotation={[0, 0, Math.PI / 2]}
      scale={[0.031 - Math.abs(step) * 0.003, 0.013, 0.031 - Math.abs(step) * 0.003]}
      castShadow
    >
      <meshStandardMaterial color={BUMP_STOP} metalness={0.12} roughness={0.72} transparent={opacity < 0.999} opacity={opacity}/>
    </mesh>)}
    <JointHousing position={[-length / 2, 0, 0]} radius={0.028} opacity={opacity}/>
    <JointHousing position={[length / 2, 0, 0]} radius={0.028} opacity={opacity}/>
    </group>
    <UpperDamperChassisMount
      side={side}
      state={state}
      upper={upper}
      lower={lower}
      opacity={opacity}
    />
  </>;
};

const HubCarrier: React.FC<{hub: Vec3; opacity: number}> = ({hub, opacity}) => <group position={hub}>
  <mesh geometry={UNIT_CYLINDER_Y} rotation={[0, 0, Math.PI / 2]} scale={[0.073, 0.090, 0.073]} castShadow>
    <meshStandardMaterial color={HUB_METAL} metalness={0.78} roughness={0.23} transparent={opacity < 0.999} opacity={opacity}/>
  </mesh>
  <mesh geometry={UNIT_TORUS} rotation={[0, Math.PI / 2, 0]} scale={[0.076, 0.076, 0.076]} castShadow>
    <meshStandardMaterial color={JOINT_METAL} metalness={0.88} roughness={0.17} transparent={opacity < 0.999} opacity={opacity}/>
  </mesh>
</group>;

const UprightContext: React.FC<{side: Side; state: FrontSuspensionState; opacity: number}> = ({side, state, opacity}) => {
  const links = resolveLinks(state).filter((l) => l.side === side);
  const upper = links.find((l) => l.kind === 'upper-front')?.end;
  const lowerFront = links.find((l) => l.kind === 'lower-front')?.end;
  const lowerRear = links.find((l) => l.kind === 'lower-rear')?.end;
  const tie = links.find((l) => l.kind === 'tie-rod')?.end;
  if (!upper || !lowerFront || !lowerRear || !tie) return null;
  const hub = state[side].wheelCenter;

  return <group>
    <RodBetween a={upper} b={hub} radius={0.024} color={UPRIGHT_DARK} opacity={opacity * 0.96}/>
    <RodBetween a={lowerFront} b={hub} radius={0.026} color={UPRIGHT_DARK} opacity={opacity * 0.96}/>
    <RodBetween a={lowerRear} b={hub} radius={0.026} color={UPRIGHT_DARK} opacity={opacity * 0.96}/>
    <RodBetween a={lowerFront} b={lowerRear} radius={0.018} color={UPRIGHT_DARK} opacity={opacity * 0.92}/>
    <RodBetween a={tie} b={hub} radius={0.016} color={JOINT_METAL} opacity={opacity * 0.90}/>
    <HubCarrier hub={hub} opacity={opacity}/>
    <JointHousing position={upper} radius={0.030} opacity={opacity}/>
    <JointHousing position={lowerFront} radius={0.030} opacity={opacity}/>
    <JointHousing position={lowerRear} radius={0.030} opacity={opacity}/>
    <JointHousing position={tie} radius={0.023} opacity={opacity}/>
  </group>;
};

export type FrontSuspensionProps = {
  state: FrontSuspensionState;
  opacity?: number;
  side?: Side | 'both';
  showSpringDamper?: boolean;
  showUprightContext?: boolean;
};

/**
 * Reference-informed installed front double-wishbone illustration for YUNEX 003.
 * Consumes chassis + upright poses only; wheel spin is intentionally not in this API.
 * Added joint, clevis, damper and carrier dimensions are illustrative rather than Porsche CAD.
 */
export const FrontSuspension: React.FC<FrontSuspensionProps> = ({
  state,
  opacity = 1,
  side = 'both',
  showSpringDamper = true,
  showUprightContext = true,
}) => {
  const activeSides: Side[] = side === 'both' ? ['FL', 'FR'] : [side];
  const links = resolveLinks(state).filter((link) => activeSides.includes(link.side));
  return <group name="Y003_FrontSuspension_Illustration">
    {links.map((link) => <TeardropLink key={link.id} link={link} opacity={opacity}/>)}
    {showSpringDamper && activeSides.map((s) => <SpringDamper key={'damper-' + s} side={s} state={state} opacity={opacity}/>)}
    {showUprightContext && activeSides.map((s) => <UprightContext key={'upright-' + s} side={s} state={state} opacity={opacity}/>)}
  </group>;
};
