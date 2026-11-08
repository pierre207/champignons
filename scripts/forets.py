"""Télécharge la BD Forêt V2 (IGN) pour des départements et produit une carte des essences.

Sortie, une image par département :
  public/data/forets/d<dep>.png   image 8 bits, une classe d'essence par pixel (0 = pas de forêt)
  public/data/forets/d<dep>.json  emprise (Web Mercator et WGS84), taille, légende des classes
  public/data/forets/index.json   tous les départements disponibles (lu par la carte)

Usage : python scripts/forets.py --deps 67 68
"""
import argparse, json, os, re, subprocess, sys, tempfile, unicodedata, urllib.request
from pathlib import Path

sys.path.insert(0, os.path.dirname(__file__))
from regions import METEO, NOMS  # noqa: E402

import geopandas as gpd
import numpy as np
from PIL import Image
from rasterio import features
from rasterio.transform import from_origin

RES = 100  # taille de pixel en mètres Web Mercator (≈ 67 m au sol à 48° N)
CLASSES = ["aucune", "chenes", "hetre", "chataignier", "feuillus", "peuplier-robinier",
           "pins", "sapin-epicea", "autres-coniferes", "mixte"]

LISTINGS = [
    "https://data.geopf.fr/telechargement/resource/BDFORET",
    "https://files.opendatarchives.fr/professionnels.ign.fr/bdforet/BDFORET_V2/",
]


