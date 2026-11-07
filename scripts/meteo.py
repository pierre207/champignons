"""Récupère pluie et température (14 jours passés + 3 jours de prévision) sur une grille.

Sortie : public/data/meteo-<zone>.json
Usage : python scripts/meteo.py --zone alsace
"""
import argparse, json, os, time, urllib.parse, urllib.request
from datetime import datetime, timezone

ZONES = {
    # lon min, lat min, lon max, lat max, pas en degrés
    "alsace": (6.80, 47.40, 8.30, 49.10, 0.1),
}
API = "https://api.open-meteo.com/v1/forecast"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--zone", default="alsace")
    ap.add_argument("--out", default="public/data")
    a = ap.parse_args()
    x0, y0, x1, y1, step = ZONES[a.zone]
    nx, ny = round((x1 - x0) / step) + 1, round((y1 - y0) / step) + 1
    pts = [(round(y0 + j * step, 3), round(x0 + i * step, 3)) for j in range(ny) for i in range(nx)]
    rain, tmean, dates = [], [], None
    for k in range(0, len(pts), 100):
        lot = pts[k:k + 100]
        q = urllib.parse.urlencode({
            "latitude": ",".join(str(p[0]) for p in lot),
            "longitude": ",".join(str(p[1]) for p in lot),
            "daily": "precipitation_sum,temperature_2m_mean",
            "past_days": 14, "forecast_days": 3, "timezone": "Europe/Paris",
        })
        req = urllib.request.Request(f"{API}?{q}", headers={"User-Agent": "champignons-carte/1.0"})
        for essai in range(3):
            try:
                with urllib.request.urlopen(req, timeout=120) as r:
                    res = json.load(r)
                break
            except Exception as e:  # noqa: BLE001
                print(f"[essai {essai + 1}] {e}")
                time.sleep(20)
        else:
            raise SystemExit("Open-Meteo injoignable")
        res = res if isinstance(res, list) else [res]
        for r in res:
            d = r["daily"]
            dates = dates or d["time"]
            rain.append([round(v or 0, 1) for v in d["precipitation_sum"]])
            tmean.append([None if v is None else round(v, 1) for v in d["temperature_2m_mean"]])
        time.sleep(2)
    os.makedirs(a.out, exist_ok=True)
    out = {
        "zone": a.zone, "lon0": x0, "lat0": y0, "step": step, "nx": nx, "ny": ny,
        "dates": dates, "today": 14, "rain": rain, "tmean": tmean,
        "updated": datetime.now(timezone.utc).isoformat(timespec="minutes"),
        "source": "Open-Meteo (modèles Météo-France), CC BY 4.0",
    }
    json.dump(out, open(f"{a.out}/meteo-{a.zone}.json", "w"), separators=(",", ":"))
    print(f"{len(rain)} points, {len(dates)} jours ({dates[0]} → {dates[-1]})")


if __name__ == "__main__":
    main()
