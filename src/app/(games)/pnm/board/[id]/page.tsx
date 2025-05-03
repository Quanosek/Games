import Board from "./board";

export default async function PnmBoardPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const id = (await params).id;
  return <Board id={id} />;
}
