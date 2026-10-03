from pathlib import Path
import shutil
import subprocess
import sys

HERE = Path(__file__).resolve().parents[1]
SRC = HERE / 'assets' / 'presenter'
DST = HERE / 'public' / 'presenter'
REQUIRED = [
    '01-neutral.png','02-talking-a.png','03-talking-b.png','04-pointing.png',
    '05-confused.png','06-surprised.png','07-annoyed.png','08-thinking.png',
    '09-arms-crossed.png','10-explaining.png','11-looking-up.png','12-looking-side.png',
    'packet-guy-v1-master.png','packet-guy-v1-turnaround.png'
]

if not all((SRC / name).exists() for name in REQUIRED):
    subprocess.run([sys.executable, str(HERE / 'scripts' / 'generate_presenter.py')], check=True)

DST.mkdir(parents=True, exist_ok=True)
for name in REQUIRED:
    shutil.copy2(SRC / name, DST / name)

print(f'Prepared {len(REQUIRED)} Packet Guy assets in {DST}')
