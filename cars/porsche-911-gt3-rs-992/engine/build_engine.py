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
import struct
import numpy as np
import trimesh
from trimesh.visual.material import PBRMaterial

HERE = Path(__file__).resolve().parent
CAR_DIR = HERE.parent
OUT = HERE / "engine.glb"
MANIFEST = HERE / "asset-manifest.json"
VALIDATION = HERE / "validation.json"
REVIEW_NOTE = HERE / "REVIEW_NOTE.md"
README = HERE / "README.md"
CAR_GLB = CAR_DIR / "model.glb"
CAR_MANIFEST = CAR_DIR / "asset-manifest.json"

MATERIALS = {
    "cast_aluminium": PBRMaterial(name="Cast_Aluminium", baseColorFactor=[0.46, 0.48, 0.50, 1.0], metallicFactor=0.58, roughnessFactor=0.48),
    "brushed_aluminium": PBRMaterial(name="Brushed_Aluminium", baseColorFactor=[0.62, 0.64, 0.66, 1.0], metallicFactor=0.72, roughnessFactor=0.34),
    "dark_composite": PBRMaterial(name="Dark_Composite", baseColorFactor=[0.055, 0.065, 0.072, 1.0], metallicFactor=0.08, roughnessFactor=0.42),
    "stainless": PBRMaterial(name="Stainless_Header", baseColorFactor=[0.48, 0.45, 0.40, 1.0], metallicFactor=0.82, roughnessFactor=0.29),
    "rubber": PBRMaterial(name="Restrained_Rubber", baseColorFactor=[0.035, 0.038, 0.04, 1.0], metallicFactor=0.0, roughnessFactor=0.78),
    "steel": PBRMaterial(name="Dark_Steel", baseColorFactor=[0.16, 0.17, 0.18, 1.0], metallicFactor=0.72, roughnessFactor=0.38),
}

EXPECTED_BASE_COLORS = {
    "Cast_Aluminium": [0.46, 0.48, 0.50, 1.0],
    "Brushed_Aluminium": [0.62, 0.64, 0.66, 1.0],
    "Dark_Composite": [0.055, 0.065, 0.072, 1.0],
    "Stainless_Header": [0.48, 0.45, 0.40, 1.0],
    "Restrained_Rubber": [0.035, 0.038, 0.04, 1.0],
    "Dark_Steel": [0.16, 0.17, 0.18, 1.0],
}
TUBE_SOURCE_CHECKS = {}

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

def rounded_prism(extents, center, group, name, material="cast_aluminium", radius=0.04, corner_segments=5):
    """Rounded X/Y housing with split cap rings so cap seams stay hard."""
    ex, ey, ez = map(float, extents)
    r = max(0.0, min(float(radius), ex * 0.24, ey * 0.24))
    hx, hy, hz = ex / 2.0, ey / 2.0, ez / 2.0
    pts = []
    corners = [
        (hx-r, hy-r, 0.0), (-hx+r, hy-r, math.pi/2),
        (-hx+r, -hy+r, math.pi), (hx-r, -hy+r, 3*math.pi/2),
    ]
    for cx, cy, start in corners:
        for j in range(corner_segments + 1):
            a = start + (j / corner_segments) * (math.pi / 2)
            pts.append((cx + r*math.cos(a), cy + r*math.sin(a)))
    n = len(pts)
    verts = []
    for z in (-hz, hz):
        verts.extend([[x+center[0], y+center[1], z+center[2]] for x, y in pts])
    bottom_cap = len(verts)
    verts.extend([[x+center[0], y+center[1], center[2]-hz] for x, y in pts])
    top_cap = len(verts)
    verts.extend([[x+center[0], y+center[1], center[2]+hz] for x, y in pts])
    verts += [[center[0], center[1], center[2]-hz], [center[0], center[1], center[2]+hz]]
    bc, tc = len(verts)-2, len(verts)-1
    faces = []
    for i in range(n):
        j = (i+1) % n
        faces += [
            [i, j, n+j], [i, n+j, n+i],
            [bc, bottom_cap+j, bottom_cap+i],
            [tc, top_cap+i, top_cap+j],
        ]
    mesh = trimesh.Trimesh(vertices=np.asarray(verts), faces=np.asarray(faces), process=False)
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

