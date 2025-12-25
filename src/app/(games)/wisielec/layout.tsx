import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wisielec - Pokój gier / klalo.pl',
  description:
    'Gra w wisielca polega na odgadywaniu wyrazu poprzez podawanie pojedynczych liter. Jeśli podana litera znajduje się w wyrazie, zostaje ona odsłonięta. Jeśli litera nie występuje w wyrazie, rysowany jest kolejny element wisielca. Gra kończy się wygraną, gdy wszystkie litery wyrazu zostaną odgadnięte, lub przegraną, gdy wisielec zostanie narysowany w całości.',
  icons: {
    icon: '/favicons/knot.svg',
  },
}

export default function WisielecLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
