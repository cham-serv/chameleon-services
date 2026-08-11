import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Chameleon Services | The Next-Gen Storefront Platform",
  description: "High-performance, AI-optimised ecommerce templates for serious merchants.",
};

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="marketing-body">
        <header className="marketing-header">
          <div className="container">
            <a href="/" className="logo">Chameleon Services</a>
            <nav>
              <a href="/templates">Templates</a>
              <a href="/pricing">Pricing</a>
              <a href="/contact">Contact</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="marketing-footer">
          <div className="container">
            &copy; {new Date().getFullYear()} Chameleon Services. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
