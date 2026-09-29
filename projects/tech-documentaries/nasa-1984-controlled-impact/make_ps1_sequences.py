import math, random
from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter
import numpy as np

OUT = Path('/mnt/data/cid_ps1_v2')
CABIN_DIR = OUT/'cabin'
FAIL_DIR = OUT/'failure'
CABIN_DIR.mkdir(parents=True, exist_ok=True)
FAIL_DIR.mkdir(parents=True, exist_ok=True)

W,H = 180,320
FPS = 30
random.seed(1984)
BAYER = np.array([[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]],dtype=np.float32)/16.0 - 0.5

def ps1_grade(im, seed=0, levels=18, grain=4.5, warm=False):
    arr=np.asarray(im.convert('RGB')).astype(np.float32)
    if warm:
        arr[:,:,0]*=1.05; arr[:,:,1]*=.96; arr[:,:,2]*=.86
    arr=np.clip(arr,0,255)
    step=255/(levels-1)
    arr=np.round(arr/step)*step
    pat=np.tile(BAYER,(math.ceil(H/4),math.ceil(W/4)))[:H,:W]
    arr += pat[:,:,None]*7.5
    rng=np.random.default_rng(seed)
    arr += rng.normal(0,grain,(H,W,1))
    rr=np.roll(arr[:,:,0],1,axis=1)
    bb=np.roll(arr[:,:,2],-1,axis=1)
    arr[:,:,0]=arr[:,:,0]*.82 + rr*.18
    arr[:,:,2]=arr[:,:,2]*.82 + bb*.18
    arr=np.clip(arr,0,255).astype(np.uint8)
    for y in range(0,H,8):
        off=int(round(1.2*math.sin(seed*.17 + y*.11)))
        arr[y:y+4]=np.roll(arr[y:y+4],off,axis=1)
    return Image.fromarray(arr)

def add_analogue_softness(im):
    return im.resize((360,640),Image.Resampling.NEAREST).filter(ImageFilter.GaussianBlur(.18))

