// This file intentionally left as a fallback.
// The homepage is served by src/app/page.tsx (root).
// Next.js App Router gives priority to the root page.tsx over
// a route-group page.tsx for the same URL.
import { notFound } from 'next/navigation';

export default function FallbackPage() {
  notFound();
}
