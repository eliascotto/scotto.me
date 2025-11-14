const pluginRss = require("@11ty/eleventy-plugin-rss")
const pluginBundle = require("@11ty/eleventy-plugin-bundle")
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight")
const prismConfig = require("../prism.config")

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(pluginRss)
  eleventyConfig.addPlugin(pluginBundle)
  eleventyConfig.addPlugin(syntaxHighlight, prismConfig)
}

