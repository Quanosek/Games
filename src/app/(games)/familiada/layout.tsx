import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `"Familiada" - Pokój gier / klalo.pl`,
  description: `"Familiada" to polski teleturniej wzorowany na amerykańskim "Family Feud", gdzie dwie pięcioosobowe drużyny rywalizują ze sobą. Zawodnicy muszą odgadnąć najczęściej pojawiające się odpowiedzi w ankietach przeprowadzonych wcześniej wśród 100 osób. Za każdą poprawną odpowiedź drużyna zdobywa punkty, a wygrywa ta, która uzbiera ich więcej.`,
  icons: {
    icon: "/favicons/money-bag.svg",
  },
  robots: {
    index: false,
  },
};

export default function FamiliadaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
