import React, {useMemo} from 'react';
import * as THREE from 'three';
import {createTeardropLinkGeometry} from './profileGeometry';
import {resolveDamper, resolveLinks} from './topology';
import type {FrontSuspensionState, ResolvedSuspensionLink, Side, Vec3} from './types';

const LINK_GRAPHITE = '#30363a';
const LINK_EDGE = '#6f7b7c';
const DAMPER_METAL = '#6f7477';
const SPRING_DARK = '#25292b';
const UPRIGHT_DARK = '#3b4144';

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

const TeardropLink: React.FC<{link: ResolvedSuspensionLink; opacity: number}> = ({link, opacity}) => {
  const geometry = useMemo(
    () => createTeardropLinkGeometry({
      chordMetres: link.chordMetres,
      thicknessMetres: link.thicknessMetres,
      profileSegments: 18,
    }),
    [link.chordMetres, link.thicknessMetres],
  );
  const position = midpoint(link.start, link.end);
  const quaternion = useMemo(() => orientationFor(link.start, link.end), [
    link.start[0], link.start[1], link.start[2], link.end[0], link.end[1], link.end[2],
  ]);
  return <group position={position} quaternion={quaternion} scale={[link.lengthMetres, 1, 1]}>
    <mesh geometry={geometry} castShadow>
      <meshStandardMaterial
        color={LINK_GRAPHITE}
        roughness={0.32}
        metalness={0.62}
        transparent={opacity < 0.999}
        opacity={opacity}
      />
    </mesh>
    <mesh geometry={geometry} scale={[1.006, 1.05, 1.025]} renderOrder={3}>
      <meshBasicMaterial
        color={LINK_EDGE}
        wireframe
        transparent
        opacity={opacity * 0.11}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  </group>;
};

const RodBetween: React.FC<{
  a: Vec3;
  b: Vec3;
  radius: number;
  color: string;
  opacity: number;
}> = ({a, b, radius, color, opacity}) => {
  const va = new THREE.Vector3(...a);
  const vb = new THREE.Vector3(...b);
  const delta = vb.clone().sub(va);
  const length = delta.length();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
  return <mesh position={midpoint(a, b)} quaternion={q} castShadow>
    <cylinderGeometry args={[radius, radius, length, 12]}/>
    <meshStandardMaterial color={color} metalness={0.55} roughness={0.34} transparent={opacity < 0.999} opacity={opacity}/>
  </mesh>;
};

const SpringDamper: React.FC<{side: Side; state: FrontSuspensionState; opacity: number}> = ({side, state, opacity}) => {
  const {upper, lower} = resolveDamper(side, state);
  const axis = new THREE.Vector3(...upper).sub(new THREE.Vector3(...lower));
  const length = axis.length();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), axis.clone().normalize());
  const springGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const turns = 7.5;
    const samples = 88;
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const angle = t * turns * Math.PI * 2;
      points.push(new THREE.Vector3(t - 0.5, Math.cos(angle) * 0.050, Math.sin(angle) * 0.050));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 96, 0.009, 7, false);
  }, []);
  const pos = midpoint(lower, upper);
  return <group position={pos} quaternion={q}>
    <mesh scale={[length * 0.73, 1, 1]} geometry={springGeometry} castShadow>
      <meshStandardMaterial color={SPRING_DARK} metalness={0.58} roughness={0.36} transparent={opacity < 0.999} opacity={opacity}/>
    </mesh>
    <mesh rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.026, 0.026, length * 0.80, 12]}/>
      <meshStandardMaterial color={DAMPER_METAL} metalness={0.76} roughness={0.24} transparent={opacity < 0.999} opacity={opacity}/>
    </mesh>
  </group>;
};

const UprightContext: React.FC<{side: Side; state: FrontSuspensionState; opacity: number}> = ({side, state, opacity}) => {
  const links = resolveLinks(state).filter((l) => l.side === side);
  const upper = links.find((l) => l.kind === 'upper-front')?.end;
  const lower = links.find((l) => l.kind === 'lower-front')?.end;
  if (!upper || !lower) return null;
  return <RodBetween a={lower} b={upper} radius={0.028} color={UPRIGHT_DARK} opacity={opacity * 0.90}/>;
};

export type FrontSuspensionProps = {
  state: FrontSuspensionState;
  opacity?: number;
  side?: Side | 'both';
  showSpringDamper?: boolean;
  showUprightContext?: boolean;
};

/**
 * Simplified installed front suspension illustration for YUNEX 003.
 * Consumes chassis + upright poses only; wheel spin is intentionally not in this API.
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
