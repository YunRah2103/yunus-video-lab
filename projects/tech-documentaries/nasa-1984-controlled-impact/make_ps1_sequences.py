import os, math, random
from PIL import Image, ImageDraw
import numpy as np

W,H=360,640
OUT='/mnt/data/ps1'
os.makedirs(OUT,exist_ok=True)
os.makedirs(f'{OUT}/cabin',exist_ok=True)
os.makedirs(f'{OUT}/failure',exist_ok=True)

random.seed(1984)

BAYER=np.array([[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]],dtype=np.float32)/16.0-0.5

def grade(img, seed=0, grain=8, poster=26):
    arr=np.array(img).astype(np.float32)
    r=np.roll(arr[:,:,0],1,axis=1)
    b=np.roll(arr[:,:,2],-1,axis=1)
    arr[:,:,0]=0.82*arr[:,:,0]+0.18*r
    arr[:,:,2]=0.82*arr[:,:,2]+0.18*b
    levels=poster
    arr=np.round(arr/(255/(levels-1)))*(255/(levels-1))
    pat=np.tile(BAYER,(math.ceil(H/4),math.ceil(W/4)))[:H,:W]
    arr += pat[:,:,None]*10
    rng=np.random.default_rng(seed)
    arr += rng.normal(0,grain,(H,W,1))
    arr=np.clip(arr,0,255).astype(np.uint8)
    im=Image.fromarray(arr)
    im=im.resize((W//2,H//2),Image.Resampling.BILINEAR).resize((W,H),Image.Resampling.NEAREST)
    return im

def poly(draw, pts, fill, outline=None, width=1):
    draw.polygon(pts, fill=fill)
    if outline:
        draw.line(pts+[pts[0]], fill=outline, width=width, joint='curve')

def cabin_frame(i, total=84):
    t=i/(total-1)
    roll=math.sin(t*math.pi*1.5)*1.6 + math.sin(i*1.7)*0.4
    vibx=math.sin(i*2.4)*1.2
    viby=math.sin(i*2.9)*1.0
    img=Image.new('RGB',(W,H),(22,19,18))
    d=ImageDraw.Draw(img)

    vx=W/2 + 3*math.sin(t*3)
    vy=205 + 5*math.sin(t*2)
    poly(d,[(0,0),(W,0),(W,400),(vx+70,vy),(vx-70,vy),(0,400)],(48,44,39))

    for k in range(7):
        y=18+k*25
        d.rectangle([55,y,W-55,y+11],fill=(67+3*(k%2),62,53))
        d.line([W/2,y,W/2,y+11],fill=(28,25,22),width=2)

    poly(d,[(78,H),(W-78,H),(vx+24,vy+44),(vx-24,vy+44)],(54,47,39))
    poly(d,[(0,90),(72,140),(vx-55,vy),(0,360)],(61,55,48))
    poly(d,[(W,90),(W-72,140),(vx+55,vy),(W,360)],(61,55,48))

    sun=int(18+18*max(0,math.sin(t*11)))
    for side in [-1,1]:
        for j in range(4):
            y=135+j*55
            if side<0:
                x=8+j*5
                box=[x,y,x+40,y+26]
            else:
                x=W-48-j*5
                box=[x,y,x+40,y+26]
            d.rectangle(box, fill=(155+sun,137+sun//2,95))
            d.rectangle([box[0],box[1]+17,box[2],box[3]], fill=(171,123,67))

    for row in range(4):
        depth=row/4
        y=300+row*72
        scale=1.0+row*0.11
        for side in [-1,1]:
            cx=95 if side<0 else W-95
            cx += side*row*8
            sw=int(56*scale)
            sh=int(72*scale)
            x0=int(cx-sw/2+vibx*(0.4+depth))
            y0=int(y-sh/2+viby*(0.6+depth))

            d.rounded_rectangle(
                [x0,y0,x0+sw,y0+sh],
                radius=4,
                fill=(67,61,54),
                outline=(25,23,22),
                width=2
            )
            d.rectangle([x0+7,y0+10,x0+sw-7,y0+23],fill=(81,72,61))
            d.line([x0+7,y0+sh,x0+4,y0+sh+24],fill=(95,87,73),width=3)
            d.line([x0+sw-7,y0+sh,x0+sw-4,y0+sh+24],fill=(95,87,73),width=3)

            hx=cx + math.sin(i*0.45+row+side)*2*(row+1)/4
            hy=y0+18 + math.sin(i*0.7+row)*1.8
            rr=12+row
            d.ellipse(
                [hx-rr,hy-rr,hx+rr,hy+rr],
                fill=(193,153,89),
                outline=(61,46,32),
                width=2
            )
            d.ellipse([hx-4,hy-4,hx+4,hy+4],fill=(35,31,28))
            d.line([hx-7,hy,hx+7,hy],fill=(224,194,130),width=2)
            d.line([hx,hy-7,hx,hy+7],fill=(224,194,130),width=2)

            torso=[
                (cx-15,y0+31),
                (cx+15,y0+31),
                (cx+20,y0+62),
                (cx-20,y0+62)
            ]
            poly(d,torso,(175,127,67),(72,51,31),2)

            sway=math.sin(i*0.55+row)*3
            d.line([cx-12,y0+34,cx+7+sway,y0+61],fill=(39,38,34),width=3)
            d.line([cx+12,y0+34,cx-7+sway,y0+61],fill=(39,38,34),width=3)

    pts=[]
    for x in range(60,301,20):
        y=105 + 4*math.sin((x+i*5)/23)
        pts.append((x,y))
    d.line(pts,fill=(27,24,22),width=3)

    for n,(x,y) in enumerate([(142,173),(212,150),(178,267)]):
        ang=math.sin(i*.7+n)*6
        d.rectangle([x+ang,y,x+ang+12,y+8],fill=(196,186,145))

    ylight=int(405+25*t)
    poly(
        d,
        [(120,ylight),(240,ylight),(218,ylight+50),(142,ylight+50)],
        (103+sun,79+sun//2,46)
    )

    img=grade(img,seed=1000+i,grain=7,poster=22)

    arr=np.array(img)
    for y in range(0,H,24):
        off=int(1.5*math.sin(i*.5+y*.07))
        arr[y:y+12]=np.roll(arr[y:y+12],off,axis=1)

    img=Image.fromarray(arr)
    img=img.rotate(
        roll,
        resample=Image.Resampling.NEAREST,
        fillcolor=(10,9,9)
    )
    return img

def failure_frame(i,total=84):
    t=i/(total-1)
    img=Image.new('RGB',(W,H),(114,132,126))
    d=ImageDraw.Draw(img)

    d.rectangle([0,0,W,250], fill=(112,130,127))
    d.rectangle([0,250,W,H], fill=(151,112,68))
    poly(
        d,
        [(0,250),(50,205),(110,245),(170,212),(230,250),(300,216),(360,250)],
        (91,88,72)
    )

    for k in range(28):
        yy=260+((k*31 + i*17)%(H-260))
        x=((k*79 + i*5)%W)
        length=16+(k%5)*10
        d.line(
            [x,yy,min(W,x+length),yy],
            fill=(110,76,48),
            width=2 if yy<420 else 3
        )

    yaw=max(0,(t-0.18)/0.6)*(-12)
    roll=max(0,(t-0.10)/0.65)*(-9)
    cx=165-20*max(0,t-.25)
    cy=325+35*t

    layer=Image.new('RGBA',(W,H),(0,0,0,0))
    q=ImageDraw.Draw(layer)

    q.rounded_rectangle(
        [cx-20,cy-95,cx+20,cy+105],
        radius=18,
        fill=(175,169,150,255),
        outline=(62,57,48,255),
        width=3
    )
    q.polygon(
        [(cx-20,cy-90),(cx,cy-128),(cx+20,cy-90)],
        fill=(181,174,153,255)
    )
    q.polygon(
        [(cx-12,cy-25),(cx-132,cy+24),(cx-124,cy+48),(cx-8,cy+18)],
        fill=(163,157,139,255),
        outline=(57,54,48,255)
    )
    q.polygon(
        [(cx+12,cy-25),(cx+140,cy+12),(cx+126,cy+39),(cx+8,cy+18)],
        fill=(163,157,139,255),
        outline=(57,54,48,255)
    )
    q.polygon(
        [(cx-10,cy+75),(cx-58,cy+97),(cx-50,cy+111),(cx-7,cy+95)],
        fill=(153,148,132,255)
    )
    q.polygon(
        [(cx+10,cy+75),(cx+58,cy+97),(cx+50,cy+111),(cx+7,cy+95)],
        fill=(153,148,132,255)
    )

    engines=[
        (cx-64,cy+18),
        (cx-100,cy+30),
        (cx+65,cy+15),
        (cx+103,cy+26)
    ]
    for ex,ey in engines:
        q.ellipse(
            [ex-10,ey-18,ex+10,ey+18],
            fill=(72,69,63,255),
            outline=(25,24,23,255),
            width=2
        )
        q.ellipse(
            [ex-5,ey-10,ex+5,ey+8],
            fill=(30,29,28,255)
        )

    for yy in range(int(cy-64),int(cy+52),13):
        q.rectangle(
            [cx-10,yy,cx+10,yy+4],
            fill=(40,48,49,255)
        )

    q.rectangle(
        [cx-13,cy+57,cx+13,cy+73],
        fill=(122,54,42,255)
    )

    layer=layer.rotate(
        yaw+roll,
        resample=Image.Resampling.NEAREST,
        center=(cx,cy),
        fillcolor=(0,0,0,0)
    )
    img=Image.alpha_composite(img.convert('RGBA'),layer)
    d=ImageDraw.Draw(img)

    if t>0.35:
        strength=(t-.35)/.65
        for k in range(18):
            x=33+(k*13+i*7)%100
            y=int(395 + (k*19+i*9)%80)
            r=3+int(8*strength*((k%4+1)/4))
            d.ellipse(
                [x-r,y-r,x+r,y+r],
                fill=(185,141,88,int(70+100*strength))
            )

    cutter_x=390 - max(0,t-0.42)/0.58*185
    base_y=450
    steel=(67,72,69,255)
    edge=(29,31,30,255)

    d.line(
        [(cutter_x+35,base_y+100),(cutter_x,base_y-20)],
        fill=steel,
        width=13
    )
    d.line(
        [(cutter_x+82,base_y+100),(cutter_x,base_y-20)],
        fill=steel,
        width=13
    )
    d.line(
        [(cutter_x+35,base_y+100),(cutter_x+82,base_y+100)],
        fill=edge,
        width=6
    )
    d.polygon(
        [
            (cutter_x-16,base_y-22),
            (cutter_x+16,base_y-22),
            (cutter_x,base_y-62)
        ],
        fill=(88,92,84,255)
    )

    if t>0.88:
        u=(t-.88)/.12
        hx=int(cutter_x)
        hy=int(base_y-45)
        for k in range(24):
            ang=(k*2.399+i*.3)
            rr=5+u*(8+(k%7)*5)
            x=hx+math.cos(ang)*rr
            y=hy+math.sin(ang)*rr
            d.line(
                [(hx,hy),(x,y)],
                fill=(230,184+int(40*u),98,255),
                width=2
            )

        for k in range(12):
            x=hx+((k*19+i*4)%50)-25
            y=hy+((k*23+i*6)%45)-10
            d.rectangle(
                [x,y,x+3,y+3],
                fill=(50,46,40,255)
            )

    img=grade(
        img.convert('RGB'),
        seed=3000+i,
        grain=8,
        poster=20
    )

    arr=np.array(img)
    for y in range(0,H,20):
        off=int(2*math.sin(i*.43+y*.09))
        arr[y:y+8]=np.roll(arr[y:y+8],off,axis=1)

    return Image.fromarray(arr)

if __name__=='__main__':
    total=84

    for i in range(total):
        cabin_frame(i,total).save(
            f'{OUT}/cabin/{i:04d}.png'
        )
        failure_frame(i,total).save(
            f'{OUT}/failure/{i:04d}.png'
        )

    for name,idx in [
        ('cabin_mid',42),
        ('cabin_end',80),
        ('failure_mid',48),
        ('failure_end',81)
    ]:
        src=(
            f'{OUT}/'
            + ('cabin' if name.startswith('cabin') else 'failure')
            + f'/{idx:04d}.png'
        )
        Image.open(src).resize(
            (540,960),
            Image.Resampling.NEAREST
        ).save(
            f'{OUT}/{name}.jpg',
            quality=92
        )
