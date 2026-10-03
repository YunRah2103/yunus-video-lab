from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

HERE = Path(__file__).resolve().parents[1]
OUT = HERE / 'assets' / 'presenter'
OUT.mkdir(parents=True, exist_ok=True)
W,H=900,1200
S=3

def sc(v): return int(v*S)
COL={'skin':'#B86A4A','skin2':'#9D5038','black':'#0C0F12','hoodie':'#171B1F','cargo':'#242A2F','shoe':'#E7ECEF','cyan':'#00E5FF','white':'#F1F4F6','line':'#050708','shadow':'#0A0D10'}
def line(d,pts,fill,width): d.line([(sc(x),sc(y)) for x,y in pts],fill=fill,width=sc(width),joint='curve')
def ellipse(d,box,fill,outline=None,width=1): d.ellipse(tuple(sc(x) for x in box),fill=fill,outline=outline,width=sc(width))
def poly(d,pts,fill): d.polygon([(sc(x),sc(y)) for x,y in pts],fill=fill)

def face(d,cx,cy,expr='neutral',look='front'):
    ellipse(d,(cx-113,cy-8,cx-85,cy+42),COL['skin'],COL['line'],3); ellipse(d,(cx+85,cy-8,cx+113,cy+42),COL['skin'],COL['line'],3)
    ellipse(d,(cx-92,cy-82,cx+92,cy+98),COL['skin'],COL['line'],4)
    poly(d,[(cx-82,cy-66),(cx-56,cy-120),(cx+50,cy-128),(cx+86,cy-88),(cx+66,cy-58)],COL['black'])
    poly(d,[(cx-10,cy-75),(cx+105,cy-62),(cx+72,cy-45),(cx-4,cy-52)],COL['black'])
    line(d,[(cx-18,cy-98),(cx,cy-84),(cx+18,cy-98)],COL['cyan'],6)
    for off,dy in [(-72,-70),(-54,-86),(-35,-77),(48,-74),(68,-65)]: line(d,[(cx+off,cy+dy),(cx+off+12,cy+dy-22)],COL['black'],8)
    eye_y=cy-4
    if expr=='annoyed':
        line(d,[(cx-50,eye_y-4),(cx-25,eye_y+2)],COL['line'],5); line(d,[(cx+25,eye_y+2),(cx+50,eye_y-4)],COL['line'],5)
    elif expr=='surprised':
        ellipse(d,(cx-52,eye_y-5,cx-38,eye_y+9),COL['line']); ellipse(d,(cx+38,eye_y-5,cx+52,eye_y+9),COL['line'])
    else:
        ox=5 if look=='side' else 0
        ellipse(d,(cx-52+ox,eye_y,cx-40+ox,eye_y+12),COL['line']); ellipse(d,(cx+38+ox,eye_y,cx+50+ox,eye_y+12),COL['line'])
    if expr=='confused':
        line(d,[(cx-57,cy-22),(cx-33,cy-30)],COL['line'],4); line(d,[(cx+31,cy-30),(cx+56,cy-19)],COL['line'],4)
    elif expr=='thinking':
        line(d,[(cx-57,cy-20),(cx-35,cy-26)],COL['line'],4); line(d,[(cx+32,cy-22),(cx+57,cy-22)],COL['line'],4)
    line(d,[(cx-2,cy+12),(cx-7,cy+34),(cx+2,cy+38)],COL['skin2'],3)
    for a in range(-60,61,20): line(d,[(cx+a,cy+62),(cx+a+5,cy+65)],COL['skin2'],2)
    if expr in ('talk-a','surprised'): ellipse(d,(cx-25,cy+48,cx+25,cy+82),COL['line'])
    elif expr=='talk-b': line(d,[(cx-30,cy+55),(cx+30,cy+66)],COL['line'],6)
    elif expr=='annoyed': line(d,[(cx-27,cy+70),(cx+27,cy+60)],COL['line'],5)
    elif expr=='confused': line(d,[(cx-25,cy+58),(cx,cy+53),(cx+26,cy+66)],COL['line'],5)
    else: line(d,[(cx-24,cy+62),(cx+24,cy+62)],COL['line'],5)

def limb(d,a,b,c):
    line(d,[a,b],COL['hoodie'],34); line(d,[b,c],COL['skin'],25); ellipse(d,(c[0]-14,c[1]-12,c[0]+14,c[1]+16),COL['skin'],COL['line'],2)