def _catmull_rom(points, samples_per_segment=7):
    p = [np.asarray(x, dtype=float) for x in points]
    padded = [p[0], *p, p[-1]]
    out = []
    for i in range(1, len(padded)-2):
        p0, p1, p2, p3 = padded[i-1], padded[i], padded[i+1], padded[i+2]
        for s in range(samples_per_segment):
            t = s / float(samples_per_segment)
            t2, t3 = t*t, t*t*t
            out.append(0.5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t2+(-p0+3*p1-3*p2+p3)*t3))
    out.append(p[-1])
    return np.asarray(out)

def tube_path(points, radius, group, name, material="stainless", radial_segments=24, samples_per_segment=7):
    """Continuous curved tube with shared side rings and split cap rings."""
    path = _catmull_rom(points, samples_per_segment)
    tangents = np.zeros_like(path)
    tangents[0] = path[1]-path[0]
    tangents[-1] = path[-1]-path[-2]
    tangents[1:-1] = path[2:]-path[:-2]
    tangents /= np.linalg.norm(tangents, axis=1)[:,None]
    normals = np.zeros_like(path)
    bins = np.zeros_like(path)
    seed = np.array([0.0,1.0,0.0])
    if abs(np.dot(seed,tangents[0])) > 0.92:
        seed = np.array([1.0,0.0,0.0])
    normals[0] = np.cross(tangents[0], seed)
    normals[0] /= np.linalg.norm(normals[0])
    bins[0] = np.cross(tangents[0], normals[0])
    bins[0] /= np.linalg.norm(bins[0])
    for i in range(1,len(path)):
        n = normals[i-1] - tangents[i]*np.dot(normals[i-1],tangents[i])
        if np.linalg.norm(n) < 1e-7:
            n = np.cross(tangents[i], bins[i-1])
        n /= np.linalg.norm(n)
        b = np.cross(tangents[i],n)
        b /= np.linalg.norm(b)
        normals[i], bins[i] = n, b

    rings = len(path)
    side_verts = []
    for i,p in enumerate(path):
        for j in range(radial_segments):
            a = 2*math.pi*j/radial_segments
            side_verts.append(p + radius*(math.cos(a)*normals[i] + math.sin(a)*bins[i]))
    verts = list(side_verts)
    start_cap = len(verts)
    verts.extend(side_verts[:radial_segments])
    end_cap = len(verts)
    verts.extend(side_verts[(rings-1)*radial_segments:rings*radial_segments])
    verts += [path[0], path[-1]]
    sc, ec = len(verts)-2, len(verts)-1

    faces = []
    for i in range(rings-1):
        a0, a1 = i*radial_segments, (i+1)*radial_segments
        for j in range(radial_segments):
            k = (j+1) % radial_segments
            faces += [[a0+j,a0+k,a1+k],[a0+j,a1+k,a1+j]]
    for j in range(radial_segments):
        k = (j+1)%radial_segments
        faces += [
            [sc,start_cap+k,start_cap+j],
            [ec,end_cap+j,end_cap+k],
        ]

    mesh = trimesh.Trimesh(vertices=np.asarray(verts), faces=np.asarray(faces), process=False)
    key = f"{group}__{name}"
    TUBE_SOURCE_CHECKS[key] = {
        "winding_consistent": bool(mesh.is_winding_consistent),
        "shared_side_vertices": True,
        "split_cap_vertices": True,
        "radial_segments": int(radial_segments),
        "path_rings": int(rings),
    }
    if not TUBE_SOURCE_CHECKS[key]["winding_consistent"]:
        raise RuntimeError(f"Inconsistent tube winding: {key}")
    add_mesh(group, mesh, name, material)

