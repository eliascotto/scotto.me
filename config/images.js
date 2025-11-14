const Image = require("@11ty/eleventy-img");

module.exports = (eleventyConfig) => {
  // Image optimization
  eleventyConfig.addShortcode("image", async (src, alt, sizes = "100vw") => {
    let metadata = await Image(src, {
      widths: [300, 600, 900, 1200],
      formats: ["avif", "webp", "jpeg"],
      outputDir: "_site/assets/img/",
      urlPath: "/assets/img/"
    });

    let imageAttributes = {
      alt,
      sizes,
      loading: "lazy",
      decoding: "async",
    };

    return Image.generateHTML(metadata, imageAttributes);
  });

  // Responsive image shortcode
  eleventyConfig.addShortcode("responsiveImage", async (src, alt, sizes = "(max-width: 768px) 100vw, 50vw") => {
    let metadata = await Image(src, {
      widths: [300, 600, 900, 1200, 1800],
      formats: ["avif", "webp", "jpeg"],
      outputDir: "_site/assets/img/",
      urlPath: "/assets/img/"
    });

    let imageAttributes = {
      alt,
      sizes,
      loading: "lazy",
      decoding: "async",
    };

    return Image.generateHTML(metadata, imageAttributes);
  });
}
