"""Restrained synthetic driving/road/wind bed. Not a real Porsche recording."""
import math,random,wave,struct,sys
from pathlib import Path
out=Path(sys.argv[1] if len(sys.argv)>1 else 'yunex/public/circuit-v2-sound.wav');out.parent.mkdir(parents=True,exist_ok=True)
sr=48000;r=random.Random(210304);phase=0;filtered=0;buf=bytearray()
for i in range(sr*12):
 t=i/sr;shot=int(t//3);p=(t%3)/3;freq=95+22*p+8*math.sin(t*.8);phase+=2*math.pi*freq/sr
 engine=.075*(math.sin(phase)+.42*math.sin(phase*2)+.16*math.sin(phase*3)+.05*math.sin(phase*6))
 noise=r.uniform(-1,1);filtered=filtered*.97+noise*.03;road=.06*filtered+.012*noise
 fade=min(1,t/.12,(12-t)/.45);gain=[.8,.63,.94,.87][shot]
 left=(engine*gain+road)*fade;right=(engine*gain+road*.91)*fade
 buf+=struct.pack('<hh',round(left*32767),round(right*32767))
with wave.open(str(out),'wb') as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(sr);f.writeframes(buf)
print(out)
