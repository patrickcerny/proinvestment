import type { Metadata } from "next";
import "../base.scss";

export const metadata: Metadata = {
  title: "ProInvestment | Admin",
  robots: { index: false, follow: false },
  icons: {
    icon: "/images/proinvestment-logo.png",
    shortcut: "/images/proinvestment-logo.png",
    apple: "/images/proinvestment-logo.png",
  },
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="de"><body>{children}</body></html>;
}
