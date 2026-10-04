#!/usr/bin/env python3
"""
YUNEX 992 GT3 RS simplified 4.0L naturally aspirated flat-six engine asset.

Original procedural geometry for YUNEX explanatory use.
Not manufacturer CAD and not a mechanical simulation.

Coordinates:
  +Y up
  +Z car forward
  +X driver's left
Engine_Root is the crankcase centre.
"""
from pathlib import Path
import hashlib
import json
import math
import numpy as np
import trimesh
from trimesh.visual.material import PBRMaterial

HERE = Path(__file__).resolve().parent
OUT = HERE / "engine.glb"
MANIFEST = HERE / "asset-manifest.json"

MATERIALS = {
    "cast_aluminium": PBRMaterial(name="Cast_Aluminium", baseColorFactor=[0.46, 0.48, 0.50, 1.0], metallicFactor=0.58, roughnessFactor=0.48),
    "brushed_aluminium": PBRMaterial(name="Brushed_Aluminium", baseColorFactor=[0.62, 0.64, 0.66, 1.0], metallicFactor=0.72, roughnessFactor=0.34),
    "dark_composite": PBRMaterial(name="Dark_Composite", baseColorFactor=[0.055, 0.065, 0.072, 1.0], metallicFactor=0.08, roughnessFactor=0.42),
    "stainless": PBRMaterial(name="Stainless_Header", baseColorFactor=[0.48, 0.45, 0.40, 1.0], metallicFactor=0.82, roughnessFactor=0.29),
    "rubber": PBRMaterial(name="Restrained_Rubber", baseColorFactor=[0.035, 0.038, 0.04, 1.0], metallicFactor=0.0, roughnessFactor=0.78),
    "steel": PBRMaterial(name="Dark_Steel", baseColorFactor=[0.16, 0.17, 0.18, 1.0], metallicFactor=0.72, roughnessFactor=0.38),
}

GROUPS = ["Crankcase", "Bank_L", "Bank_R", "Intake", "Headers_L", "Headers_R", "Accessory_Drive", "Cover_L", "Cover_R", "Mounts"]
EXPLODE_VECTORS = {
    "Crankcase": [0.0, 0.0, 0.0],
    "Bank_L": [0.34, 0.02, 0.0],
    "Bank_R": [-0.34, 0.02, 0.0],
    "Intake": [0.0, 0.30, 0.0],
    "Headers_L": [0.26, -0.22, -0.05],
    "Headers_R": [-0.26, -0.22, -0.05],
    "Accessory_Drive": [0.0, 0.0, -0.28],
    "Cover_L": [0.20, 0.04, 0.0],
    "Cover_R": [-0.20, 0.04, 0.0],
    "Mounts": [0.0, -0.18, 0.12],
}

scene = trimesh.Scene()
scene.graph.update(frame_to="Engine_Root", frame_from="world", matrix=np.eye(4))
for group in GROUPS:
    scene.graph.update(frame_to=group, frame_from="Engine_Root", matrix=np.eye(4))

def add_mesh(group, mesh, name, material):
    mesh.visual = trimesh.visual.TextureVisuals(material=MATERIALS[material])
    scene.add_geometry(mesh, node_name=f"{group}__{name}", geom_name=f"{group}__{name}_mesh", parent_node_name=group)

def box(extents, center, group, name, material="cast_aluminium"):
    mesh = trimesh.creation.box(extents=extents, transform=trimesh.transformations.translation_matrix(center))
    add_mesh(group, mesh, name, material)

def cylinder(radius, height, center, axis, group, name, material="steel", sections=128):
    mesh = trimesh.creation.cylinder(radius=radius, height=height, sections=sections)
    if axis == "x":
        rotation = trimesh.transformations.rotation_matrix(math.pi / 2, [0, 1, 0])
    elif axis == "y":
        rotation = trimesh.transformations.rotation_matrix(math.pi / 2, [1, 0, 0])
    else:
        rotation = np.eye(4)
    mesh.apply_transform(trimesh.transformations.translation_matrix(center) @ rotation)
    add_mesh(group, mesh, name, material)

def capsule(radius, height, center, axis, group, name, material="cast_aluminium"):
    mesh = trimesh.creation.capsule(radius=radius, height=height, count=(24, 48))
    if axis == "x":
        rotation = trimesh.transformations.rotation_matrix(math.pi / 2, [0, 1, 0])
    elif axis == "y":
        rotation = trimesh.transformations.rotation_matrix(math.pi / 2, [1, 0, 0])
    else:
        rotation = np.eye(4)
    mesh.apply_transform(trimesh.transformations.translation_matrix(center) @ rotation)
    add_mesh(group, mesh, name, material)

