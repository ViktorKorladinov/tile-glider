import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "XPlanar Pharma Simulator",
  description: "Simulator for pharma scheduler. Developed by CIIRC.",
};

export default function RootLayout({ children }) {
  return (
      <div className={inter.className}>{children}</div>
  );
}
