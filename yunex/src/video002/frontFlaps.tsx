import React from 'react';
import * as THREE from 'three';
import {AeroStateInput, resolveAeroState} from './activeAero';

export type FrontFlapsProps = {
  state: AeroStateInput;
  opacity?: number;
};

/**
 * Simplified runtime explanatory proxies for the front active elements described by Porsche:
 * one main side flap toward the underbody plus a smaller flap by each brake-air duct.
 * They are intentionally NOT baked into or substituted for the approved exterior GLB.
 */
export const FRONT_AERO_PROXY_LAYOUT = {
  main: {
    left: [0.62, 0.17, 1.91] as [number, number, number],
    right: [-0.62, 0.17, 1.91] as [number, number, number],
    size: [0.43, 0.026, 0.24] as [number, number, number],
  },
  duct: {
    left: [0.82, 0.29, 1.86] as [number, number, number],
    right: [-0.82, 0.29, 1.86] as [number, number, number],
    size: [0.20, 0.022, 0.15] as [number, number, number],
  },
} as const;

const CarbonSurface: React.FC<{opacity: number}> = ({opacity}) => (
  <meshStandardMaterial
    color="#202625"
    roughness={0.42}
    metalness={0.18}
    transparent={opacity < 0.999}
    opacity={opacity}
  />
);

const Flap: React.FC<{
  position: [number, number, number];
  size: [number, number, number];
  angleDeg: number;
  opacity: number;
  name: string;
}> = ({position, size, angleDeg, opacity, name}) => {
  // The group origin is the front edge of the proxy, so local-X is the spanwise hinge.
  const chord = size[2];
  return (
    <group
      name={name}
      position={position}
      rotation={[THREE.MathUtils.degToRad(angleDeg), 0, 0]}
      userData={{yunexFrontAeroProxy: true, explanatoryOnly: true}}
    >
      <mesh position={[0, 0, -chord * 0.5]} castShadow receiveShadow>
        <boxGeometry args={size}/>
        <CarbonSurface opacity={opacity}/>
      </mesh>
    </group>
  );
};

export const FrontFlaps: React.FC<FrontFlapsProps> = ({state, opacity = 1}) => {
  const pose = resolveAeroState(state);
  const alpha = Math.max(0, Math.min(1, opacity));
  return (
    <group name="YUNEX_FrontActiveAero_Proxy" userData={{simplifiedEngineeringProxy: true}}>
      <Flap
        name="Front_Main_Flap_L"
        position={FRONT_AERO_PROXY_LAYOUT.main.left}
        size={FRONT_AERO_PROXY_LAYOUT.main.size}
        angleDeg={pose.frontAngle}
        opacity={alpha}
      />
      <Flap
        name="Front_Main_Flap_R"
        position={FRONT_AERO_PROXY_LAYOUT.main.right}
        size={FRONT_AERO_PROXY_LAYOUT.main.size}
        angleDeg={pose.frontAngle}
        opacity={alpha}
      />
      <Flap
        name="Front_Duct_Flap_L"
        position={FRONT_AERO_PROXY_LAYOUT.duct.left}
        size={FRONT_AERO_PROXY_LAYOUT.duct.size}
        angleDeg={pose.frontAngle * 0.72}
        opacity={alpha}
      />
      <Flap
        name="Front_Duct_Flap_R"
        position={FRONT_AERO_PROXY_LAYOUT.duct.right}
        size={FRONT_AERO_PROXY_LAYOUT.duct.size}
        angleDeg={pose.frontAngle * 0.72}
        opacity={alpha}
      />
    </group>
  );
};
