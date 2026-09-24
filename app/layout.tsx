import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "CurioWorld — Descubre algo nuevo cada día", template: "%s | CurioWorld" },
  description: "Curiosidades, ciencia, espacio, historia, tecnología y preguntas que despiertan tu curiosidad.",
  openGraph: { title: "CurioWorld", description: "Descubre algo nuevo cada día.", type: "website" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es"><body>{children}</body></html>;
}