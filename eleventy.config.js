const fs = require("fs")
const path = require("path")
const CleanCSS = require("clean-css")
const luxon = require("luxon")

const slug = require("@11ty/eleventy/src/Filters/Slug")
const pluginRss = require("@11ty/eleventy-plugin-rss")
const pluginBundle = require("@11ty/eleventy-plugin-bundle")
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight")

const markdownIt = require("markdown-it")
const markdownItAnchor = require("markdown-it-anchor")
const markdownItFootnote = require("markdown-it-footnote")
const markdownItImageFigures = require("markdown-it-image-figures")

const prismLanguageConfig = require("./prism.languages")

module.exports = (eleventyConfig) => {
  // Add alias for layouts
  eleventyConfig.addLayoutAlias("base", "layouts/base")
  eleventyConfig.addLayoutAlias("page", "layouts/page")
  eleventyConfig.addLayoutAlias("default", "layouts/default")
  eleventyConfig.addLayoutAlias("article", "layouts/article")
  eleventyConfig.addLayoutAlias("generic", "layouts/generic")
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
      .filter(tag => tag !== "all" && tag !== "posts")
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

  md.linkify.set({ fuzzyEmail: false })  // disables converting email to link

  eleventyConfig.setLibrary("md", md)

  // 
  // Copy folder to _site
  // 
  eleventyConfig.addPassthroughCopy("assets/css")
  eleventyConfig.addPassthroughCopy("assets/img")
  eleventyConfig.addPassthroughCopy("assets/fonts")
  eleventyConfig.addPassthroughCopy("assets/favicon")

  // 
  // Minify CSS after build
  // 
  eleventyConfig.on("afterBuild", () => {
    const inputDir = "assets/css"
    const outputDir = "_site/assets/css"
    const outputFilename = "out.min.css"
    const sourceMapFilename = "out.css.map"

    // Ensure the input directory exists
    if (!fs.existsSync(inputDir)) {
      console.error("Missing CSS input directory.")
      return
    }

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    const sourceFiles = fs.readdirSync(inputDir).map(file => path.join(inputDir, file))
    const outputFile = path.join(outputDir, outputFilename)
    const mapFile = path.join(outputDir, sourceMapFilename)

    const output = new CleanCSS({
      // Skip the source map in production
      sourceMap: process.env.NODE_ENV !== "production",
      rebaseTo: outputDir
    })
      .minify(sourceFiles)

    if (output.errors.length) {
      console.error(`Error minifying ${sourceFiles}:`, output.errors);
      return;
    }

    // Write the minified CSS file with a source map reference
    fs.writeFileSync(outputFile, output.styles + `\n/*# sourceMappingURL=${path.basename(mapFile)} */`)
    console.log(`Minified ${sourceFiles} → ${outputFile}`)

    if (process.env.NODE_ENV !== "production") {
      // Write the source map file
      fs.writeFileSync(mapFile, output.sourceMap.toString())
      console.log(`Source map generated for ${sourceFiles} → ${mapFile}`)
    }
  })

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
