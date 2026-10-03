// Keep the normal Remotion CLI; tolerate restricted interface enumeration in
// managed execution environments without changing the renderer dependency.
const os = require('node:os');
const original = os.networkInterfaces;
os.networkInterfaces = () => {
  try { return original(); }
  catch { return {lo:[{address:'127.0.0.1',netmask:'255.0.0.0',family:'IPv4',mac:'00:00:00:00:00:00',internal:true,cidr:'127.0.0.1/8'}]}; }
};
const output = process.env.V3_OUTPUT || 'out/PORSCHE_V3_FINAL.mp4';
process.argv = [process.argv[0], process.argv[1], 'render', 'src/index.ts', 'Porsche-V3', output, '--codec=h264', '--crf=17', '--audio-bitrate=192k', '--pixel-format=yuv420p', ...process.argv.slice(2)];
require('@remotion/cli').cli().then(() => {
  const {spawnSync} = require('node:child_process');
  const fs = require('node:fs');
  const path = output;
  const mixed = output.replace(/\.mp4$/, '-mixed.mp4');
  const result = spawnSync('ffmpeg', ['-loglevel','error','-i',path,'-c:v','copy','-af','volume=5.5dB','-c:a','aac','-b:a','192k','-movflags','+faststart',mixed,'-y'], {stdio:'inherit'});
  if (result.status !== 0) throw new Error('Final audio mix failed');
  fs.renameSync(mixed, path);
  process.exit(0);
}).catch(error => { console.error(error); process.exit(1); });
