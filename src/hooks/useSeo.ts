import { useEffect } from 'react';

interface SeoOptions {
  title: string;
  description?: string;
  image?: string;
  /** Structured data object, serialized as JSON-LD. */
  jsonLd?: Record<string, unknown>;
  noIndex?: boolean;
}

const setMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

const setLink = (rel: string, href: string) => {
  let tag = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
};

/** Sets per-page title, description, social tags, canonical URL and JSON-LD. */
export const useSeo = ({ title, description, image, jsonLd, noIndex }: SeoOptions) => {
  useEffect(() => {
    document.title = title;

    if (description) {
      setMeta('meta[name="description"]', 'name', 'description', description);
      setMeta('meta[property="og:description"]', 'property', 'og:description', description);
      setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    }

    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="robots"]', 'name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    if (image) {
      const absolute = image.startsWith('http') ? image : `${window.location.origin}${image}`;
      setMeta('meta[property="og:image"]', 'property', 'og:image', absolute);
      setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', absolute);
    }

    setLink('canonical', `${window.location.origin}${window.location.pathname}`);

    const scriptId = 'ry-json-ld';
    document.getElementById(scriptId)?.remove();
    if (jsonLd) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      document.getElementById(scriptId)?.remove();
    };
  }, [title, description, image, noIndex, JSON.stringify(jsonLd ?? null)]);
};
