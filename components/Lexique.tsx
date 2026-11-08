import { Fragment, type ReactNode } from "react";

// Vocabulaire de base. Définitions à valider par le mycologue.
export const MOTS: { mot: string; def: string }[] = [
  { mot: "Chapeau", def: "Le dessus. On regarde sa couleur, sa forme et son toucher (lisse, velouté, visqueux)." },
  { mot: "Marge", def: "Le bord du chapeau : droit, enroulé vers l'intérieur, strié…" },
  { mot: "Pied", def: "La tige. Plein ou creux, fin ou ventru, lisse ou avec un réseau de fines lignes." },
  { mot: "Anneau", def: "Une jupette autour du pied, reste d'un voile qui protégeait les lames." },
  { mot: "Volve", def: "Un sac à la base du pied, souvent caché dans la terre. Signe des amanites : toujours déterrer le pied." },
  { mot: "Chair", def: "L'intérieur, visible à la coupe : couleur, fermeté, change-t-elle de couleur ?" },
  { mot: "Décurrent", def: "Se dit des lames ou des plis qui descendent sur le pied." },
];

const C = { txt: "var(--text)" };

function Schema() {
  return (
    <svg viewBox="0 0 340 270" role="img" aria-label="Schéma d'un champignon : chapeau, marge, dessous, anneau, pied et volve">
      <path d="M70 112 C 78 48, 150 30, 170 30 C 190 30, 262 48, 270 112 Z" fill="#b8742f" />
      <g fill="#e9dcc3" opacity=".85"><circle cx="130" cy="70" r="5" /><circle cx="175" cy="55" r="4" /><circle cx="215" cy="78" r="5" /><circle cx="105" cy="96" r="3.5" /></g>
      <path d="M70 112 L270 112 L250 126 L90 126 Z" fill="#efe3c8" />
      <g stroke="#c9b48c" strokeWidth="1">
        {[[90, 98], [105, 110], [120, 123], [135, 137], [150, 151], [190, 189], [205, 203], [220, 217], [235, 230], [250, 242]].map(([a, b]) => <line key={a} x1={a} y1="112" x2={b} y2="126" />)}
      </g>
      <path d="M156 124 L184 124 L188 222 L152 222 Z" fill="#f1e9d6" />
      <path d="M150 140 C 152 136, 188 136, 190 140 L 198 160 C 184 154, 156 154, 142 160 Z" fill="#e3d6ba" />
      <path d="M146 210 C 140 222, 142 240, 170 242 C 198 240, 200 222, 194 210 L 186 226 L 178 214 L 170 228 L 162 214 L 154 226 Z" fill="#d8ccb2" />
      <line x1="40" y1="236" x2="300" y2="236" stroke="#4b5a50" strokeWidth="1.5" strokeDasharray="4 4" />
      <g stroke="var(--muted)" strokeWidth="1">
        <line x1="215" y1="46" x2="276" y2="22" /><line x1="72" y1="110" x2="22" y2="82" /><line x1="248" y1="122" x2="278" y2="136" />
        <line x1="196" y1="157" x2="262" y2="176" /><line x1="156" y1="190" x2="80" y2="190" /><line x1="194" y1="230" x2="262" y2="230" />
      </g>
      <g fill={C.txt} fontSize="13">
        <text x="334" y="20" textAnchor="end" fontWeight="600">Chapeau</text>
        <text x="18" y="78">Marge</text>
        <text x="334" y="141" textAnchor="end" fontWeight="600">Dessous</text>
        <text x="266" y="180">Anneau</text>
        <text x="40" y="194" fontWeight="600">Pied</text>
        <text x="266" y="234">Volve</text>
        <text x="170" y="262" textAnchor="middle" fontSize="11" fill="var(--muted)">Exemple : une amanite (anneau et volve)</text>
      </g>
    </svg>
  );
}

const rayons = (n: number, r: number) => Array.from({ length: n }, (_, i) => {
  const a = (i / n) * Math.PI * 2;
  return [60 + Math.cos(a) * r, 40 + Math.sin(a) * r];
});