def cabin_frame(i,total):
    t=i/(total-1)
    im=Image.new('RGB',(W,H),(14,13,12))
    d=ImageDraw.Draw(im,'RGBA')
    # Boeing-style narrowbody cabin shell with forced perspective.
    d.polygon([(0,0),(W,0),(W,235),(125,93),(55,93),(0,235)],fill=(40,39,34,255))
    d.polygon([(0,60),(44,80),(55,93),(42,300),(0,H)],fill=(54,57,46,255))
    d.polygon([(W,60),(W-44,80),(W-55,93),(W-42,300),(W,H)],fill=(54,57,46,255))
    d.polygon([(64,92),(116,92),(141,H),(39,H)],fill=(38,27,25,255))
    # ceiling ribs / bins
    for k in range(8):
        yy=18+k*11
        half=42-int(k*2.8)
        d.polygon([(90-half,yy),(90+half,yy),(90+half-4,yy+5),(90-half+4,yy+5)],fill=(55,52,45,230))
    # windows: perspective spacing and size, warm desert sunlight outside
    win_y=[88,118,153,194,241]
    for j,y in enumerate(win_y):
        ww=12+j*2; hh=7+j
        for x in (8+j*2, W-8-j*2-ww):
            d.rectangle((x,y,x+ww,y+hh),fill=(225,157,80,255),outline=(73,58,39,255),width=1)
            d.rectangle((x+2,y+2,x+ww-2,y+hh-2),fill=(250,182,94,210))
    # shifting sunlight bands across aisle and seats
    sun_shift=int(18*math.sin(t*math.pi*.85))
    d.polygon([(132+sun_shift,70),(159+sun_shift,75),(112+sun_shift,315),(86+sun_shift,315)],fill=(252,179,87,23+int(18*t)))
    d.polygon([(145+sun_shift,75),(153+sun_shift,76),(106+sun_shift,315),(98+sun_shift,315)],fill=(255,224,160,18))
    # seat rows and instrumented dummies
    rows=[(110,.62),(148,.78),(198,1.0),(264,1.24)]
    for r,(y,sc) in enumerate(rows):
        seat_w=int(28*sc); seat_h=int(34*sc)
        for side in (-1,1):
            cx=int(90 + side*(25+9*r))
            inert=max(.4,sc)
            sx=2.2*math.sin(i*.29+r*1.3+side*.6)*inert
            sy=1.3*math.sin(i*.41+r*.8)*inert
            x0=int(cx-seat_w/2); y0=int(y-seat_h/2)
            # angled seat shell / cushion
            d.polygon([(x0,y0+5),(x0+seat_w,y0+5),(x0+seat_w+2,y0+seat_h),(x0-2,y0+seat_h)],fill=(59,47,39,255),outline=(23,21,18,255))
            d.rectangle((x0+3,y0+7,x0+seat_w-3,y0+15),fill=(91,52,38,255))
            # metal legs
            d.line((x0+3,y0+seat_h,x0+1,y0+seat_h+10),fill=(111,107,89,255),width=1)
            d.line((x0+seat_w-3,y0+seat_h,x0+seat_w-1,y0+seat_h+10),fill=(111,107,89,255),width=1)
            # crash-test dummy polygon head and torso, with inertial lag
            hx=cx+sx; hy=y0+10+sy
            rr=5+int(r*.7)
            head=[(hx-rr,hy-2),(hx-rr//2,hy-rr),(hx+rr//2,hy-rr),(hx+rr,hy-2),(hx+rr-1,hy+rr),(hx-rr+1,hy+rr)]
            d.polygon(head,fill=(205,145,69,255),outline=(78,50,27,255))
            d.line((hx-rr+2,hy,hx+rr-2,hy),fill=(239,198,116,240),width=1)
            d.line((hx,hy-rr+2,hx,hy+rr-2),fill=(239,198,116,240),width=1)
            torso_y=y0+17+sy
            d.polygon([(cx-7,torso_y),(cx+7,torso_y),(cx+9,torso_y+17),(cx-9,torso_y+17)],fill=(177,112,50,255),outline=(67,43,25,255))
            # X harness + loose tail reacting to inertia
            d.line((cx-6,torso_y+1,cx+6+sx*.5,torso_y+16),fill=(25,24,21,255),width=2)
            d.line((cx+6,torso_y+1,cx-6+sx*.5,torso_y+16),fill=(25,24,21,255),width=2)
            tailx=cx+8+4*math.sin(i*.35+r+side)
            d.line((cx+6,torso_y+15,tailx,torso_y+25),fill=(30,29,25,220),width=1)
    # ceiling cable and hanging instrumentation tags
    cable=[]
    for x in range(24,157,8):
        cable.append((x,55+3*math.sin(x*.11+i*.18)+2*math.sin(i*.33)))
    d.line(cable,fill=(14,13,12,255),width=2)
    for n,(x,y) in enumerate([(56,68),(93,61),(124,72),(77,98)]):
        dx=3*math.sin(i*.31+n); dy=2*math.sin(i*.25+n*1.4)
        d.rectangle((x+dx,y+dy,x+dx+5,y+dy+4),fill=(218,190,118,230),outline=(79,65,43,220))
    # dust/fibres wake up as yaw begins
    rng=random.Random(5000+i)
    activity=.25+.75*max(0,(t-.38)/.62)
    for k in range(28):
        x=(rng.randrange(W)+int(12*t))%W
        y=(rng.randrange(H)+int(25*t))%H
        if rng.random()<activity:
            d.point((x,y),fill=(211,178,112,80+int(60*activity)))
    # cabin roll is restrained; the occupants/straps carry the energy
    roll=0.45*math.sin(t*math.pi*1.4)+1.3*max(0,t-.72)
    im=im.rotate(roll,Image.Resampling.NEAREST,fillcolor=(8,8,7))
    im=ps1_grade(im,1000+i,levels=17,grain=5.1,warm=True)
    return add_analogue_softness(im)

def failure_frame(i,total):
    t=i/(total-1)
    im=Image.new('RGB',(W,H),(91,109,109))
    d=ImageDraw.Draw(im,'RGBA')
    # distant desert / hard horizon
    d.rectangle((0,0,W,94),fill=(100,118,119,255))
    d.polygon([(0,95),(30,72),(56,96),(88,79),(113,96),(151,76),(W,95)],fill=(86,79,62,255))
    d.rectangle((0,95,W,H),fill=(154,111,63,255))
    # runway / ground rush lines move through frame while camera stays controlled
    for k in range(26):
        yy=108+((k*19+i*8)%215)
        x=(k*53+i*2)%W
        length=7+(k%6)*5
        d.line((x,yy,min(W,x+length),yy),fill=(103,72,44,150),width=1)
    for off in (-38,38):
        d.line((90+off,95,90+off*2.05,H),fill=(220,191,129,165),width=1)
    # Aircraft layer: recognisable Boeing 720 silhouette, four nacelles, red cheatline/windows.
    plane=Image.new('RGBA',(W,H),(0,0,0,0)); q=ImageDraw.Draw(plane,'RGBA')
    cx,cy=87,168
    q.polygon([(cx-10,cy-72),(cx-4,cy-87),(cx+4,cy-87),(cx+10,cy-72),(cx+12,cy+58),(cx+5,cy+76),(cx-5,cy+76),(cx-12,cy+58)],fill=(184,182,166,255),outline=(54,53,48,255))
    q.polygon([(cx-10,cy-15),(cx-73,cy+7),(cx-69,cy+23),(cx-8,cy+11)],fill=(170,169,155,255),outline=(55,54,49,255))
    q.polygon([(cx+10,cy-15),(cx+77,cy+8),(cx+69,cy+25),(cx+8,cy+11)],fill=(170,169,155,255),outline=(55,54,49,255))
    q.polygon([(cx-6,cy+50),(cx-35,cy+67),(cx-30,cy+78),(cx-4,cy+63)],fill=(157,156,145,255))
    q.polygon([(cx+6,cy+50),(cx+35,cy+67),(cx+30,cy+78),(cx+4,cy+63)],fill=(157,156,145,255))
    # cheatline and windows make it read as the actual Boeing rather than a toy
    q.rectangle((cx-10,cy-28,cx+10,cy-22),fill=(144,49,43,255))
    for yy in range(cy-62,cy+34,7):
        q.rectangle((cx-5,yy,cx+5,yy+2),fill=(35,43,46,255))
    # 4 engines, with simple highlights
    engines=[(cx-37,cy+4),(cx-61,cy+13),(cx+38,cy+4),(cx+62,cy+14)]
    for ex,ey in engines:
        q.ellipse((ex-7,ey-11,ex+7,ey+11),fill=(61,61,57,255),outline=(23,23,22,255))
        q.ellipse((ex-4,ey-7,ex+4,ey+6),fill=(24,24,23,255))
        q.line((ex-4,ey-7,ex+4,ey-4),fill=(122,117,101,180),width=1)
    # progressive yaw / right wing drop, not frantic camera motion
    yaw=-11.5*max(0,min(1,(t-.17)/.63))**1.15
    drop=5.5*max(0,min(1,(t-.28)/.57))
    # translate a little left as it departs line
    tx=-9*max(0,min(1,(t-.22)/.6)); ty=7*t
    plane=plane.rotate(yaw,Image.Resampling.NEAREST,center=(cx,cy),fillcolor=(0,0,0,0))
    im=Image.alpha_composite(im.convert('RGBA'),Image.new('RGBA',(W,H),(0,0,0,0)))
    im.alpha_composite(plane,(int(tx),int(ty)))
    d=ImageDraw.Draw(im,'RGBA')
    # dust appears under the low wing
    act=max(0,min(1,(t-.38)/.42))
    for k in range(18):
        px=35+((k*17+i*5)%60); py=214+((k*13+i*7)%45)
        r=1+int((k%4)*act)
        d.ellipse((px-r,py-r,px+r,py+r),fill=(190,140,82,35+int(70*act)))
    # world-fixed steel cutter enters dangerous path on screen-right.
    enter=max(0,min(1,(t-.48)/.36))
    tipx=207-76*(enter**1.08); tipy=260-86*(enter**1.02)
    vib=1.4*math.sin(i*.75)*enter; tipx+=vib
    edge=(24,26,26,255); steel=(67,72,70,255); hi=(128,130,119,230)
    d.line((tipx+32,tipy+96,tipx,tipy+8),fill=edge,width=10)
    d.line((tipx+50,tipy+96,tipx,tipy+8),fill=edge,width=10)
    d.line((tipx+32,tipy+96,tipx,tipy+8),fill=steel,width=6)
    d.line((tipx+50,tipy+96,tipx,tipy+8),fill=steel,width=6)
    d.line((tipx+34,tipy+92,tipx+4,tipy+14),fill=hi,width=1)
    d.polygon([(tipx-9,tipy+10),(tipx+9,tipy+10),(tipx,tipy-11)],fill=(91,95,90,255),outline=edge)
    # collision event: fragment, pylon tear, fuel mist. Hard cut follows immediately.
    contact=max(0,min(1,(t-.84)/.16))
    if contact>0:
        hx,hy=int(tipx),int(tipy)
        d.ellipse((hx-7,hy-5,hx+7,hy+6),fill=(255,205,89,180-int(100*contact)))
        for k in range(34):
            ang=-2.6+(k%9)*.07; rr=4+contact*(8+(k%8)*2.2)
            ex=hx+math.cos(ang)*rr; ey=hy+math.sin(ang)*rr+(k%4)
            d.line((hx,hy,ex,ey),fill=(245,180+(k%3)*15,75,225),width=1)
        for k in range(18):
            fx=hx-contact*(8+(k%6)*6)+((k*11)%7)-3
            fy=hy+contact*(3+(k%5)*5)+((k*5)%5)-2
            r=1+(k%3); d.rectangle((fx-r,fy-r,fx+r,fy+r),fill=(39,35,31,240))
        for k in range(13):
            px=hx-contact*(10+(k%4)*7); py=hy+contact*(6+(k%5)*5); r=2+(k%4)
            d.ellipse((px-r,py-r,px+r,py+r),fill=(205,144,73,55+int(55*contact)))
    im=ps1_grade(im.convert('RGB'),3000+i,levels=16,grain=5.5,warm=True)
    return add_analogue_softness(im)

if __name__=='__main__':
    cab_total=83
    fail_total=84
    for i in range(cab_total):
        cabin_frame(i,cab_total).save(CABIN_DIR/f'{i:04d}.png',compress_level=2)
    for i in range(fail_total):
        failure_frame(i,fail_total).save(FAIL_DIR/f'{i:04d}.png',compress_level=2)
    for src,name in [(CABIN_DIR/'0038.png','cabin_mid.jpg'),(CABIN_DIR/'0068.png','cabin_late.jpg'),(FAIL_DIR/'0042.png','failure_yaw.jpg'),(FAIL_DIR/'0072.png','failure_contact.jpg')]:
        Image.open(src).save(OUT/name,quality=93)
    print(f'Generated {cab_total} cabin frames and {fail_total} failure frames in {OUT}')
