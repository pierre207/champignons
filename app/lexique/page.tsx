import Shell from "@/components/Shell";
import { LexiqueContenu } from "@/components/Lexique";

export const metadata = { title: "Les parties d'un champignon" };

export default function Lexique() {
  return (
    <Shell tab="jeu">
      <header className="head">
        <h1 style={{ margin: 0, fontSize: 24 }}>Les parties d&apos;un champignon</h1>
        <p className="note">Les mots utilisés dans les fiches et les corrections du jeu.</p>
      </header>
      <LexiqueContenu />
    </Shell>
  );
}