def get(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "champignons-carte/1.0"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.read()


def trouver_archive(dep: str) -> str:
    """Retourne l'URL de l'archive .7z SHP Lambert 93 du département."""
    code = dep.upper().zfill(3)  # 067, 02A
    motif = re.compile(rf"BDFORET_2-0__SHP_LAMB93_D0?{code}_[0-9-]+")
    for liste in LISTINGS:
        try:
            # Le flux Atom de la Géoplateforme est paginé : on filtre par département
            url = f"{liste}?zone=D{code}&format=SHP" if "geopf" in liste else liste
            txt = get(url).decode("utf-8", "replace")
        except Exception as e:  # noqa: BLE001
            print(f"[liste] {liste} : {e}")
            continue
        noms = sorted(set(motif.findall(txt)))
        print(f"[liste] {liste} : {noms}")
        if not noms:
            continue
        nom = noms[-1]
        if "geopf" in liste:
            # Une sous-ressource liste ses fichiers ; on essaie le lien direct puis la page.
            cands = [f"https://data.geopf.fr/telechargement/download/BDFORET/{nom}/{nom}.7z"]
            try:
                sous = get(f"{liste}/{nom}").decode("utf-8", "replace")
                cands = re.findall(r"https://data\.geopf\.fr/telechargement/download/[^\"'<> ]+\.7z", sous) + cands
            except Exception as e:  # noqa: BLE001
                print(f"[sous-ressource] {e}")
        else:
            cands = [liste + nom + ".7z"]
        for u in cands:
            try:
                req = urllib.request.Request(u, method="HEAD", headers={"User-Agent": "champignons-carte/1.0"})
                urllib.request.urlopen(req, timeout=60)
                return u
            except Exception as e:  # noqa: BLE001
                print(f"[test] {u} : {e}")
    sys.exit(f"Archive introuvable pour le département {dep}")


def norm(s) -> str:
    s = unicodedata.normalize("NFD", str(s or "")).encode("ascii", "ignore").decode().lower()
    return s


def classe(essence: str, tfv: str) -> int:
    e, t = norm(essence), norm(tfv)
    if t and not ("foret" in t or "peupleraie" in t):
        return 0  # landes, formations herbacées
    if "peupl" in e or "peupl" in t or "robinier" in e:
        return 5
    if "chataign" in e:
        return 3
    if "hetre" in e:
        return 2
    if "chene" in e:
        return 1
    if "mixte" in e or "melange de feuillus et" in e:
        return 9
    if "sapin" in e or "epicea" in e:
        return 7
    if "pin" in e:
        return 6
    if "douglas" in e or "meleze" in e or "conif" in e:
        return 8
    if "feuillu" in e or "feuillus" in t:
        return 4
    if "conif" in t:
        return 8
    if "mixte" in t:
        return 9
    return 4 if t else 0


def lire_departement(dep: str, tmp: Path) -> gpd.GeoDataFrame:
    url = trouver_archive(dep)
    print(f"[téléchargement] {url}")
    arc = tmp / f"d{dep}.7z"
    subprocess.run(["curl", "-sSfL", "--retry", "3", "-o", str(arc), url], check=True)
    out = tmp / f"d{dep}"
    subprocess.run(["7z", "x", "-y", f"-o{out}", str(arc)], check=True, stdout=subprocess.DEVNULL)
    shp = sorted(out.rglob("*FORMATION_VEGETALE*.shp")) or sorted(out.rglob("*.shp"))
    print(f"[shp] {shp}")
    gdf = gpd.read_file(shp[0])
    print(f"[colonnes] {list(gdf.columns)} ; {len(gdf)} polygones ; CRS {gdf.crs}")
    cols = {c.upper(): c for c in gdf.columns}
    ess = cols.get("ESSENCE")
    tfv = cols.get("TFV")
    print("[valeurs ESSENCE]", gdf[ess].value_counts().head(30).to_dict() if ess else "absente")
    print("[valeurs TFV]", gdf[tfv].value_counts().head(30).to_dict() if tfv else "absente")
    gdf["classe"] = [classe(a, b) for a, b in zip(gdf[ess] if ess else [""] * len(gdf), gdf[tfv] if tfv else [""] * len(gdf))]
    gdf = gdf[gdf["classe"] > 0]
    if gdf.crs is None:
        gdf = gdf.set_crs(2154)
    return gdf[["classe", "geometry"]].to_crs(3857)


def raster(dep: str, gdf, out: str):
    minx, miny, maxx, maxy = gdf.total_bounds
    minx, miny = np.floor(minx / RES) * RES, np.floor(miny / RES) * RES
    maxx, maxy = np.ceil(maxx / RES) * RES, np.ceil(maxy / RES) * RES
    w, h = int((maxx - minx) / RES), int((maxy - miny) / RES)
    print(f"[raster {dep}] {w} x {h} px")
    gdf = gdf.sort_values("classe")
    img = features.rasterize(((g, c) for g, c in zip(gdf.geometry, gdf["classe"])),
                             out_shape=(h, w), transform=from_origin(minx, maxy, RES, RES),
                             fill=0, dtype="uint8")
    Image.fromarray(img, mode="L").save(f"{out}/d{dep}.png", optimize=True)
    lonlat = gpd.GeoSeries(gpd.points_from_xy([minx, maxx], [miny, maxy]), crs=3857).to_crs(4326)
    meta = {
        "dep": dep, "region": METEO[dep], "res": RES, "width": w, "height": h,
        "merc": [minx, miny, maxx, maxy],
        "lonlat": [round(lonlat.x[0], 5), round(lonlat.y[0], 5), round(lonlat.x[1], 5), round(lonlat.y[1], 5)],
        "pixels": {CLASSES[i]: int((img == i).sum()) for i in range(len(CLASSES))},
    }
    json.dump(meta, open(f"{out}/d{dep}.json", "w"), ensure_ascii=False)


def index(out: str):
    """Rassemble les métadonnées de tous les départements générés."""
    deps = {}
    for f in sorted(Path(out).glob("d*.json")):
        m = json.load(open(f))
        deps[m["dep"]] = {k: m[k] for k in ("region", "res", "width", "height", "merc", "lonlat")}
    regions = {r: NOMS[r] for r in sorted({d["region"] for d in deps.values()})}
    json.dump({"classes": CLASSES, "regions": regions, "depts": deps,
               "source": "BD Forêt V2, IGN (Licence ouverte Etalab 2.0)"},
              open(f"{out}/index.json", "w"), ensure_ascii=False, separators=(",", ":"))
    print(f"[index] {len(deps)} départements")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--deps", nargs="+", required=True)
    ap.add_argument("--out", default="public/data/forets")
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    for dep in a.deps:
        dep = dep.upper()
        with tempfile.TemporaryDirectory() as t:
            gdf = lire_departement(dep, Path(t))
            raster(dep, gdf, a.out)
    index(a.out)


if __name__ == "__main__":
    main()
