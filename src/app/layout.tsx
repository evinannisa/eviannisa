import type { Metadata } from "next";
import "../index.css";
import { LayoutWrapper } from "../components/LayoutWrapper";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TopLoader } from "@/components/TopLoader";

export const metadata: Metadata = {
  title: "Evi Annisa",
  description:
    "Evi Nur Annisa, a software engineer who builds things, learns new stuff, and turns little ideas into something real.",
  icons: { icon: "/assets/images/logo.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Tema tersimpan dipasang sebelum halaman di-paint agar tampilan tidak berkedip dari dark ke light. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("theme")==="light")document.documentElement.classList.add("light")}catch(e){}`,
          }}
        />
      </head>
      <body>
        <TopLoader />
        <ThemeProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
