import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Cormorant_Garamond, Manrope } from "next/font/google";
import { site } from "@/config/site";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { Consent } from "@/components/layout/Consent";
import { ToastProvider } from "@/components/ui/Toast";
import { MotionProvider } from "@/components/layout/MotionProvider";
import "./globals.css";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const cormorant = Cormorant_Garamond({
  weight: ["400", "500"],
  style: ["italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const title = "Dom Pablo | Barbearia Premium em Cuiabá";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s | Dom Pablo" },
  description: site.description,
  keywords: [
    "barbearia premium Cuiabá",
    "barbearia em Cuiabá",
    "barbearia masculina Cuiabá",
    "corte masculino Cuiabá",
    "barba Cuiabá",
    "assinatura barbearia Cuiabá",
    "Dom Pablo",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title,
    description: site.description,
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: "Dom Pablo, barbearia premium em Cuiabá" }],
  },
  twitter: { card: "summary_large_image", title, description: site.description, images: ["/images/og.jpg"] },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#101010",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Dados estruturados para SEO local. Campos não informados ficam de fora (nada inventado). */
function LocalBusinessJsonLd() {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BarberShop",
    name: site.name,
    description: site.description,
    url: site.url,
    image: `${site.url}/images/og.jpg`,
    areaServed: { "@type": "City", name: `${site.city}, ${site.state}` },
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressRegion: site.state,
      addressCountry: "BR",
      ...(site.address.street ? { streetAddress: site.address.street } : {}),
      ...(site.address.postalCode ? { postalCode: site.address.postalCode } : {}),
    },
  };
  if (site.whatsapp) data.telephone = `+${site.whatsapp}`;
  data.openingHoursSpecification = [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "09:00", closes: "20:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Friday", "Saturday"], opens: "08:00", closes: "20:00" },
  ];
  if (site.maps.placeUrl) data.hasMap = site.maps.placeUrl;
  if (site.geo) data.geo = { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng };
  if (site.instagram.handle) data.sameAs = [`https://instagram.com/${site.instagram.handle}`];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${bebas.variable} ${manrope.variable} ${cormorant.variable}`}>
      <body className="grain">
        <LocalBusinessJsonLd />
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-bronze focus:px-4 focus:py-2 focus:text-bone">
          Pular para o conteúdo
        </a>
        <MotionProvider>
          <ToastProvider>
            <SmoothScroll>
              <Header />
              <main id="conteudo">{children}</main>
              <Footer />
              <FloatingActions />
              <Consent />
            </SmoothScroll>
          </ToastProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
