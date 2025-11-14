// Import modular configurations
const filters = require("./config/filters")
const plugins = require("./config/plugins")
const shortcodes = require("./config/shortcodes")
const markdown = require("./config/markdown")
const transforms = require("./config/transforms")
const htmlMinify = require("./config/html-minify")
const images = require("./config/images")

module.exports = (eleventyConfig) => {
  // Add alias for layouts
  eleventyConfig.addLayoutAlias("base", "layouts/base")
  eleventyConfig.addLayoutAlias("page", "layouts/page")
  eleventyConfig.addLayoutAlias("default", "layouts/default")
  eleventyConfig.addLayoutAlias("article", "layouts/article")
  eleventyConfig.addLayoutAlias("generic", "layouts/generic")
  eleventyConfig.addLayoutAlias("now", "layouts/now")
  eleventyConfig.addLayoutAlias("title", "layouts/title")

  // Make it possible to set the "post" tag in the "post.njk" layout while still assigning further tags in the individual post.
  // https://www.11ty.dev/docs/data-deep-merge/
  eleventyConfig.setDataDeepMerge(true)

  // Load modular configurations
  filters(eleventyConfig)
  plugins(eleventyConfig)
  shortcodes(eleventyConfig)
  markdown(eleventyConfig)
  transforms(eleventyConfig)
  htmlMinify(eleventyConfig)
  images(eleventyConfig)

  // 
  // Copy folder to _site
  // 
  eleventyConfig.addPassthroughCopy("src/assets/css")
  eleventyConfig.addPassthroughCopy("src/assets/img")
  eleventyConfig.addPassthroughCopy("src/assets/fonts")
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
}
