// @ts-check
import fs from 'node:fs'

import tailwindcss from '@tailwindcss/vite';

import { defineConfig } from 'astro/config';
import expressiveCode, { ExpressiveCodeTheme } from 'astro-expressive-code';

import rehypeExternalLinks from 'rehype-external-links';
import { rehypeFigureImages } from './src/lib/rehype-figure-images.ts';

const jsoncString = fs.readFileSync(new URL(`./public/assets/idx-xcode-improved.jsonc`, import.meta.url), 'utf-8')
const idxXcodeImprovedTheme = ExpressiveCodeTheme.fromJSONString(jsoncString)

export default defineConfig({
  trailingSlash: 'always',

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    shikiConfig: {
      theme: 'ayu-dark',
    },
    remarkRehype: {
      footnoteLabelTagName: "h3",
      footnoteBackContent: "↩︎",
    },
    rehypePlugins: [rehypeFigureImages, [rehypeExternalLinks, {
      target: '_blank',
      rel: 'noopener noreferrer',
    }]],
  },

  integrations: [expressiveCode({
    themes: [idxXcodeImprovedTheme],
    styleOverrides: {
      textMarkers: {
        markBorderColor: 'oklch(0.75 0.183 55.934)',
      },
      frames: {
        editorTabBarBackground: 'transparent',
        editorTabBarBorderColor: 'transparent',
        editorActiveTabIndicatorTopColor: 'oklch(0.75 0.183 55.934)',
        frameBoxShadowCssValue: 'none',
      },
    }
  })],
});
