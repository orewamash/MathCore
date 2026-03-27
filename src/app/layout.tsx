import { Metadata } from "next";
import { 
  DM_Serif_Display, 
  Syne, 
  Geist_Mono, 
  Dawning_of_a_New_Day, 
  Zeyada, 
  Patrick_Hand, 
  Fredoka 
} from "next/font/google";
import "./globals.css";

// ── Display fonts ──
const dmSerif = DM_Serif_Display({ weight: ["400"], subsets: ["latin"], variable: "--font-dm-serif" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

// ── Userrequested "Goated" decorative fonts ──
const fontNewDay = Dawning_of_a_New_Day({ weight: "400", subsets: ["latin"], variable: "--font-new-day" });
const fontCurls = Zeyada({ weight: "400", subsets: ["latin"], variable: "--font-curls" });
const fontPot = Patrick_Hand({ weight: "400", subsets: ["latin"], variable: "--font-pot" });
const fontCuckoo = Fredoka({ weight: "700", subsets: ["latin"], variable: "--font-cuckoo" });

export const metadata: Metadata = {
  title: "MathCore — Engineering Mathematics 1",
  description: "Learn and practise Engineering Maths 1 with AI-powered step-by-step solutions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const allFonts = [
    dmSerif.variable, 
    syne.variable, 
    geistMono.variable, 
    fontNewDay.variable, 
    fontCurls.variable, 
    fontPot.variable, 
    fontCuckoo.variable
  ].join(" ");

  return (
    <html lang="en" className={allFonts}>
      <body>{children}</body>
    </html>
  );
}

