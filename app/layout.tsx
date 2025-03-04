import "./globals.css";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/auth-context";

const inter = Inter({ subsets: ["latin"] });

// Importation dynamique de la Navbar pour la rendre uniquement côté client
const Navbar = dynamic(() => import("@/components/navbar"), {
  ssr: false,
  loading: () => <div>Loading navbar...</div>,
});

export const metadata = {
  title: "Orcall - Plateforme du bâtiment",
  description: "Trouver des professionnels et s'inscrire",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <AuthProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <Navbar />
            </Suspense>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
