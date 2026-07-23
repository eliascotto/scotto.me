import rss from '@astrojs/rss';
import { marked } from 'marked';
import { meta } from '../data/meta';
import { getAllPosts,  getPostUrl } from '../lib/content';
import type { Context } from 'node:vm';

export async function GET(context: Context) {
  const posts = await getAllPosts();

  return rss({
    title: 'Elia Scotto',
    description: 'Essays, reviews, and tech articles',
    site: context.site ?? meta.url,
    items: await Promise.all(
      posts.map(async (post) => ({
        title: post.data.title,
        description: post.data.description,
        link: getPostUrl(post),
        pubDate: post.data.date,
        content: await marked.parse(post.body),
      }))
    ),
  });
}
