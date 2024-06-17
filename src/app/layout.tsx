import type { Metadata } from "next";
import "@/app/styles/globals.css";
import ReactQueryProviders from "./useReactQuery";

export const metadata: Metadata = {
  title: {
    template: "%s | Find The Real Price",
    default: "Find The Real Price",
  },
  description: "Checkout the lowest price!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProviders>{children}</ReactQueryProviders>
      </body>
    </html>
  );
}
