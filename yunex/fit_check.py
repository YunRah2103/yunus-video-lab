#!/usr/bin/env python3
import json, math
from pathlib import Path
import numpy as np
import trimesh

ROOT = Path(__file__).resolve().parent
CAR = ROOT.parent / "cars" / "porsche-911-gt3-rs-992" / "model.glb"
ENGINE = ROOT.parent / "cars" / "porsche-911-gt3-rs-992" / "engine" / "engine.glb"
OUT = ROOT / "out" / "fit-report.json"
MARKER = np.array([0.0, 0.47, -1.78], dtype=float)

def transformed_meshes(scene, selector=None):
    out = []
    for node_name in scene.graph.nodes_geometry:
        transform, geom_name = scene.graph[node_name]
        if selector and not selector(str(node_name), str(geom_name)):
            continue
        geom = scene.geometry[geom_name].copy()
        geom.apply_transform(transform)
        out.append(geom)
    return out

def concat(meshes):
    if not meshes:
        raise RuntimeError("No meshes selected")
    return trimesh.util.concatenate(meshes)

car_scene = trimesh.load(CAR, force="scene", process=False)
engine_scene = trimesh.load(ENGINE, force="scene", process=False)

body_candidates = transformed_meshes(
    car_scene,
    lambda node, geom: ("body" in node.lower()) or ("body" in geom.lower())
)
if not body_candidates:
    body_candidates = transformed_meshes(car_scene)
body = concat(body_candidates)

engine = concat(transformed_meshes(engine_scene))
engine.apply_translation(MARKER)

engine_bounds = np.asarray(engine.bounds, dtype=float)
body_bounds = np.asarray(body.bounds, dtype=float)

# Rear-body vertices inside the engine's X/Z footprint give a conservative envelope check.
v = np.asarray(body.vertices)
mask = (
    (v[:,0] >= engine_bounds[0,0]) & (v[:,0] <= engine_bounds[1,0]) &
    (v[:,2] >= engine_bounds[0,2]) & (v[:,2] <= engine_bounds[1,2])
)
rear_surface = v[mask]
rear_y = rear_surface[:,1] if len(rear_surface) else np.array([])

# Surface proximity: sample engine vertices and query the body mesh.
sample_idx = np.linspace(0, len(engine.vertices)-1, min(1800, len(engine.vertices))).astype(int)
sample = np.asarray(engine.vertices)[sample_idx]
proximity = {}
try:
    closest, distances, tri = trimesh.proximity.closest_point(body, sample)
    proximity = {
        "minimum_distance_metres": float(np.min(distances)),
        "p05_distance_metres": float(np.percentile(distances, 5)),
        "median_distance_metres": float(np.median(distances)),
        "samples_under_5mm": int(np.sum(distances < 0.005)),
        "samples_under_15mm": int(np.sum(distances < 0.015)),
    }
except Exception as exc:
    proximity = {"error": str(exc)}

body_watertight = bool(body.is_watertight)
signed = None
if body_watertight:
    try:
        sd = trimesh.proximity.signed_distance(body, sample)
        signed = {
            "negative_samples": int(np.sum(sd < -0.002)),
            "positive_samples": int(np.sum(sd > 0.002)),
            "near_surface_samples": int(np.sum(np.abs(sd) <= 0.002)),
        }
    except Exception as exc:
        signed = {"error": str(exc)}

report = {
    "engine_marker_translation_metres": MARKER.tolist(),
    "engine_bounds_installed_metres": engine_bounds.tolist(),
    "body_bounds_metres": body_bounds.tolist(),
    "body_watertight": body_watertight,
    "rear_body_vertices_in_engine_xz_footprint": int(len(rear_surface)),
    "rear_body_y_range_in_engine_footprint_metres": (
        [float(np.min(rear_y)), float(np.max(rear_y))] if len(rear_y) else None
    ),
    "engine_top_y_metres": float(engine_bounds[1,1]),
    "engine_bottom_y_metres": float(engine_bounds[0,1]),
    "surface_proximity": proximity,
    "signed_distance_if_reliable": signed,
    "decision": {
        "installation_adjustment_metres": [0.0, 0.0, 0.0],
        "reason": "No blind scaling or transform change. The approved body is an open render mesh, so envelope/proximity results are used as a clearance warning rather than claiming CAD-valid non-intersection. The proof ghosts/clips the rear body for explanatory visibility while keeping the engine at Marker_Engine_Mass."
    }
}
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(report, indent=2))
print(json.dumps(report, indent=2))
