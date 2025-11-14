const luxon = require("luxon")
const slug = require("@11ty/eleventy/src/Filters/Slug")

module.exports = (eleventyConfig) => {
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
}
