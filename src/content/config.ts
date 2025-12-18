import { defineCollection, z } from 'astro:content';

const baseSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.date(),
  language: z.string().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().optional(),
  openGraphImage: z.string().optional(),
});

const articleCollection = defineCollection({
  type: 'content',
  schema: baseSchema,
});

const postCollection = defineCollection({
  type: 'content',
  schema: baseSchema,
});

const translationCollection = defineCollection({
  type: 'content',
  schema: baseSchema,
});

const pageCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    name: z.string().optional(),
    layout: z.string().optional(),
    eleventyExcludeFromCollections: z.union([z.boolean(), z.string()]).optional(),
    tags: z.union([z.array(z.string()), z.string()]).optional(),
    today: z.string().optional(),
  }),
});

export const collections = {
  articles: articleCollection,
  posts: postCollection,
  translations: translationCollection,
  pages: pageCollection,
};
