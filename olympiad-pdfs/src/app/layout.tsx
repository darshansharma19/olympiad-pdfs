import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'OlympiadPDFs — Expert Practice. Better Preparation.',
    template: '%s | OlympiadPDFs',
  },
  description:
    'Expert-designed Olympiad practice papers for Classes 6–10. Mathematics, Science, English, Computer Science, GK, and Reasoning. Instant digital delivery after payment.',
  keywords: [
    'olympiad practice papers',
    'class 6 olympiad papers',
    'class 7 olympiad papers',
    'class 8 olympiad papers',
    'class 9 olympiad papers',
    'class 10 olympiad papers',
    'olympiad pdf',
    'olympiad question papers',
    'maths olympiad practice',
    'science olympiad papers',
  ],
  authors: [{ name: 'OlympiadPDFs' }],
  creator: 'OlympiadPDFs',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://olympiadpdfs.com'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'OlympiadPDFs',
    title: 'OlympiadPDFs — Expert Olympiad Practice Papers for Classes 6–10',
    description:
      'Expert-designed Olympiad practice papers for Classes 6–10. 6 subjects. Instant digital delivery.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OlympiadPDFs — Expert Olympiad Practice Papers',
    description: 'Expert-designed Olympiad practice papers for Classes 6–10.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
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
        {/* Meta Pixel — loads asynchronously */}
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
