from pygltflib import GLTF2
import numpy as np
from scipy.spatial.transform import Rotation
import sys
p=sys.argv[1];g=GLTF2().load(p);b=g.binary_blob()
def mat(n):
 if n.matrix:return np.array(n.matrix).reshape(4,4).T
 m=np.eye(4);m[:3,:3]=Rotation.from_quat(n.rotation or [0,0,0,1]).as_matrix()@np.diag(n.scale or [1,1,1]);m[:3,3]=n.translation or [0,0,0];return m
world={};parents={}
def rec(i,m):
 n=g.nodes[i];world[i]=m@mat(n)
 for k in n.children or []:parents[k]=i;rec(k,world[i])
for i in g.scenes[g.scene or 0].nodes:rec(i,np.eye(4))
def accessor(i):
 a=g.accessors[i];v=g.bufferViews[a.bufferView];cnt={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4}[a.type];dt={5126:'f4',5125:'u4',5123:'u2',5121:'u1'}[a.componentType]
 return np.frombuffer(b,dtype=dt,count=a.count*cnt,offset=(v.byteOffset or 0)+(a.byteOffset or 0)).reshape(a.count,cnt)
