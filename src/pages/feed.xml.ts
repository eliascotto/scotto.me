import rss from '@astrojs/rss';
import { marked } from 'marked';
import { meta } from '../data/meta';
import { getAllPosts, getPostUrl } from '../lib/content';

export async function GET(context) {
  const posts = await getAllPosts();
  const latest = posts.slice(0, 5);

  return rss({
    title: 'Elia Scotto',
    description: 'Essays and tech articles',
    site: context.site ?? meta.url,
    items: await Promise.all(
      latest.map(async (post) => ({
        title: post.data.title,
        description: post.data.description,
        link: getPostUrl(post),
        pubDate: post.data.date,
        content: await marked.parse(post.body),
      }))
    ),
  });
}