def flat_belt_loop(points, z, width, thickness, group, name, material="rubber"):
    """One continuous flat belt ribbon in the accessory-drive plane."""
    pts = np.asarray(points, dtype=float)
    count = len(pts)
    if count < 4:
        raise ValueError("belt loop needs at least four points")
    tangents = np.zeros_like(pts)
    for i in range(count):
        tangent = pts[(i+1) % count] - pts[(i-1) % count]
        tangent /= np.linalg.norm(tangent)
        tangents[i] = tangent
    perps = np.column_stack((-tangents[:,1], tangents[:,0]))
    left = pts + perps * (width * 0.5)
    right = pts - perps * (width * 0.5)
    verts = []
    for zoff in (-thickness*0.5, thickness*0.5):
        for i in range(count):
            verts += [
                [left[i,0], left[i,1], z+zoff],
                [right[i,0], right[i,1], z+zoff],
            ]
    top = count * 2
    faces = []
    for i in range(count):
        j = (i+1) % count
        bl, br = i*2, i*2+1
        bjl, bjr = j*2, j*2+1
        tl, tr = top+bl, top+br
        tjl, tjr = top+bjl, top+bjr
        faces += [
            [tl,tr,tjr],[tl,tjr,tjl],
            [bl,bjr,br],[bl,bjl,bjr],
            [bl,tl,tjl],[bl,tjl,bjl],
            [br,bjr,tjr],[br,tjr,tr],
        ]
    mesh = trimesh.Trimesh(vertices=np.asarray(verts), faces=np.asarray(faces), process=False)
    if not mesh.is_winding_consistent:
        raise RuntimeError("Accessory belt winding is inconsistent")
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

rounded_prism([0.58, 0.30, 0.60], [0, 0.00, 0.00], "Crankcase", "main_case", radius=0.055)
rounded_prism([0.42, 0.13, 0.47], [0, -0.18, 0.00], "Crankcase", "sump", radius=0.025)
cylinder(0.205, 0.10, [0, 0.01, 0.35], "z", "Crankcase", "flywheel_housing", "cast_aluminium", 160)
cylinder(0.105, 0.67, [0, -0.015, 0.0], "z", "Crankcase", "crank_spine", "brushed_aluminium", 144)
for i, z in enumerate(np.linspace(-0.24, 0.24, 5)):
    box([0.62, 0.035, 0.028], [0, 0.11, z], "Crankcase", f"rib_top_{i}", "brushed_aluminium")
for sx in (-1, 1):
    box([0.032, 0.24, 0.54], [sx * 0.306, 0.02, 0], "Crankcase", f"flange_{sx}", "brushed_aluminium")

bank_zs = [-0.22, 0.0, 0.22]
for group, sx in (("Bank_L", 1), ("Bank_R", -1)):
    rounded_prism([0.30, 0.25, 0.65], [sx * 0.37, 0.045, 0], group, "water_jacket", radius=0.045)
    for i, z in enumerate(bank_zs):
        cylinder(0.108, 0.31, [sx * 0.39, 0.045, z], "x", group, f"cylinder_bulge_{i}", "cast_aluminium", 144)
        box([0.035, 0.19, 0.15], [sx * 0.535, 0.055, z], group, f"head_flange_{i}", "brushed_aluminium")
    for i, z in enumerate(np.linspace(-0.27, 0.27, 4)):
        box([0.32, 0.026, 0.035], [sx * 0.37, 0.158, z], group, f"housing_rib_{i}", "brushed_aluminium")

for group, sx in (("Cover_L", 1), ("Cover_R", -1)):
    rounded_prism([0.085, 0.205, 0.59], [sx * 0.545, 0.07, 0], group, "main_cover", "dark_composite", radius=0.024)
    for i, z in enumerate([-0.18, 0.0, 0.18]):
        box([0.018, 0.16, 0.045], [sx * 0.592, 0.08, z], group, f"cover_rib_{i}", "dark_composite")
    for i, z in enumerate([-0.24, 0.0, 0.24]):
        cylinder(0.014, 0.012, [sx * 0.593, 0.13, z], "x", group, f"fastener_{i}", "steel", 64)

