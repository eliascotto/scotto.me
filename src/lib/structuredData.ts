import { meta } from '../data/meta';

type JsonLd = Record<string, unknown>;

/**
 * Person schema for Elia Scotto, used on the homepage.
 */
export function getPersonSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Elia Scotto',
    url: meta.url,
    image: `${meta.url}${meta.image}`,
    sameAs: [meta.github],
  };
}

/**
 * WebSite schema, used on the homepage.
 */
export function getWebsiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: meta.siteName,
    url: meta.url,
    description: meta.description,
  };
}

interface BlogPostingOptions {
  title: string;
  description?: string;
  date: Date;
  pathname: string;
  image?: string;
  inLanguage?: string;
}

/**
 * BlogPosting schema for individual blog posts/articles.
 */
export function getBlogPostingSchema({
  title,
  description,
  date,
  pathname,
  image,
  inLanguage = 'en',
}: BlogPostingOptions): JsonLd {
  const url = new URL(pathname, meta.url).toString();
  const author = {
    '@type': 'Person',
    name: 'Elia Scotto',
    url: meta.url,
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description ?? meta.description,
    datePublished: date.toISOString(),
    dateModified: date.toISOString(),
    inLanguage,
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    image: `${meta.url}${image ?? meta.openGraphImage}`,
    author,
    publisher: author,
  };
}
