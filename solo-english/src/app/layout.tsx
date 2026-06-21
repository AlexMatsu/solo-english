import type { Metadata } from "next";
import "./globals.css";
import BgLayers from "@/components/BgLayers";

export const metadata: Metadata = {
  title: "Solo English — Transforme seu inglês no seu maior poder",
  description:
    "Plataforma de inglês gamificada com estética anime. Suba de nível através de missões, desafios e batalhas. Estudo de UX/UI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <BgLayers />
        {children}
      </body>
    </html>
  );
}