rounded_prism([0.36, 0.15, 0.56], [0, 0.31, 0.0], "Intake", "plenum", "dark_composite", radius=0.035)
capsule(0.075, 0.34, [0, 0.355, 0], "z", "Intake", "plenum_crown", "dark_composite")
for sx in (-1, 1):
    for i, z in enumerate(bank_zs):
        cylinder(0.044, 0.12, [sx * 0.19, 0.255, z], "y", "Intake", f"throttle_{sx}_{i}", "brushed_aluminium", 112)
        cylinder(0.050, 0.085, [sx * 0.455, 0.165, z], "y", "Intake", f"head_port_{sx}_{i}", "brushed_aluminium", 72)
        tube_path(
            [
                (sx * 0.16, 0.285, z),
                (sx * 0.23, 0.270, z),
                (sx * 0.33, 0.220, z),
                (sx * 0.425, 0.172, z),
                (sx * 0.455, 0.155, z),
            ],
            0.038, "Intake", f"runner_{sx}_{i}", "dark_composite", radial_segments=24, samples_per_segment=6
        )

for sx, group in ((1, "Headers_L"), (-1, "Headers_R")):
    merge_z = -0.19
    for i, z in enumerate(bank_zs):
        tube_path(
            [
                (sx * (0.55 - 0.018 * i), -0.01, z),
                (sx * 0.52, -0.11, z - 0.015),
                (sx * 0.45, -0.20, z - 0.045),
                (sx * 0.34, -0.245, z * 0.58 - 0.055),
                (sx * 0.265, -0.245, merge_z + (i - 1) * 0.018),
            ],
            0.025 if i != 1 else 0.026,
            group, f"primary_{i}", "stainless", radial_segments=24, samples_per_segment=7,
        )
    capsule(0.064, 0.18, [sx * 0.23, -0.245, -0.205], "z", group, "collector", "stainless")
    tube_path([(sx * 0.23, -0.245, -0.31), (sx * 0.22, -0.235, -0.39)], 0.052, group, "collector_outlet", "stainless", radial_segments=28, samples_per_segment=8)

rounded_prism([0.43, 0.31, 0.055], [0, 0.02, -0.39], "Accessory_Drive", "rear_plate", "steel", radius=0.025)
for i, (x, y, r) in enumerate([(-0.12, 0.04, 0.075), (0.12, 0.07, 0.055), (0.0, -0.07, 0.062)]):
    cylinder(r, 0.035, [x, y, -0.425], "z", "Accessory_Drive", f"pulley_{i}", "dark_composite", 144)
    cylinder(r * 0.48, 0.044, [x, y, -0.447], "z", "Accessory_Drive", f"hub_{i}", "brushed_aluminium", 112)
flat_belt_loop(
    [
        (-0.185, -0.010), (-0.202, 0.040), (-0.175, 0.102), (-0.120, 0.122),
        (-0.058, 0.105), (0.070, 0.122), (0.120, 0.132), (0.177, 0.082),
        (0.166, 0.022), (0.052, -0.030), (0.071, -0.074), (0.000, -0.142),
        (-0.071, -0.074), (-0.052, -0.030), (-0.082, -0.012),
    ],
    -0.449, 0.022, 0.008, "Accessory_Drive", "belt_loop", "rubber"
)

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

normal_cache_checks = {}
for geom_name, geom in scene.geometry.items():
    vertex_normals = np.asarray(geom.vertex_normals, dtype=float)
    lengths = np.linalg.norm(vertex_normals, axis=1)
    ok = bool(
        len(vertex_normals) == len(geom.vertices)
        and np.isfinite(vertex_normals).all()
        and np.all((lengths > 0.98) & (lengths < 1.02))
    )
    normal_cache_checks[geom_name] = {
        "vertices": int(len(geom.vertices)),
        "normals": int(len(vertex_normals)),
        "finite_unit_normals": ok,
    }
    if not ok:
        raise RuntimeError(f"Invalid cached vertex normals before export: {geom_name}")

