const luxon = require("luxon")

const slug = require("@11ty/eleventy/src/Filters/Slug")
const pluginRss = require("@11ty/eleventy-plugin-rss")
const pluginBundle = require("@11ty/eleventy-plugin-bundle")
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight")

const markdownIt = require("markdown-it")
const markdownItAnchor = require('markdown-it-anchor')
const markdownItFootnote = require("markdown-it-footnote")
const markdownItImageFigures = require("markdown-it-image-figures")

const prismLanguageConfig = require("./prism.languages")

module.exports = (eleventyConfig) => {
  // Add alias for layouts
  eleventyConfig.addLayoutAlias("base", "layouts/base")
  eleventyConfig.addLayoutAlias("page", "layouts/page")
  eleventyConfig.addLayoutAlias("article", "layouts/article")
  eleventyConfig.addLayoutAlias("now", "layouts/now")

  // Make it possible to set the "post" tag in the "post.njk" layout while still assigning further tags in the individual post.
  // https://www.11ty.dev/docs/data-deep-merge/
  eleventyConfig.setDataDeepMerge(true)

  // Date filters
  eleventyConfig.addFilter("defaultDate", dateObj => {
    return luxon.DateTime.fromFormat(dateObj, "d/MM/yyyy").toFormat("LLLL d, y")
  })
  eleventyConfig.addFilter("humanDate", dateObj => {
    return luxon.DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("LLLL d, y")
  })
  eleventyConfig.addFilter("slugDate", dateObj => {
    return luxon.DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("y/MM")
  })

  // Create a list of tags from articles
  eleventyConfig.addFilter("tagList", list => {
    // "posts" is a magic tag used to determine which pages are blog posts.
    const properTags = list.filter(x => x != "posts")

    if (!!properTags) {
      return properTags.map(tag => `<a href="/tags/${slug(tag)}">#${tag}</a>`).join(" ")
    }
  })

  // Filter tags and return a string of html list elements
  eleventyConfig.addFilter("tagsListHtml", (obj) => {
    return Object.keys(obj)
                 .filter(tag => tag !== 'all' && tag !== 'posts')
                 .map(tag => `<li class="my-1.5"><a href="/tags/${slug(tag)}">#${tag}</a></li>`)
                 .join("")
  })

  // ===============================================
  // PLUGINS

  eleventyConfig.addPlugin(pluginRss)
  eleventyConfig.addPlugin(pluginBundle)
  eleventyConfig.addPlugin(syntaxHighlight, prismLanguageConfig)

  // ===============================================
  // Shortcodes

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  //
  // MarkdownIt
  // Custom Markdown parser configuration.
  // Mostly used for footnotes.
  //
  const md = markdownIt({
    html: true,
    breaks: false,
    linkify: true,
    typographer: true,
  })

  // Footnotes
  md.use(markdownItFootnote)
    // Use titles anchors
    .use(markdownItAnchor, {
      level: 2,
      permalink: markdownItAnchor.permalink.headerLink(),
    })
    // Use figcaption
    .use(markdownItImageFigures, {
      figcaption: true,
      lazy: true,
      async: true,
    })

  // Style the footnote
  md.renderer.rules.footnote_caption = (tokens, idx) => {
    const { meta } = tokens[idx]
    return `${Number(meta.id + 1)}${meta.subId > 0 ? `:${meta.subId}` : ""}`
  }

  eleventyConfig.setLibrary("md", md)

  // Copy folder to _site
  eleventyConfig.addPassthroughCopy("src/assets/css")
  eleventyConfig.addPassthroughCopy("src/assets/img")
  eleventyConfig.addPassthroughCopy("src/assets/favicon")

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  }
};
