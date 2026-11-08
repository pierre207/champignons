"""Régions de France métropolitaine et Corse, dans l'ordre de génération (les plus forestières d'abord).

Usage :
  python scripts/regions.py --ordre            liste des identifiants de régions
  python scripts/regions.py --manquants NA     départements de la région sans données forêts
"""
import argparse, os

# id : (nom, départements)
REGIONS = {
    "grand-est-alsace": ("Alsace", ["67", "68"]),  # déjà en ligne : régénérée en premier pour le nouveau format
    "nouvelle-aquitaine": ("Nouvelle-Aquitaine", ["16", "17", "19", "23", "24", "33", "40", "47", "64", "79", "86", "87"]),
    "occitanie": ("Occitanie", ["09", "11", "12", "30", "31", "32", "34", "46", "48", "65", "66", "81", "82"]),
    "auvergne-rhone-alpes": ("Auvergne-Rhône-Alpes", ["01", "03", "07", "15", "26", "38", "42", "43", "63", "69", "73", "74"]),
    "grand-est": ("Grand Est", ["08", "10", "51", "52", "54", "55", "57", "88"]),
    "bourgogne-franche-comte": ("Bourgogne-Franche-Comté", ["21", "25", "39", "58", "70", "71", "89", "90"]),
    "provence-alpes-cote-d-azur": ("Provence-Alpes-Côte d'Azur", ["04", "05", "06", "13", "83", "84"]),
    "centre-val-de-loire": ("Centre-Val de Loire", ["18", "28", "36", "37", "41", "45"]),
    "corse": ("Corse", ["2A", "2B"]),
    "pays-de-la-loire": ("Pays de la Loire", ["44", "49", "53", "72", "85"]),
    "normandie": ("Normandie", ["14", "27", "50", "61", "76"]),
    "hauts-de-france": ("Hauts-de-France", ["02", "59", "60", "62", "80"]),
    "bretagne": ("Bretagne", ["22", "29", "35", "56"]),
    "ile-de-france": ("Île-de-France", ["75", "77", "78", "91", "92", "93", "94", "95"]),
}

# Région météo de chaque département (l'Alsace fait partie du Grand Est)
METEO = {d: ("grand-est" if r == "grand-est-alsace" else r) for r, (_, ds) in REGIONS.items() for d in ds}
NOMS = {"grand-est": "Grand Est", **{r: n for r, (n, _) in REGIONS.items() if r != "grand-est-alsace"}}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ordre", action="store_true")
    ap.add_argument("--manquants")
    ap.add_argument("--data", default="public/data/forets")
    a = ap.parse_args()
    if a.ordre:
        print(" ".join(REGIONS))
    elif a.manquants:
        print(" ".join(d for d in REGIONS[a.manquants][1] if not os.path.exists(f"{a.data}/d{d}.png")))


if __name__ == "__main__":
    main()
