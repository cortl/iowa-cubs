import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Iowa Cubs",
  description: "Iowa Cubs game status page",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="text-center">
          <h1 className="text-7xl mb-5">{"🐻"}</h1>
        </header>
        {children}
      </body>
    </html>
  );
}