function Lames() {
  return (
    <svg viewBox="0 0 120 80" aria-hidden="true"><circle cx="60" cy="40" r="36" fill="#efe3c8" />
      <g stroke="#b9a37a" strokeWidth="1.2">{rayons(16, 36).map(([x, y], i) => <line key={i} x1="60" y1="40" x2={x} y2={y} />)}</g>
      <circle cx="60" cy="40" r="7" fill="#f1e9d6" /></svg>
  );
}
function Tubes() {
  const pts = [[40, 22], [50, 18], [60, 16], [70, 18], [80, 22], [34, 32], [44, 29], [54, 27], [66, 27], [76, 29], [86, 32], [32, 43], [42, 40], [78, 40], [88, 43], [36, 54], [46, 52], [56, 54], [66, 54], [76, 52], [84, 54], [44, 63], [54, 65], [66, 65], [76, 63]];
  return (
    <svg viewBox="0 0 120 80" aria-hidden="true"><circle cx="60" cy="40" r="36" fill="#c9b24a" />
      <g fill="#8f7a26">{pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" />)}</g>
      <circle cx="60" cy="40" r="9" fill="#e6dcc0" /></svg>
  );
}
function Plis() {
  const d = ["M60 40 Q 58 22 50 6", "M60 40 Q 72 22 86 12", "M60 40 Q 80 38 96 42", "M60 40 Q 74 58 82 70", "M60 40 Q 56 60 54 76", "M60 40 Q 42 54 30 64", "M60 40 Q 40 38 24 34", "M60 40 Q 46 24 34 14", "M53 18 L 62 8", "M78 24 L 92 24", "M75 55 L 92 58", "M45 52 L 40 70"];
  return (
    <svg viewBox="0 0 120 80" aria-hidden="true"><circle cx="60" cy="40" r="36" fill="#f0b43a" />
      <g stroke="#c98a1c" strokeWidth="3" fill="none" strokeLinecap="round">{d.map((p) => <path key={p} d={p} />)}</g>
      <circle cx="60" cy="40" r="7" fill="#f6cf6a" /></svg>
  );
}
function Aiguillons() {
  const pts = [[40, 20], [52, 14], [64, 13], [76, 16], [86, 24], [32, 32], [44, 30], [76, 30], [88, 36], [30, 46], [42, 46], [78, 46], [90, 50], [38, 58], [50, 60], [62, 60], [74, 58], [84, 62]];
  return (
    <svg viewBox="0 0 120 80" aria-hidden="true"><circle cx="60" cy="40" r="36" fill="#ead7b5" />
      <g fill="#c7a777">{pts.map(([x, y], i) => <path key={i} d={`M${x} ${y} l3 7 l-6 0z`} />)}</g>
      <circle cx="60" cy="40" r="9" fill="#f1e9d6" /></svg>
  );
}

const DESSOUS = [
  { nom: "Lames", txt: "Fines feuilles serrées, comme les pages d'un livre. Amanites, russules, agarics…", Img: Lames },
  { nom: "Tubes (pores)", txt: "Une éponge percée de petits trous. Cèpes et bolets.", Img: Tubes },
  { nom: "Plis", txt: "Nervures épaisses et fourchues, qui descendent sur le pied. Girolle, chanterelles.", Img: Plis },
  { nom: "Aiguillons", txt: "Petites pointes molles, comme une brosse. Pied de mouton.", Img: Aiguillons },
];

export function LexiqueContenu() {
  return (
    <div className="lex">
      <div className="lex-schema"><Schema /></div>
      <section className="lex-sec">
        <h2>Le dessous du chapeau : 4 cas</h2>
        <p className="note">Le premier critère à regarder. Il suffit souvent à éliminer la moitié des espèces.</p>
        <div className="lex-dessous">
          {DESSOUS.map(({ nom, txt, Img }) => (
            <div key={nom}><Img /><b>{nom}</b><span>{txt}</span></div>
          ))}
        </div>
      </section>
      <section className="lex-sec">
        <h2>Les autres mots</h2>
        <dl className="lex-mots">
          {MOTS.map((m) => <div key={m.mot}><dt>{m.mot}</dt><dd>{m.def}</dd></div>)}
        </dl>
      </section>
    </div>
  );
}

// Mots du lexique repérés dans les textes des fiches
const MOTIF = /\b(lames?|tubes|pores|plis|aiguillons|marge|anneau|volve|d[ée]currente?s?)\b/gi;

/** Rend un texte en transformant les mots du lexique en liens qui ouvrent le lexique. */
export function avecMots(texte: string, ouvrir: () => void): ReactNode {
  const morceaux = texte.split(MOTIF);
  return morceaux.map((m, i) =>
    i % 2 === 1
      ? <button key={i} type="button" className="mot" onClick={ouvrir}>{m}</button>
      : <Fragment key={i}>{m}</Fragment>,
  );
}