def pose_image(name,expr='neutral',arms='down',look='front',head_shift=(0,0)):
    im=Image.new('RGBA',(W*S,H*S),(0,0,0,0)); d=ImageDraw.Draw(im); bx=450; by=475
    line(d,[(bx-56,by+320),(bx-66,by+545)],COL['cargo'],58); line(d,[(bx+58,by+320),(bx+72,by+545)],COL['cargo'],58)
    poly(d,[(bx-103,by+548),(bx-50,by+536),(bx-16,by+560),(bx-95,by+582)],COL['shoe']); poly(d,[(bx+38,by+546),(bx+90,by+540),(bx+120,by+568),(bx+42,by+580)],COL['shoe'])
    line(d,[(bx-95,by+575),(bx-18,by+558)],COL['cyan'],4); line(d,[(bx+46,by+573),(bx+118,by+565)],COL['cyan'],4)
    poly(d,[(bx-126,by+48),(bx-95,by-42),(bx+95,by-42),(bx+134,by+52),(bx+107,by+332),(bx-108,by+332)],COL['hoodie'])
    line(d,[(bx-48,by-20),(bx,by+22),(bx+47,by-20)],'#2C343A',10); line(d,[(bx-24,by+5),(bx-25,by+94)],COL['cyan'],4); line(d,[(bx+24,by+5),(bx+25,by+94)],COL['cyan'],4)
    L=(bx-100,by+35); R=(bx+100,by+35)
    if arms=='down': limb(d,L,(bx-155,by+160),(bx-152,by+290)); limb(d,R,(bx+155,by+160),(bx+152,by+290))
    elif arms=='point': limb(d,L,(bx-154,by+155),(bx-150,by+282)); limb(d,R,(bx+155,by+75),(bx+270,by+5)); line(d,[(bx+270,by+5),(bx+323,by-8)],COL['skin'],12)
    elif arms=='confused': limb(d,L,(bx-160,by+105),(bx-220,by+42)); limb(d,R,(bx+160,by+105),(bx+220,by+42))
    elif arms=='thinking': limb(d,L,(bx-155,by+160),(bx-150,by+286)); limb(d,R,(bx+120,by+90),(bx+55,by-78))
    elif arms=='crossed':
        line(d,[L,(bx-30,by+175),(bx+98,by+154)],COL['hoodie'],32); line(d,[R,(bx+24,by+187),(bx-98,by+150)],COL['hoodie'],32)
        ellipse(d,(bx+83,by+138,bx+118,by+170),COL['skin'],COL['line'],2); ellipse(d,(bx-118,by+136,bx-84,by+170),COL['skin'],COL['line'],2)
    elif arms=='explain': limb(d,L,(bx-148,by+102),(bx-245,by+85)); limb(d,R,(bx+148,by+102),(bx+245,by+85))
    elif arms=='look-up': limb(d,L,(bx-150,by+150),(bx-148,by+280)); limb(d,R,(bx+145,by+85),(bx+210,by-20))
    elif arms=='side': limb(d,L,(bx-145,by+145),(bx-128,by+275)); limb(d,R,(bx+135,by+145),(bx+188,by+252))
    ellipse(d,(bx-38,by-96,bx+38,by-30),COL['skin'],COL['line'],3)
    face(d,bx+head_shift[0],by-175+head_shift[1],expr,look); line(d,[(bx+68,by+315),(bx+103,by+315)],COL['cyan'],5)
    im.resize((W,H),Image.Resampling.LANCZOS).save(OUT/name)

poses=[('01-neutral.png','neutral','down','front',(0,0)),('02-talking-a.png','talk-a','down','front',(0,0)),('03-talking-b.png','talk-b','down','front',(0,0)),('04-pointing.png','neutral','point','front',(0,0)),('05-confused.png','confused','confused','front',(0,0)),('06-surprised.png','surprised','confused','front',(0,-5)),('07-annoyed.png','annoyed','crossed','front',(0,0)),('08-thinking.png','thinking','thinking','front',(0,0)),('09-arms-crossed.png','neutral','crossed','front',(0,0)),('10-explaining.png','talk-b','explain','front',(0,0)),('11-looking-up.png','neutral','look-up','front',(0,-14)),('12-looking-side.png','neutral','side','side',(10,0))]
for p in poses: pose_image(*p)
Image.open(OUT/'01-neutral.png').save(OUT/'packet-guy-v1-master.png')
sheet=Image.new('RGBA',(900,900),(7,12,17,255))
for i,p in enumerate(poses):
    t=Image.open(OUT/p[0]).resize((225,300),Image.Resampling.LANCZOS)
    sheet.alpha_composite(t,((i%4)*225,(i//4)*300))
sheet.save(OUT/'packet-guy-v1-turnaround.png')
sheet.convert('RGB').save(OUT/'packet-guy-v1-pose-sheet.jpg',quality=92)
print(f'Packet Guy presenter pack generated in {OUT}')
