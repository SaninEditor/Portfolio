import { useEffect } from 'react';
import { site } from '../data/site';

interface SeoProps {
  page?: string;
  description?: string;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Sets <title>, description and Open Graph tags per route. */
export function Seo({ page, description }: SeoProps) {
  const title = site.title(page);
  const desc = description ?? site.positioning;

  useEffect(() => {
    document.title = title;
    upsertMeta('name', 'description', desc);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', desc);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', site.name);
  }, [title, desc]);

  return null;
}
