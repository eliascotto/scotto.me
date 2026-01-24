import type { APIRoute, GetStaticPaths } from 'astro';
import { getAllPosts } from '../../lib/content';
import { generateOGImage } from '../../lib/og-image';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { post } = props;

  const png = await generateOGImage({
    title: post.data.title,
    description: post.data.description,
    pubDate: post.data.date,
  });

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