def tube_between(p0, p1, radius, group, name, material="stainless", sections=96):
    p0 = np.asarray(p0, dtype=float)
    p1 = np.asarray(p1, dtype=float)
    vector = p1 - p0
    height = float(np.linalg.norm(vector))
    if height < 1e-8:
        return
    mesh = trimesh.creation.cylinder(radius=radius, height=height, sections=sections)
    z_axis = np.array([0.0, 0.0, 1.0])
    direction = vector / height
    axis = np.cross(z_axis, direction)
    dot = float(np.clip(np.dot(z_axis, direction), -1.0, 1.0))
    if np.linalg.norm(axis) < 1e-8:
        rotation = np.eye(4) if dot > 0 else trimesh.transformations.rotation_matrix(math.pi, [1, 0, 0])
    else:
        rotation = trimesh.transformations.rotation_matrix(math.acos(dot), axis / np.linalg.norm(axis))
    mesh.apply_transform(trimesh.transformations.translation_matrix((p0 + p1) * 0.5) @ rotation)
    add_mesh(group, mesh, name, material)

box([0.58, 0.30, 0.60], [0, 0.00, 0.00], "Crankcase", "main_case")
box([0.42, 0.13, 0.47], [0, -0.18, 0.00], "Crankcase", "sump")
cylinder(0.205, 0.10, [0, 0.01, 0.35], "z", "Crankcase", "flywheel_housing", "cast_aluminium", 160)
cylinder(0.105, 0.67, [0, -0.015, 0.0], "z", "Crankcase", "crank_spine", "brushed_aluminium", 144)
for i, z in enumerate(np.linspace(-0.24, 0.24, 5)):
    box([0.62, 0.035, 0.028], [0, 0.11, z], "Crankcase", f"rib_top_{i}", "brushed_aluminium")
for sx in (-1, 1):
    box([0.032, 0.24, 0.54], [sx * 0.306, 0.02, 0], "Crankcase", f"flange_{sx}", "brushed_aluminium")

bank_zs = [-0.22, 0.0, 0.22]
for group, sx in (("Bank_L", 1), ("Bank_R", -1)):
    box([0.30, 0.25, 0.65], [sx * 0.37, 0.045, 0], group, "water_jacket")
    for i, z in enumerate(bank_zs):
        cylinder(0.108, 0.31, [sx * 0.39, 0.045, z], "x", group, f"cylinder_bulge_{i}", "cast_aluminium", 144)
        box([0.035, 0.19, 0.15], [sx * 0.535, 0.055, z], group, f"head_flange_{i}", "brushed_aluminium")
    for i, z in enumerate(np.linspace(-0.27, 0.27, 4)):
        box([0.32, 0.026, 0.035], [sx * 0.37, 0.158, z], group, f"housing_rib_{i}", "brushed_aluminium")

for group, sx in (("Cover_L", 1), ("Cover_R", -1)):
    box([0.085, 0.205, 0.59], [sx * 0.545, 0.07, 0], group, "main_cover", "dark_composite")
    for i, z in enumerate([-0.18, 0.0, 0.18]):
        box([0.018, 0.16, 0.045], [sx * 0.592, 0.08, z], group, f"cover_rib_{i}", "dark_composite")
    for i, z in enumerate([-0.24, 0.0, 0.24]):
        cylinder(0.014, 0.012, [sx * 0.593, 0.13, z], "x", group, f"fastener_{i}", "steel", 64)

box([0.36, 0.15, 0.56], [0, 0.31, 0.0], "Intake", "plenum", "dark_composite")
capsule(0.075, 0.34, [0, 0.355, 0], "z", "Intake", "plenum_crown", "dark_composite")
for sx in (-1, 1):
    for i, z in enumerate(bank_zs):
        cylinder(0.044, 0.12, [sx * 0.19, 0.255, z], "y", "Intake", f"throttle_{sx}_{i}", "brushed_aluminium", 112)
        p0 = (sx * 0.16, 0.285, z)
        p1 = (sx * 0.29, 0.235, z)
        p2 = (sx * 0.39, 0.18, z)
        tube_between(p0, p1, 0.038, "Intake", f"runnerA_{sx}_{i}", "dark_composite", 96)
        tube_between(p1, p2, 0.038, "Intake", f"runnerB_{sx}_{i}", "dark_composite", 96)

for sx, group in ((1, "Headers_L"), (-1, "Headers_R")):
    collector_z = -0.18
    for i, z in enumerate(bank_zs):
        p0 = (sx * 0.55, -0.01, z)
        p1 = (sx * 0.49, -0.17, z - 0.02)
        p2 = (sx * 0.34, -0.245, z - 0.07)
        p3 = (sx * 0.26, -0.245, collector_z)
        tube_between(p0, p1, 0.026, group, f"primary_{i}_a")
        tube_between(p1, p2, 0.026, group, f"primary_{i}_b")
        tube_between(p2, p3, 0.028, group, f"primary_{i}_c")
    cylinder(0.064, 0.25, [sx * 0.23, -0.245, -0.20], "z", group, "collector", "stainless", 128)

