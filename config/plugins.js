const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginBundle = require("@11ty/eleventy-plugin-bundle");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const prismConfig = require("../prism.config");

module.exports = (eleventyConfig) => {
  // RSS feed generation
  eleventyConfig.addPlugin(pluginRss);
  
  // Bundle CSS/JS assets
  eleventyConfig.addPlugin(pluginBundle);
  
  // Syntax highlighting with Prism
  eleventyConfig.addPlugin(syntaxHighlight, prismConfig);
};

