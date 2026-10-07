import {TRACK_LAYOUT_CONFIG} from '../../video002/trackUpgrade/racetrack/layout';

export const Y003_ROUTE_TRACK_RANGE = {
  minZ: -60,
  maxZ: 136,
} as const;

export const Y003_LEGACY_IDENTITY_RANGE = {
  minZ: -25,
  maxZ: 35.5,
} as const;

export const Y003_CIRCUIT_EXTENSION_RANGES = [
  {id: 'approach', minZ: -64, maxZ: -24},
  {id: 'exit', minZ: 35, maxZ: 140},
] as const;

export const Y003_CIRCUIT_IDENTITY_STATIONS = [
  -60, -50, -39, -26,
  -14, 0, 16, 31,
  45, 58, 73, 89, 106, 123, 136,
] as const;

export const auditY003CircuitCoverage = () => {
  const issues: string[] = [];
  const route = Y003_ROUTE_TRACK_RANGE;
  const approach = Y003_CIRCUIT_EXTENSION_RANGES[0];
  const exit = Y003_CIRCUIT_EXTENSION_RANGES[1];

  if (approach.minZ > route.minZ - 2) {
    issues.push('approach extension does not lead the Y003 route by at least 2m');
  }
  if (approach.maxZ < Y003_LEGACY_IDENTITY_RANGE.minZ) {
    issues.push('approach extension leaves a gap before legacy furniture coverage');
  }
  if (exit.minZ > Y003_LEGACY_IDENTITY_RANGE.maxZ) {
    issues.push('exit extension leaves a gap after legacy furniture coverage');
  }
  if (exit.maxZ < route.maxZ + 2) {
    issues.push('exit extension does not trail the Y003 route by at least 2m');
  }
  if (
    approach.minZ < TRACK_LAYOUT_CONFIG.sampleMinZ ||
    exit.maxZ > TRACK_LAYOUT_CONFIG.sampleMaxZ
  ) {
    issues.push('Y003 extension exceeds the approved track sample domain');
  }

  let maxIdentityGap = 0;
  const stationGaps: number[] = [];
  for (let i = 1; i < Y003_CIRCUIT_IDENTITY_STATIONS.length; i++) {
    const gap =
      Y003_CIRCUIT_IDENTITY_STATIONS[i] -
      Y003_CIRCUIT_IDENTITY_STATIONS[i - 1];
    stationGaps.push(gap);
    maxIdentityGap = Math.max(maxIdentityGap, gap);
  }
  if (maxIdentityGap > 18) {
    issues.push('circuit identity station gap exceeds 18m');
  }

  const uniqueRoundedGaps = new Set(stationGaps.map((gap) => Math.round(gap)));
  if (uniqueRoundedGaps.size < 4) {
    issues.push('circuit identity spacing is too repetitive');
  }

  return {
    ok: issues.length === 0,
    issues,
    metrics: {
      routeMinZ: route.minZ,
      routeMaxZ: route.maxZ,
      extensionMinZ: approach.minZ,
      extensionMaxZ: exit.maxZ,
      legacyMinZ: Y003_LEGACY_IDENTITY_RANGE.minZ,
      legacyMaxZ: Y003_LEGACY_IDENTITY_RANGE.maxZ,
      identityStationCount: Y003_CIRCUIT_IDENTITY_STATIONS.length,
      maxIdentityGap,
      uniqueRoundedGapCount: uniqueRoundedGaps.size,
      sampleDomainMinZ: TRACK_LAYOUT_CONFIG.sampleMinZ,
      sampleDomainMaxZ: TRACK_LAYOUT_CONFIG.sampleMaxZ,
    },
  };
};
