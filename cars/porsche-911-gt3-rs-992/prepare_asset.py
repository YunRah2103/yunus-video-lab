from pygltflib import Asset, Scene, Buffer, Node, BufferView, Accessor, Attributes, Primitive, Mesh
from pathlib import Path
exec(Path(__file__).with_name('inspect_gt3.py').read_text())
import copy,io,json,hashlib
from pathlib import Path
from PIL import Image
from collections import defaultdict
out=Path(__file__).resolve().parent
# Preserve source surface topology and UVs; bake only transforms and organize parts.
groups=defaultdict(list);allverts=[];wheelverts=defaultdict(list)
raw=[]
for i,n in enumerate(g.nodes):
 if n.mesh is None:continue
 for p in g.meshes[n.mesh].primitives:
  v=accessor(p.attributes.POSITION);v=(np.c_[v,np.ones(len(v))]@world[i].T)[:,:3]*100
  no=accessor(p.attributes.NORMAL) if p.attributes.NORMAL is not None else np.zeros_like(v)
  nm=np.linalg.inv(world[i][:3,:3]).T;no=no@nm.T;no/=np.maximum(np.linalg.norm(no,axis=1,keepdims=True),1e-8)
  uv=accessor(p.attributes.TEXCOORD_0) if p.attributes.TEXCOORD_0 is not None else np.zeros((len(v),2))
  ind=accessor(p.indices).reshape(-1,3);matname=g.materials[p.material].name
  raw.append((v,no,uv,ind,p.material,matname));allverts.append(v)
lo=np.concatenate(allverts).min(0);hi=np.concatenate(allverts).max(0);scale=4.572/(hi[2]-lo[2]);offset=np.array([0,lo[1],(hi[2]+lo[2])/2])
for v,no,uv,ind,mi,name in raw:
 v=(v-offset)*scale;cent=v[ind].mean(1)
 if 'Wheel1' in name or 'Callipers' in name:
  for side in ['FL','FR','RL','RR']:
   mask=((cent[:,0]>0)==(side[1]=='L')) & ((cent[:,2]>0)==(side[0]=='F'))
   if not mask.any():continue
   typ='Caliper' if 'Callipers' in name else 'Wheel';key=f'{typ}_{side}'
   groups[(key,mi)].append((v,no,uv,ind[mask]))
   if typ=='Wheel':wheelverts[side].append(v[np.unique(ind[mask])])
 else:
  wing=(cent[:,2]<-1.38)&(cent[:,1]>1.03)
  # Swan-neck uprights and endplates remain part of Wing; upper surface isolated.
  wing|=(cent[:,2]<-1.72)&(cent[:,1]>.79)&(np.abs(cent[:,0])<.82)
  flap=wing&(cent[:,1]>1.22)
  names=np.full(len(ind),'Body',dtype=object);names[wing]='Wing';names[flap]='Wing_Flap'
  if 'Window' in name:names[~wing]='Glass'
  if 'Interior' in name:names[~wing]='Interior'
  if 'Light' in name or 'RED_GLASS' in name:names[~wing]='Lights'
  if 'Grille' in name:names[~wing]='Grilles'
  for typ in np.unique(names):groups[(typ,mi)].append((v,no,uv,ind[names==typ]))
pivots={}
for k,vs in wheelverts.items():
 v=np.concatenate(vs);pivots[k]=((v.min(0)+v.max(0))/2).tolist()
print('pivots',pivots)
ng=GLTF2(asset=Asset(version='2.0',generator='YUNEX asset pipeline',extras=g.asset.extras),materials=copy.deepcopy(g.materials),textures=copy.deepcopy(g.textures),samplers=copy.deepcopy(g.samplers),scenes=[Scene(nodes=[0])],scene=0,buffers=[Buffer(byteLength=0)])
ng.nodes=[Node(name='YUNEX_Porsche_911_GT3_RS_992',children=[],extras={'units':'metres','forward':'+Z','up':'+Y','origin':'ground centre','sourceLicense':'CC-BY-NC-SA-4.0'})]
blob=bytearray()
def view(data,target=None):
 while len(blob)%4:blob.append(0)
 start=len(blob);blob.extend(data);ng.bufferViews.append(BufferView(buffer=0,byteOffset=start,byteLength=len(data),target=target));return len(ng.bufferViews)-1
def addacc(a,typ):
 a=np.asarray(a,dtype='<u4' if typ=='SCALAR' else '<f4');vi=view(a.tobytes(),34963 if typ=='SCALAR' else 34962);aa=Accessor(bufferView=vi,componentType=5125 if typ=='SCALAR' else 5126,count=len(a),type=typ)
 if typ=='VEC3':aa.min=a.min(0).astype(float).tolist();aa.max=a.max(0).astype(float).tolist()
 ng.accessors.append(aa);return len(ng.accessors)-1
