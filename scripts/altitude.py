"""Altitude par département, sur la même grille que le raster des forêts (100 m Web Mercator).

Source : Copernicus DEM GLO-90 (90 m), données ouvertes, tuiles COG de 1° sur AWS.
Sortie : public/data/altitude/d<dep>.png   image 8 bits, altitude / 20 m (0 = inconnue ou niveau de la mer)
Usage : python scripts/altitude.py            départements qui n'ont pas encore d'altitude
        python scripts/altitude.py --deps 67
"""
import argparse, json, math, os

import numpy as np
import rasterio
from PIL import Image
from rasterio.transform import from_origin
from rasterio.warp import Resampling, reproject

BASE = "https://copernicus-dem-90m.s3.amazonaws.com"
PAS = 20  # mètres par niveau de gris


def tuile(lat, lon):
    ns, ew = ("N" if lat >= 0 else "S"), ("E" if lon >= 0 else "W")
    nom = f"Copernicus_DSM_COG_30_{ns}{abs(lat):02d}_00_{ew}{abs(lon):03d}_00_DEM"
    return f"/vsicurl/{BASE}/{nom}/{nom}.tif"


def departement(dep, m, out):
    w, h, res = m["width"], m["height"], m["res"]
    dst = np.full((h, w), np.nan, np.float32)
    x0, y0, x1, y1 = m["lonlat"]
    n = 0
    for lat in range(math.floor(y0), math.floor(y1) + 1):
        for lon in range(math.floor(x0), math.floor(x1) + 1):
            try:
                with rasterio.open(tuile(lat, lon)) as src:
                    part = np.full((h, w), np.nan, np.float32)
                    reproject(rasterio.band(src, 1), part, dst_transform=from_origin(m["merc"][0], m["merc"][3], res, res),
                              dst_crs="EPSG:3857", dst_nodata=np.nan, resampling=Resampling.average)
                    dst = np.where(np.isnan(dst), part, dst)
                    n += 1
            except rasterio.errors.RasterioIOError:
                pass  # tuile absente (mer)
    img = np.nan_to_num(np.clip(np.round(dst / PAS), 0, 255), nan=0).astype(np.uint8)
    Image.fromarray(img, mode="L").save(f"{out}/d{dep}.png", optimize=True)
    print(f"[{dep}] {n} tuiles, altitude max {int(np.nanmax(dst)) if n else 0} m")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--deps", nargs="*")
    ap.add_argument("--forets", default="public/data/forets")
    ap.add_argument("--out", default="public/data/altitude")
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    idx = json.load(open(f"{a.forets}/index.json"))["depts"]
    deps = a.deps or [d for d in idx if not os.path.exists(f"{a.out}/d{d}.png")]
    for d in deps:
        departement(d, idx[d], a.out)


if __name__ == "__main__":
    os.environ.setdefault("GDAL_DISABLE_READDIR_ON_OPEN", "EMPTY_DIR")
    os.environ.setdefault("CPL_VSIL_CURL_ALLOWED_EXTENSIONS", ".tif")
    main()
