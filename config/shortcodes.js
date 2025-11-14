module.exports = (eleventyConfig) => {
  eleventyConfig.addShortcode("year", () => new Date().getFullYear());
};