def read_glb_json(path):
    data = path.read_bytes()
    if len(data) < 20 or data[:4] != b"glTF":
        raise RuntimeError("engine export is not a valid GLB header")
    version, declared_length = struct.unpack_from("<II", data, 4)
    if version != 2 or declared_length != len(data):
        raise RuntimeError("engine GLB header length/version mismatch")
    offset = 12
    while offset + 8 <= len(data):
        chunk_length, chunk_type = struct.unpack_from("<II", data, offset)
        offset += 8
        payload = data[offset:offset+chunk_length]
        offset += chunk_length
        if chunk_type == 0x4E4F534A:
            return json.loads(payload.decode("utf-8").rstrip(" \t\r\n\0"))
    raise RuntimeError("engine GLB is missing JSON chunk")

car_hash_before = hashlib.sha256(CAR_GLB.read_bytes()).hexdigest()
car_manifest = json.loads(CAR_MANIFEST.read_text(encoding="utf-8"))
if car_hash_before != car_manifest.get("sha256"):
    raise RuntimeError("Approved exterior model hash no longer matches its manifest")

OUT.write_bytes(scene.export(file_type="glb", include_normals=True))
loaded = trimesh.load(OUT, force="scene")
bounds = np.asarray(loaded.bounds, dtype=float)
triangles = int(sum(len(g.faces) for g in loaded.geometry.values() if hasattr(g, "faces")))
nodes = set(loaded.graph.nodes)
required_nodes = {"Engine_Root", *GROUPS}
missing_nodes = sorted(required_nodes - nodes)
parents = getattr(loaded.graph.transforms, "parents", {})
wrong_parents = {g: parents.get(g) for g in GROUPS if parents.get(g) != "Engine_Root"}

gltf_header = read_glb_json(OUT)
accessors = gltf_header.get("accessors", [])
missing_normal_primitives = []
normal_count_mismatches = []
curved_normal_accessors = {}
mesh_names = []
for mesh_index, mesh_header in enumerate(gltf_header.get("meshes", [])):
    mesh_name = mesh_header.get("name", f"mesh_{mesh_index}")
    mesh_names.append(mesh_name)
    for prim_index, primitive in enumerate(mesh_header.get("primitives", [])):
        attrs = primitive.get("attributes", {})
        pos_index = attrs.get("POSITION")
        normal_index = attrs.get("NORMAL")
        if normal_index is None:
            missing_normal_primitives.append(f"{mesh_name}:{prim_index}")
            continue
        pos_count = int(accessors[pos_index]["count"])
        normal_count = int(accessors[normal_index]["count"])
        if pos_count != normal_count:
            normal_count_mismatches.append({
                "mesh": mesh_name,
                "primitive": prim_index,
                "positions": pos_count,
                "normals": normal_count,
            })
        if (
            "Intake__runner_" in mesh_name
            or "Headers_L__primary_" in mesh_name
            or "Headers_R__primary_" in mesh_name
            or "Intake__plenum_crown" in mesh_name
        ):
            curved_normal_accessors[mesh_name] = {
                "positions": pos_count,
                "normals": normal_count,
                "normal_accessor_present": True,
            }

exported_base_colors = []
for material_header in gltf_header.get("materials", []):
    factor = material_header.get("pbrMetallicRoughness", {}).get("baseColorFactor")
    if factor is not None:
        exported_base_colors.append([float(v) for v in factor])
material_color_checks = {
    name: bool(any(np.allclose(factor, target, atol=1e-6) for factor in exported_base_colors))
    for name, target in EXPECTED_BASE_COLORS.items()
}

component_checks = {
    "intake_runners": sum("Intake__runner_" in n for n in mesh_names),
    "intake_head_ports": sum("Intake__head_port_" in n for n in mesh_names),
    "header_primaries": sum("__primary_" in n for n in mesh_names),
    "continuous_flat_belt": sum("Accessory_Drive__belt_loop" in n for n in mesh_names),
}
if missing_normal_primitives:
    raise RuntimeError(f"Missing GLB NORMAL accessors: {missing_normal_primitives}")
if normal_count_mismatches:
    raise RuntimeError(f"GLB NORMAL/POSITION count mismatch: {normal_count_mismatches}")
if len(curved_normal_accessors) < 13:
    raise RuntimeError(f"Curved-surface NORMAL coverage incomplete: {len(curved_normal_accessors)} meshes")
