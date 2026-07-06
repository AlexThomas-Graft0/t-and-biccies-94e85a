import { CookieBanner } from "@/components/CookieBanner";
import './globals.css';
import { DM_Serif_Display, JetBrains_Mono } from 'next/font/google';

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-serif',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 't and biccies',
  description: 'we are a small family run cafe that offers afternoon tea',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#F3E9D8] text-[#111827] min-h-screen antialiased selection:bg-[#C56A3C]/20 selection:text-[#C56A3C] transition-colors duration-200">
        {children}
              <CookieBanner />
      </body>
    </html>
  );
}