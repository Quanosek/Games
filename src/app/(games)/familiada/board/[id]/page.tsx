import Board from "./board";

export default async function FamiliadaBoardPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const id = (await params).id;
  return <Board id={id} />;
}