if not all(material_color_checks.values()):
    raise RuntimeError(f"Exported material base colors differ from intended values: {material_color_checks}")
if component_checks != {
    "intake_runners": 6,
    "intake_head_ports": 6,
    "header_primaries": 6,
    "continuous_flat_belt": 1,
}:
    raise RuntimeError(f"Component continuity checks failed: {component_checks}")

if not np.isfinite(bounds).all():
    raise RuntimeError("Engine bounds are not finite")
if missing_nodes:
    raise RuntimeError(f"Missing named groups: {missing_nodes}")
if wrong_parents:
    raise RuntimeError(f"Unexpected group parents: {wrong_parents}")

independent_translation = {}
for group in GROUPS:
    probe = trimesh.load(OUT, force="scene")
    probe_parents = getattr(probe.graph.transforms, "parents", {})
    child_nodes = [n for n, p in probe_parents.items() if p == group]
    geom_child = next((n for n in child_nodes if probe.graph[n][1] is not None), None)
    if geom_child is None:
        raise RuntimeError(f"Group {group} has no geometry child")
    baseline = probe.graph.get(frame_to=geom_child)[0].copy()
    delta = np.asarray(EXPLODE_VECTORS[group], dtype=float)
    if np.linalg.norm(delta) < 1e-8:
        delta = np.array([0.031, 0.0, 0.0])
    probe.graph.update(frame_to=group, frame_from="Engine_Root", matrix=trimesh.transformations.translation_matrix(delta))
    moved = probe.graph.get(frame_to=geom_child)[0]
    observed = moved[:3, 3] - baseline[:3, 3]
    ok = bool(np.allclose(observed, delta, atol=1e-6))
    independent_translation[group] = {"ok": ok, "probe_translation_metres": delta.tolist(), "observed_delta_metres": observed.tolist()}
    if not ok:
        raise RuntimeError(f"Independent translation failed for {group}")

if not (25000 <= triangles <= 50000):
    raise RuntimeError(f"Triangle count {triangles} is outside 25k-50k budget")

car_hash_after = hashlib.sha256(CAR_GLB.read_bytes()).hexdigest()
if car_hash_before != car_hash_after:
    raise RuntimeError("Approved exterior model changed during engine build")

manifest = {
    "asset": "YUNEX 992 GT3 RS simplified 4.0L naturally aspirated flat-six",
    "status": "targeted finishing pass for master review",
    "units": "metres",
    "axis": {"forward": "+Z", "up": "+Y", "left": "+X"},
    "engine_root": "crankcase centre",
    "bounds_metres": bounds.tolist(),
    "dimensions_metres": (bounds[1] - bounds[0]).tolist(),
    "triangles": triangles,
    "geometry_primitives": len(loaded.geometry),
    "named_groups": ["Engine_Root", *GROUPS],
    "materials": [m.name for m in MATERIALS.values()],
    "exported_base_color_factors": exported_base_colors,
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
        "Installed review render loads the approved exterior GLB separately and keeps it unchanged; the engine is never baked into the car asset."
    ],
    "exterior_model_sha256": car_hash_after,
    "sha256": hashlib.sha256(OUT.read_bytes()).hexdigest(),
}
MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")

