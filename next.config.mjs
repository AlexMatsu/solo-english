/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Permite isolar o diretório de um build de verificação (`.next-check`) do
  // `.next` usado pelo `next dev` — evita corromper o dev ao rodar build local.
  // Na Vercel a env não é definida → usa `.next` normalmente.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
