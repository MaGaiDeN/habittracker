import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { QueryProvider } from '@/providers/query-provider'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "HabitTracker",
  description: "Una aplicación para seguimiento de hábitos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`min-h-screen bg-gray-50 ${geistSans.variable}`} suppressHydrationWarning>
        <QueryProvider>
          <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold">HabitTracker</h1>
                </div>
                <div className="flex items-center">
                  <a href="/login" className="text-gray-600 hover:text-gray-900">
                    Iniciar Sesión
                  </a>
                </div>
              </div>
            </div>
          </nav>
          <main className="pt-16">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  )
}
