import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dev Pad",
  description: "ilan Portfolio/VSCode",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full w-full">
      <body className="h-full w-full overflow-hidden">
        {children}
      </body>
    </html>
  );
}
