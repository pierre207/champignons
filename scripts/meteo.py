"""Récupère, par région et sur une grille de 0,1° : pluie, humidité et température du sol
(7 jours passés + 5 jours de prévision, aujourd'hui compris).

L'humidité et la température du sol ne sont fournies qu'heure par heure : on en fait la moyenne de chaque jour.
Les appels sont étalés pour respecter les limites gratuites d'Open-Meteo (600 par minute, 5 000 par heure).

Seuls les points proches d'une forêt sont demandés (les autres valent null), pour rester
sous la limite gratuite d'Open-Meteo.

Sortie : public/data/meteo/<region>.json
Usage : python scripts/meteo.py                 toutes les régions qui ont des données forêts
        python scripts/meteo.py --regions corse
"""
import argparse, json, math, os, time, urllib.parse, urllib.request
from datetime import datetime, timezone

import numpy as np
from PIL import Image

API = "https://api.open-meteo.com/v1/forecast"
STEP = 0.1
MARGE = 1  # points de grille conservés autour d'une forêt (interpolation bilinéaire)
R = 6378137


def merc_lon(x): return x / R * 180 / math.pi
def merc_lat(y): return math.degrees(math.atan(math.sinh(y / R)))


def presence(f, d, m):
    """Cellules de 0,1° contenant de la forêt pour un département."""
    img = np.array(Image.open(f"{f}/d{d}.png"))
    ys, xs = np.nonzero(img[::5, ::5])  # un pixel sur 5 (500 m) suffit
    res = m["res"] * 5
    lon = np.degrees((m["merc"][0] + (xs + 0.5) * res) / R)
    lat = np.degrees(np.arctan(np.sinh((m["merc"][3] - (ys + 0.5) * res) / R)))
    return set(zip(np.round(lon / STEP).astype(int).tolist(), np.round(lat / STEP).astype(int).tolist()))


SOL_H = "soil_moisture_3_to_9cm"  # m³/m³, couche où vit le mycélium
SOL_T = "soil_temperature_6cm"  # °C
LOT = 50  # points par requête
PAR_MINUTE, PAR_HEURE = 500, 4600  # sous les limites gratuites (600 et 5 000)
_journal = []  # (instant, nombre de points) des requêtes envoyées


def attendre(n):
    """Attend que la requête suivante reste sous les limites par minute et par heure."""
    while True:
        t = time.time()
        _journal[:] = [(u, k) for u, k in _journal if t - u < 3600]
        minute = sum(k for u, k in _journal if t - u < 60)
        heure = sum(k for _, k in _journal)
        if minute + n <= PAR_MINUTE and heure + n <= PAR_HEURE:
            _journal.append((t, n))
            return
        time.sleep(5)


def moyennes(h, cle, dates):
    """Moyenne journalière d'une variable horaire."""
    par = {d: [] for d in dates}
    for t, v in zip(h["time"], h[cle]):
        if v is not None and t[:10] in par:
            par[t[:10]].append(v)
    return [round(sum(x) / len(x), 3) if x else None for x in (par[d] for d in dates)]


def appel(lot):
    q = urllib.parse.urlencode({
        "latitude": ",".join(str(p[1]) for p in lot),
        "longitude": ",".join(str(p[0]) for p in lot),
        "daily": "precipitation_sum",
        "hourly": f"{SOL_H},{SOL_T}",
        "past_days": 7, "forecast_days": 5, "timezone": "Europe/Paris",
    })
    req = urllib.request.Request(f"{API}?{q}", headers={"User-Agent": "champignons-carte/1.0"})
    for essai in range(6):
        attendre(len(lot))
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                res = json.load(r)
            return res if isinstance(res, list) else [res]
        except Exception as e:  # noqa: BLE001
            print(f"[essai {essai + 1}] {e}")
            time.sleep(60 * (essai + 1))
    raise SystemExit("Open-Meteo injoignable")


def region(nom, deps, f, out):
    cells = set()
    for d, m in deps.items():
        cells |= presence(f, d, m)
    if not cells:
        return 0
    i0, i1 = min(c[0] for c in cells) - MARGE, max(c[0] for c in cells) + MARGE
    j0, j1 = min(c[1] for c in cells) - MARGE, max(c[1] for c in cells) + MARGE
    nx, ny = i1 - i0 + 1, j1 - j0 + 1
    garde = np.zeros((ny, nx), bool)
    for i, j in cells:
        garde[max(0, j - j0 - MARGE):j - j0 + MARGE + 1, max(0, i - i0 - MARGE):i - i0 + MARGE + 1] = True
    pts = [(round((i0 + i) * STEP, 2), round((j0 + j) * STEP, 2)) for j in range(ny) for i in range(nx) if garde[j, i]]
    rain, sh, st, dates = {}, {}, {}, None
    for k in range(0, len(pts), LOT):
        lot = pts[k:k + LOT]
        for p, r in zip(lot, appel(lot)):
            dd = r["daily"]
            dates = dates or dd["time"]
            rain[p] = [round(v or 0, 1) for v in dd["precipitation_sum"]]
            sh[p] = moyennes(r["hourly"], SOL_H, dates)
            st[p] = [None if v is None else round(v, 1) for v in moyennes(r["hourly"], SOL_T, dates)]
    grille = [(round((i0 + i) * STEP, 2), round((j0 + j) * STEP, 2)) for j in range(ny) for i in range(nx)]
    data = {
        "region": nom, "lon0": round(i0 * STEP, 2), "lat0": round(j0 * STEP, 2), "step": STEP, "nx": nx, "ny": ny,
        "dates": dates, "today": 7, "rain": [rain.get(p) for p in grille],
        "solH": [sh.get(p) for p in grille], "solT": [st.get(p) for p in grille],
        "updated": datetime.now(timezone.utc).isoformat(timespec="minutes"),
        "source": "Open-Meteo (modèles Météo-France), CC BY 4.0",
    }
    json.dump(data, open(f"{out}/{nom}.json", "w"), separators=(",", ":"))
    print(f"[{nom}] {len(pts)} points demandés sur {nx * ny}")
    return len(pts)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--regions", nargs="*")
    ap.add_argument("--forets", default="public/data/forets")
    ap.add_argument("--out", default="public/data/meteo")
    a = ap.parse_args()
    if not os.path.exists(f"{a.forets}/index.json"):
        print("Pas encore de données forêts")
        return
    idx = json.load(open(f"{a.forets}/index.json"))
    os.makedirs(a.out, exist_ok=True)
    total = 0
    for r in a.regions or idx["regions"]:
        deps = {d: m for d, m in idx["depts"].items() if m["region"] == r}
        total += region(r, deps, a.forets, a.out)
    print(f"Total : {total} points")


if __name__ == "__main__":
    main()
