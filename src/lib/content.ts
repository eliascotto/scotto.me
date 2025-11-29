import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogEntry = CollectionEntry<'articles'> | CollectionEntry<'posts'>;
export type TranslationEntry = CollectionEntry<'translations'>;

const publishedFilter = (entry: BlogEntry | TranslationEntry) => !entry.data.draft;

const blogCollections = ['articles', 'posts'] as const;

type BlogCollection = (typeof blogCollections)[number];

export async function getAllPosts() {
  const collections = await Promise.all(
    blogCollections.map((name) => getCollection(name as BlogCollection, publishedFilter))
  );

  return collections
    .flat()
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function getPostUrl(entry: BlogEntry) {
  return `/blog/${entry.slug}/`;
}

export function getTranslationUrl(entry: TranslationEntry) {
  // Translation slugs are "ita/slug", extract just the slug part
  const slug = entry.slug.replace(/^ita\//, '');
  return `/blog/${slug}/ita/`;
}

export async function getPostBySlug(slug: string) {
  const posts = await getAllPosts();
  return posts.find((entry) => entry.slug === slug);
}

export async function getTranslationBySlug(slug: string) {
  const translations = await getCollection('translations', publishedFilter);
  // Translation slugs are "ita/slug", match against the slug part
  return translations.find((entry) => entry.slug === `ita/${slug}`);
}

export async function getTranslationsMap() {
  const translations = await getCollection('translations', publishedFilter);
  const map = new Map<string, TranslationEntry>();

  for (const entry of translations) {
    // Translation slugs are "ita/slug", map using just the slug part
    const slug = entry.slug.replace(/^ita\//, '');
    map.set(slug, entry);
  }

  return map;
}

export function filterPostsByTag(posts: BlogEntry[], tag: string) {
  return posts.filter((entry) => entry.data.tags?.includes(tag));
}

export async function getTagCounts() {
  const posts = await getAllPosts();
  const counts = new Map<string, number>();

  for (const entry of posts) {
    for (const tag of entry.data.tags ?? []) {
      if (tag === 'all' || tag === 'posts') {
        continue;
      }
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return counts;
}
