/**
 * Camadas de atmosfera de fundo (brilho crimson + grid).
 * Presente em todas as telas — montado no root layout.
 */
export default function BgLayers() {
  return (
    <>
      <div className="bg-atmos" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />
    </>
  );
}
