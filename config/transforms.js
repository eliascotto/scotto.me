const fs = require("fs")
const path = require("path")
const CleanCSS = require("clean-css")

module.exports = (eleventyConfig) => {
  // Minify CSS after build
  eleventyConfig.on("afterBuild", () => {
    const inputDir = "src/assets/css"
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
}