# Embedded, resized production textures; copies retained for material editing.
for ii,img in enumerate(g.images):
 bv=g.bufferViews[img.bufferView];data=b[(bv.byteOffset or 0):(bv.byteOffset or 0)+bv.byteLength];im=Image.open(io.BytesIO(data));im.thumbnail((2048,2048),Image.Resampling.LANCZOS)
 stream=io.BytesIO();alpha='A' in im.getbands() and im.getextrema()[-1]!=(255,255)
 fmt='PNG' if alpha else 'JPEG';im=im.convert('RGBA' if alpha else 'RGB');im.save(stream,format=fmt,**({'optimize':True} if alpha else {'quality':92,'optimize':True}));data=stream.getvalue();ext='png' if alpha else 'jpg';fname=f'texture_{ii:02d}.{ext}';(out/'textures'/fname).write_bytes(data);ng.images.append(Image if False else __import__('pygltflib').Image(bufferView=view(data),mimeType='image/png' if alpha else 'image/jpeg',name=f'texture_{ii:02d}'))
partnodes={};stats={}
for (part,mi),batches in groups.items():
 if part not in partnodes:
  if part.startswith('Wheel_'):
   side=part[-2:];pivot=pivots[side];steer=len(ng.nodes);ng.nodes.append(Node(name=f'Steer_{side}',translation=pivot,children=[]));ng.nodes[0].children.append(steer)
   idx=len(ng.nodes);ng.nodes.append(Node(name=f'Spin_{side}',children=[]));ng.nodes[steer].children.append(idx)
  else:
   idx=len(ng.nodes);pivot=pivots[part[-2:]] if part.startswith('Caliper_') else ([0,1.24,-1.8] if part.startswith('Wing') else [0,0,0]);ng.nodes.append(Node(name=part,translation=pivot,children=[]));ng.nodes[0].children.append(idx)
  partnodes[part]=(idx,pivot);stats[part]=0
 idx,pivot=partnodes[part];vertices=[];normals=[];uvs=[];inds=[];off=0
 for v,n,u,faces in batches:
  used,inv=np.unique(faces,return_inverse=True);vertices.append(v[used]-pivot);normals.append(n[used]);uvs.append(u[used]);inds.append(inv.reshape(-1,3)+off);off+=len(used)
 v=np.concatenate(vertices);n=np.concatenate(normals);u=np.concatenate(uvs);faces=np.concatenate(inds);stats[part]+=len(faces)
 attrs=Attributes(POSITION=addacc(v,'VEC3'),NORMAL=addacc(n,'VEC3'),TEXCOORD_0=addacc(u,'VEC2'))
 prim=Primitive(attributes=attrs,indices=addacc(faces.reshape(-1),'SCALAR'),material=mi)
 mesh=len(ng.meshes);short=g.materials[mi].name.replace('Porsche_911GT3RS992Tribute_2023','').replace('_Material','').strip('_');ng.meshes.append(Mesh(name=f'{part}_{short}',primitives=[prim]));ni=len(ng.nodes);ng.nodes.append(Node(name=f'{part}_{short}',mesh=mesh));ng.nodes[idx].children.append(ni)
# Clean reusable material names and moderate physically based surface response.
for m in ng.materials:
 m.name=m.name.replace('Porsche_911GT3RS992Tribute_2023','').replace('_Material','').strip('_')
 if m.pbrMetallicRoughness:
  if 'Paint' in m.name:m.pbrMetallicRoughness.roughnessFactor=.27;m.pbrMetallicRoughness.metallicFactor=.15
  if 'Window' in m.name:m.pbrMetallicRoughness.roughnessFactor=.12

for side in ['FL','FR']:
 ci,_=partnodes[f'Caliper_{side}'];si=next(i for i,n in enumerate(ng.nodes) if n.name==f'Steer_{side}');ng.nodes[0].children.remove(ci);ng.nodes[ci].translation=[0,0,0];ng.nodes[si].children.append(ci)
for name,pos in [('Marker_Front_Axle',[0,pivots['FL'][1],pivots['FL'][2]]),('Marker_Rear_Axle',[0,pivots['RL'][1],(pivots['RL'][2]+pivots['RR'][2])/2]),('Marker_Engine_Mass',[0,.47,-1.78])]:
 ni=len(ng.nodes);ng.nodes.append(Node(name=name,translation=pos,extras={'markerOnly':True,'engineeringIllustration':'approximate' if 'Engine' in name else 'wheel-centre'}));ng.nodes[0].children.append(ni)
ng.buffers[0].byteLength=len(blob);ng.set_binary_blob(bytes(blob));ng.save_binary(str(out/'model.glb'))
manifest={'car':'Porsche 911 GT3 RS 992','source':g.asset.extras,'dimensions_metres':((hi-lo)*scale).tolist(),'export_scale':scale,'triangles':sum(stats.values()),'meshes':len(ng.meshes),'nodes':len(ng.nodes),'wheel_pivots':pivots,'parts_triangles':stats,'axis':{'forward':'+Z','up':'+Y','left':'+X'},'sha256':hashlib.sha256((out/'model.glb').read_bytes()).hexdigest()};(out/'asset-manifest.json').write_text(json.dumps(manifest,indent=2));print('export',manifest['triangles'],len(ng.meshes),len(ng.nodes),(out/'model.glb').stat().st_size)
