import Shell from "@/components/Shell";
import { LexiqueContenu } from "@/components/Lexique";

export const metadata = {
  title: "Vocabulaire des champignons : chapeau, lames, volve",
  description: "Les parties d'un champignon expliquées simplement : chapeau, lames, tubes, anneau, volve… Le vocabulaire utilisé dans les fiches.",
  alternates: { canonical: "/lexique" },
};

export default function Lexique() {
  return (
    <Shell tab="quiz">
      <header className="head">
        <h1 style={{ margin: 0, fontSize: 24 }}>Les parties d&apos;un champignon</h1>
        <p className="note">Les mots utilisés dans les fiches et les corrections du quiz.</p>
      </header>
      <LexiqueContenu />
    </Shell>
  );
}
