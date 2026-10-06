const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {spawnSync} = require('child_process');

const ROOT = path.resolve(__dirname, '../../../../..');
const YUNEX = path.resolve(__dirname, '../../../..');
const sourceModel = path.join(ROOT, 'cars/porsche-911-gt3-rs-992/model.glb');
const publicModel = path.join(YUNEX, 'public/model.glb');
const outDir = path.join(YUNEX, 'out/track-upgrade/a-road');
const expected = '1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb';

const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const run = (cmd, args) => {
  const result = spawnSync(cmd, args, {
    cwd: YUNEX,
    stdio: 'inherit',
    env: {...process.env, NODE_OPTIONS: '--require=./fix-network.cjs'},
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
};

fs.mkdirSync(path.dirname(publicModel), {recursive: true});
fs.mkdirSync(outDir, {recursive: true});
if (hash(sourceModel) !== expected) throw new Error('A_ROAD: approved exterior hash mismatch before proof.');
fs.copyFileSync(sourceModel, publicModel);
if (hash(publicModel) !== expected) throw new Error('A_ROAD: staged exterior hash mismatch.');

const entry = 'src/video002/trackUpgrade/road/road_proof_entry.tsx';
const renders = [
  ['YUNEX-002-A-ROAD-CLOSE-BEFORE', 'close_before.png'],
  ['YUNEX-002-A-ROAD-CLOSE-AFTER', 'close_after.png'],
  ['YUNEX-002-A-ROAD-WIDE-BEFORE', 'wide_before.png'],
  ['YUNEX-002-A-ROAD-WIDE-AFTER', 'wide_after.png'],
];

for (const [composition, output] of renders) {
  run('npx', [
    'remotion',
    'still',
    entry,
    composition,
    `out/track-upgrade/a-road/${output}`,
    '--gl=swangle',
    '--image-format=png',
    '--scale=1',
    '--timeout=120000',
  ]);
  run('ffprobe', [
    '-v',
    'error',
    '-select_streams',
    'v:0',
    '-show_entries',
    'stream=width,height,codec_name',
    '-of',
    'json',
    `out/track-upgrade/a-road/${output}`,
  ]);
}

run('ffmpeg', [
  '-y',
  '-i',
  'out/track-upgrade/a-road/close_before.png',
  '-i',
  'out/track-upgrade/a-road/close_after.png',
  '-filter_complex',
  '[0:v]scale=540:960[a];[1:v]scale=540:960[b];[a][b]hstack=inputs=2',
  'out/track-upgrade/a-road/close_comparison.png',
]);
run('ffmpeg', [
  '-y',
  '-i',
  'out/track-upgrade/a-road/wide_before.png',
  '-i',
  'out/track-upgrade/a-road/wide_after.png',
  '-filter_complex',
  '[0:v]scale=540:960[a];[1:v]scale=540:960[b];[a][b]hstack=inputs=2',
  'out/track-upgrade/a-road/wide_comparison.png',
]);

if (hash(sourceModel) !== expected || hash(publicModel) !== expected) {
  throw new Error('A_ROAD: approved exterior changed during proof render.');
}
console.log('A_ROAD proof complete; contract tests run during bundle and approved exterior hash is unchanged.');
