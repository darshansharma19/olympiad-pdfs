import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#1a3a8f',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'OlympiadPDFs — Expert Olympiad Practice Papers for Classes 6–10',
    template: '%s | OlympiadPDFs',
  },
  description:
    'Download expert-designed Olympiad practice papers for Classes 6–10 in IMO (Mathematics), ISO (Science), IEO (English), ICSO (Computer Science), and IRO (Reasoning). Instant PDF delivery.',
  keywords: [
    'olympiad practice papers',
    'IMO mathematics olympiad class 6 7 8 9 10',
    'ISO science olympiad practice papers',
    'IEO english olympiad sample papers',
    'ICSO computer science olympiad papers',
    'IRO reasoning olympiad test papers',
    'olympiad pdf download',
    'school olympiad preparation',
  ],
  authors: [{ name: 'OlympiadPDFs Team' }],
  creator: 'OlympiadPDFs',
  publisher: 'OlympiadPDFs',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://olympiadpdfs.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://olympiadpdfs.com',
    siteName: 'OlympiadPDFs',
    title: 'OlympiadPDFs — Expert Olympiad Practice Papers for Classes 6–10',
    description:
      'Practice smarter for school Olympiads. High-yield practice papers for IMO, ISO, IEO, ICSO, and IRO. Instant download.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OlympiadPDFs — Expert Olympiad Practice Papers',
    description: 'Expert-designed Olympiad practice papers for Classes 6–10 in IMO, ISO, IEO, ICSO, and IRO.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Meta Pixel — loads asynchronously if configured */}
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}
      </head>
      <body className="min-h-full flex flex-col bg-white">
        {children}
      </body>
    </html>
  );
}
