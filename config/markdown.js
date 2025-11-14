const markdownIt = require("markdown-it")
const markdownItAnchor = require("markdown-it-anchor")
const markdownItFootnote = require("markdown-it-footnote")
const markdownItImageFigures = require("markdown-it-image-figures")
const markdownItLinkAttributes = require("markdown-it-link-attributes")

module.exports = (eleventyConfig) => {
  const md = markdownIt({
    html: true,
    breaks: true,
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
    // Use figcaption for images
    .use(markdownItImageFigures, {
      figcaption: true,
      lazy: true,
      async: true,
    })
    // Use link attributes to open external links in new tabs
    .use(markdownItLinkAttributes, {
      matcher: (href, type, title, text) => {
        return href.match(/^https?:\/\//); // Match external URLs
      },
      attrs: {
        target: "_blank",
        rel: "noopener noreferrer",
      },
    })

  // Style the footnote
  md.renderer.rules.footnote_caption = (tokens, idx) => {
    const { meta } = tokens[idx]
    return `${Number(meta.id + 1)}${meta.subId > 0 ? `:${meta.subId}` : ""}`
  }

  md.linkify.set({ fuzzyEmail: false })  // disables converting email to link

  eleventyConfig.setLibrary("md", md)
}