box([0.43, 0.31, 0.055], [0, 0.02, -0.39], "Accessory_Drive", "rear_plate", "steel")
for i, (x, y, r) in enumerate([(-0.12, 0.04, 0.075), (0.12, 0.07, 0.055), (0.0, -0.07, 0.062)]):
    cylinder(r, 0.035, [x, y, -0.425], "z", "Accessory_Drive", f"pulley_{i}", "dark_composite", 144)
    cylinder(r * 0.48, 0.044, [x, y, -0.447], "z", "Accessory_Drive", f"hub_{i}", "brushed_aluminium", 112)
tube_between((-0.12, 0.11, -0.449), (0.12, 0.11, -0.449), 0.012, "Accessory_Drive", "belt_top", "rubber", 64)
tube_between((-0.12, -0.03, -0.449), (0, -0.13, -0.449), 0.012, "Accessory_Drive", "belt_low_l", "rubber", 64)
tube_between((0, -0.13, -0.449), (0.12, 0.01, -0.449), 0.012, "Accessory_Drive", "belt_low_r", "rubber", 64)

for sx in (-1, 1):
    box([0.17, 0.055, 0.16], [sx * 0.43, -0.12, 0.26], "Mounts", f"mount_{sx}", "steel")
    cylinder(0.028, 0.22, [sx * 0.46, -0.11, 0.27], "x", "Mounts", f"mount_bush_{sx}", "rubber", 96)
    tube_between((sx * 0.25, 0.17, 0.26), (sx * 0.47, 0.17, 0.30), 0.018, "Mounts", f"upper_pipe_{sx}", "rubber", 64)

raw_bounds = scene.bounds.copy()
raw_ext = raw_bounds[1] - raw_bounds[0]
target_ext = np.array([1.10, 0.65, 0.85])
scale = target_ext / raw_ext
for geom in scene.geometry.values():
    geom.apply_scale(scale)
scaled_bounds = scene.bounds.copy()
target_y_center = (-0.24 + 0.41) * 0.5
y_shift = target_y_center - scaled_bounds.mean(axis=0)[1]
for geom in scene.geometry.values():
    geom.apply_translation([0.0, y_shift, 0.0])

OUT.write_bytes(scene.export(file_type="glb"))
loaded = trimesh.load(OUT, force="scene")
bounds = np.asarray(loaded.bounds, dtype=float)
triangles = int(sum(len(g.faces) for g in loaded.geometry.values() if hasattr(g, "faces")))
nodes = set(loaded.graph.nodes)
required_nodes = {"Engine_Root", *GROUPS}
missing_nodes = sorted(required_nodes - nodes)
parents = getattr(loaded.graph.transforms, "parents", {})
wrong_parents = {g: parents.get(g) for g in GROUPS if parents.get(g) != "Engine_Root"}
if not np.isfinite(bounds).all():
    raise RuntimeError("Engine bounds are not finite")
if missing_nodes:
    raise RuntimeError(f"Missing named groups: {missing_nodes}")
if wrong_parents:
    raise RuntimeError(f"Unexpected group parents: {wrong_parents}")

manifest = {
    "asset": "YUNEX 992 GT3 RS simplified 4.0L naturally aspirated flat-six",
    "status": "rough look-development for Astra review",
    "units": "metres",
    "axis": {"forward": "+Z", "up": "+Y", "left": "+X"},
    "engine_root": "crankcase centre",
    "bounds_metres": bounds.tolist(),
    "dimensions_metres": (bounds[1] - bounds[0]).tolist(),
    "triangles": triangles,
    "geometry_primitives": len(loaded.geometry),
    "named_groups": ["Engine_Root", *GROUPS],
    "materials": [m.name for m in MATERIALS.values()],
    "explode_vectors_local_metres": EXPLODE_VECTORS,
    "installation": {
        "parent_marker": "Marker_Engine_Mass",
        "car_marker_translation_metres": [0.0, 0.47, -1.78],
        "rear_axle_z_metres": -1.2114155216682174,
        "local_offset_metres": [0.0, 0.0, 0.0],
        "global_bounds_at_marker_metres": (bounds + np.array([0.0, 0.47, -1.78])).tolist(),
        "note": "Marker is approximate and is not a validated engine centre of gravity."
    },
    "limitations": [
        "Original simplified explanatory geometry; not Porsche CAD.",
        "No gearbox, pistons, valvetrain, animated internals, turbochargers or air-cooled fan tower.",
        "Dimensions and installation marker are illustrative fit targets rather than measured engine package data.",
        "Rough installed preview uses canonical car dimensions and wheel pivots as a fit proxy; exterior GLB is unchanged."
    ],
    "sha256": hashlib.sha256(OUT.read_bytes()).hexdigest(),
}
MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"engine_glb": str(OUT), "triangles": triangles, "bounds": bounds.tolist(), "dimensions": (bounds[1] - bounds[0]).tolist(), "sha256": manifest["sha256"]}, indent=2))