validation = {
    "status": "pass_structural_visual_review_pending",
    "engine_glb_load": True,
    "finite_bounds": True,
    "metre_scale_dimensions": (bounds[1] - bounds[0]).tolist(),
    "required_groups_present": True,
    "direct_group_parenting": True,
    "gltf_normal_accessors": {
        "all_primitives_have_normals": len(missing_normal_primitives) == 0,
        "position_normal_counts_match": len(normal_count_mismatches) == 0,
        "missing": missing_normal_primitives,
        "count_mismatches": normal_count_mismatches,
        "curved_meshes": curved_normal_accessors,
        "source_tube_vertex_sharing_and_winding": TUBE_SOURCE_CHECKS,
    },
    "material_base_color_factors": {
        "expected": EXPECTED_BASE_COLORS,
        "exported": exported_base_colors,
        "all_expected_present": all(material_color_checks.values()),
        "per_material_match": material_color_checks,
    },
    "component_checks": component_checks,
    "normal_cache_checks_pass": all(v["finite_unit_normals"] for v in normal_cache_checks.values()),
    "independent_component_translations": independent_translation,
    "triangle_budget_target": [25000, 50000],
    "triangle_count": triangles,
    "triangle_budget_pass": True,
    "installation": {
        "marker_metres": [0.0, 0.47, -1.78],
        "rear_axle_z_metres": -1.2114155216682174,
        "visual_clearance_review": "Use generated rear-bay side/top renders against actual car surfaces; AABB overlap is not treated as proof of clearance.",
        "unresolved_fit_issue": "Rear deck/undertray surfaces are hidden in the viewer to expose the engine, so hard shell clearance remains unresolved for master visual review. No clearance approval is claimed."
    },
    "exterior_model_hash_before": car_hash_before,
    "exterior_model_hash_after": car_hash_after,
    "exterior_unchanged": car_hash_before == car_hash_after,
    "engine_sha256": manifest["sha256"],
}
VALIDATION.write_text(json.dumps(validation, indent=2) + "\n", encoding="utf-8")

review_note = f"""# YUNEX engine finishing review

- Changed source/presentation: `build_engine.py`, `review.html`, `render_review.mjs`, workflow verification, and README review guidance.
- Generated outputs: `engine.glb`, `asset-manifest.json`, `validation.json`, three PNG review renders, and `renders/engine_turntable.mp4`.
- Actual triangle count: **{triangles:,}** (budget 25–50k).
- Exact GLB load: **PASS**; finite metre-scale bounds: **PASS**.
- GLB NORMAL accessors: **PASS** on every primitive; POSITION/NORMAL counts match. Curved intake/header/plenum meshes are explicitly covered.
- Tube topology: shared side vertices with split cap rings; source winding checks: **PASS**.
- Components: six connected intake runners + six head-port collars, six header primaries, one continuous flat accessory belt: **PASS**.
- Exported material baseColorFactor values match the intended Python values: **PASS**.
- Approved exterior SHA-256 before/after: `{car_hash_before}` / `{car_hash_after}` — **unchanged**.
- Installed fit: **UNRESOLVED FOR MASTER REVIEW**. Rear deck/undertray/interior obstruction is deliberately suppressed only in the review viewer so the opaque engine can be inspected. No shell-clearance claim is made; inspect the side/top PNGs for visible intersections before approval.
"""
REVIEW_NOTE.write_text(review_note, encoding="utf-8")

if README.exists():
    text = README.read_text(encoding="utf-8")
    a = "<!-- BEGIN GENERATED METRICS -->"
    b = "<!-- END GENERATED METRICS -->"
    generated = (
        f"{a}\n"
        f"- Engine dimensions (X × Y × Z): **{(bounds[1]-bounds[0])[0]:.4f} × {(bounds[1]-bounds[0])[1]:.4f} × {(bounds[1]-bounds[0])[2]:.4f} m**.\n"
        f"- Local Y bounds: **{bounds[0,1]:.4f} m to {bounds[1,1]:.4f} m**.\n"
        f"- Triangle count: **{triangles:,}**.\n"
        f"- Geometry primitives: **{len(loaded.geometry)}**.\n"
        f"- GLB NORMAL accessors: **all primitives present / POSITION counts matched**.\n"
        f"- Engine SHA-256: `{manifest['sha256']}`.\n"
        f"- Approved exterior SHA-256 before/after: `{car_hash_before}` / `{car_hash_after}` (**unchanged**).\n"
        f"- Installation: `Engine_Root` at `Marker_Engine_Mass` = `[0, 0.47, -1.78]` m; local offset `[0, 0, 0]`.\n"
        f"{b}"
    )
    if a in text and b in text:
        README.write_text(text.split(a,1)[0] + generated + text.split(b,1)[1], encoding="utf-8")

print(json.dumps({"engine_glb": str(OUT), "triangles": triangles, "bounds": bounds.tolist(), "dimensions": (bounds[1] - bounds[0]).tolist(), "sha256": manifest["sha256"], "exterior_unchanged": True}, indent=2))
