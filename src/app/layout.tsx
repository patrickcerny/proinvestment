import type { Metadata } from "next";
import "./base.scss";

export const metadata: Metadata = {
  title: "ProInvestment",
  description: "Premium real estate and considered investment guidance.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
