#!/usr/bin/env python3
from pathlib import Path
import json
import numpy as np
import trimesh
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Poly3DCollection

HERE = Path(__file__).resolve().parent
RENDERS = HERE / "renders"
RENDERS.mkdir(exist_ok=True)
engine = trimesh.load(HERE / "engine.glb", force="scene")
car_manifest = json.loads((HERE.parent / "asset-manifest.json").read_text())
marker = np.array([0.0, 0.47, -1.78])

COLORS = {
    "Crankcase": np.array([0.56, 0.58, 0.60]),
    "Bank_L": np.array([0.43, 0.45, 0.47]),
    "Bank_R": np.array([0.43, 0.45, 0.47]),
    "Intake": np.array([0.055, 0.065, 0.072]),
    "Headers_L": np.array([0.58, 0.48, 0.34]),
    "Headers_R": np.array([0.58, 0.48, 0.34]),
    "Accessory_Drive": np.array([0.14, 0.15, 0.16]),
    "Cover_L": np.array([0.04, 0.045, 0.05]),
    "Cover_R": np.array([0.04, 0.045, 0.05]),
    "Mounts": np.array([0.18, 0.19, 0.20]),
}

def group(name):
    return next((g for g in COLORS if name.startswith(g + "__")), "Crankcase")

def P(v):
    a = np.asarray(v)
    return np.stack([a[..., 0], a[..., 2], a[..., 1]], axis=-1)

def style(ax):
    fig = ax.figure
    fig.patch.set_facecolor("#151719")
    ax.set_facecolor("#151719")
    ax.set_axis_off()
    ax.set_proj_type("ortho")

def add_engine(ax, offset=np.zeros(3)):
    light = np.array([0.2, -0.6, 0.9])
    light = light / np.linalg.norm(light)
    for name, mesh in engine.geometry.items():
        verts = P(mesh.vertices + offset)
        normals = P(mesh.face_normals)
        tris = verts[mesh.faces]
        base = COLORS[group(name)]
        lum = np.clip(0.50 + 0.50 * np.maximum(0, normals @ light), 0.38, 1.0)
        facecolors = np.clip(base[None, :] * lum[:, None] + 0.03, 0, 1)
        ax.add_collection3d(Poly3DCollection(tris, facecolors=facecolors, edgecolors=(0, 0, 0, 0.10), linewidths=0.05))

# Isolated review
fig = plt.figure(figsize=(12, 9), dpi=160)
ax = fig.add_subplot(111, projection="3d")
style(ax)
add_engine(ax)
pb = P(np.array([engine.bounds[0], engine.bounds[1]]))
centre = pb.mean(0)
radius = max(np.abs(pb[1] - pb[0])) * 0.60
ax.set_xlim(centre[0] - radius, centre[0] + radius)
ax.set_ylim(centre[1] - radius, centre[1] + radius)
ax.set_zlim(centre[2] - radius, centre[2] + radius)
ax.set_box_aspect([1, 1, 1])
ax.view_init(elev=26, azim=-48)
fig.text(0.055, 0.925, "YUNEX · 992 GT3 RS FLAT-SIX", color="white", fontsize=18, weight="bold")
fig.text(0.055, 0.892, "ROUGH ISOLATED LOOKDEV · ASTRA REVIEW", color="#b9c2c8", fontsize=10)
fig.text(0.055, 0.06, "Low broad crankcase · opposed banks · six intake runners · 3-into-1 headers per side", color="#aeb8be", fontsize=9)
plt.savefig(RENDERS / "lookdev_isolated.png", bbox_inches="tight", facecolor=fig.get_facecolor(), pad_inches=0.18)
plt.close(fig)

# Installed side-fit review
wheel = {k: np.array(v) for k, v in car_manifest["wheel_pivots"].items() if k in ("RL", "RR")}
fig = plt.figure(figsize=(12, 9), dpi=160)
ax = fig.add_subplot(111, projection="3d")
style(ax)

z = np.array([-2.28, -2.05, -1.75, -1.40, -1.05, -0.65, -0.25, 0.2, 0.6])
y = np.array([0.45, 0.62, 0.70, 0.78, 0.88, 1.05, 1.24, 1.30, 1.18])
for x in (-0.92, 0.92):
    q = P(np.stack([np.full_like(z, x), y, z], axis=-1))
    ax.plot(q[:, 0], q[:, 1], q[:, 2], color="#7fb482", alpha=0.28, linewidth=1.3)
    q2 = P(np.array([[x, 0.24, -2.25], [x, 0.22, -0.55]]))
    ax.plot(q2[:, 0], q2[:, 1], q2[:, 2], color="#7fb482", alpha=0.22, linewidth=1.0)

theta = np.linspace(0, 2 * np.pi, 160)
for p in wheel.values():
    rr = 0.335
    ring = np.stack([np.full_like(theta, p[0]), p[1] + rr * np.cos(theta), p[2] + rr * np.sin(theta)], axis=-1)
    q = P(ring)
    ax.plot(q[:, 0], q[:, 1], q[:, 2], color="#d1d6d8", alpha=0.65, linewidth=2.2)

rear_z = float(np.mean([p[2] for p in wheel.values()]))
for x in (-0.95, 0.95):
    line = P(np.array([[x, 0.08, rear_z], [x, 0.95, rear_z]]))
    ax.plot(line[:, 0], line[:, 1], line[:, 2], color="#d4dadd", alpha=0.35, linewidth=0.9)

add_engine(ax, marker)
q = P(marker)
ax.scatter([q[0]], [q[1]], [q[2]], s=26, color="white")
ax.set_xlim(-1.1, 1.1)
ax.set_ylim(-2.38, -0.48)
ax.set_zlim(0.05, 1.3)
ax.set_box_aspect([0.55, 1.9, 1.25])
ax.view_init(elev=0, azim=0)
fig.text(0.055, 0.925, "ENGINE INSTALLED BEHIND REAR AXLE", color="white", fontsize=18, weight="bold")
fig.text(0.055, 0.892, "ROUGH SIDE-FIT REVIEW · APPROVED EXTERIOR GLB UNCHANGED", color="#b9c2c8", fontsize=10)
fig.text(0.055, 0.06, "Exact rear-wheel pivots + Marker_Engine_Mass. Green line is a fit proxy, not a replacement car model.", color="#aeb8be", fontsize=9)
plt.savefig(RENDERS / "lookdev_installed.png", bbox_inches="tight", facecolor=fig.get_facecolor(), pad_inches=0.18)
plt.close(fig)
