import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogEntry = CollectionEntry<'articles'> | CollectionEntry<'posts'>;
export type NoteEntry = CollectionEntry<'notes'>;
export type TranslationEntry = CollectionEntry<'translations'>;

const publishedFilter = (entry: BlogEntry | NoteEntry | TranslationEntry) => !entry.data.draft;

const blogCollections = ['articles', 'posts'] as const;

export type BlogCollection = (typeof blogCollections)[number];

// ============================================================================
// Posts
// ============================================================================

export async function getAllContent() {
  const collections = await Promise.all(
    [
      ...blogCollections.map((name) => getCollection(name, publishedFilter)),
      getCollection('notes', publishedFilter),
    ],
  );

  return collections
    .flat()
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/**
 * Gets all published posts from articles and posts collections, sorted by date (newest first).
 */
export async function getAllPosts() {
  const collections = await Promise.all(
    blogCollections.map((name) => getCollection(name as BlogCollection, publishedFilter))
  );

  return collections
    .flat()
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/**
 * Gets all published tech posts, sorted by date (newest first).
 */
export async function getTechPosts() {
  const posts = await getCollection('posts', publishedFilter);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/**
 * Gets all published articles, sorted by date (newest first).
 */
export async function getArticles() {
  const articles = await getCollection('articles', publishedFilter);
  return articles.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/**
 * Gets all published notes, sorted by date (newest first).
 */
export async function getNotes() {
  const notes = await getCollection('notes', publishedFilter);
  return notes.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/**
 * Returns the URL path for a blog post.
 */
export function getPostUrl(entry: BlogEntry) {
  return `/blog/${entry.slug}/`;
}

/**
 * Returns the URL path for a note.
 */
export function getNoteUrl(entry: CollectionEntry<'notes'>) {
  return `/notes/${entry.slug}/`;
}

/**
 * Finds a published post by its slug.
 */
export async function getPostBySlug(slug: string) {
  const posts = await getAllPosts();
  return posts.find((entry) => entry.slug === slug);
}

export async function getNoteBySlug(slug: string) {
  const notes = await getNotes();
  return notes.find((entry) => entry.slug === slug);
}

// ============================================================================
// Translations
// ============================================================================

/**
 * Returns the URL path for a translation entry.
 */
export function getTranslationUrl(entry: TranslationEntry) {
  // Translation slugs are "ita/slug", extract just the slug part
  const slug = entry.slug.replace(/^ita\//, '');
  return `/blog/${slug}/ita/`;
}

/**
 * Finds a published translation by its slug (without the "ita/" prefix).
 */
export async function getTranslationBySlug(slug: string) {
  const translations = await getCollection('translations', publishedFilter);
  // Translation slugs are "ita/slug", match against the slug part
  return translations.find((entry) => entry.slug === `ita/${slug}`);
}

/**
 * Returns a map of translations keyed by slug (without the "ita/" prefix).
 */
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

// ============================================================================
// Tags
// ============================================================================

/**
 * Filters posts that include the specified tag.
 */
export function filterPostsByTag(posts: BlogEntry[], tag: string) {
  return posts.filter((entry) => entry.data.tags?.includes(tag));
}

/**
 * Returns a map of tag names to post counts, excluding 'all' and 'posts' tags.
 */
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
