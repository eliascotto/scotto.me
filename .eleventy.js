const luxon = require("luxon")
const slug = require("@11ty/eleventy/src/Filters/Slug")
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight")
const pluginRss = require("@11ty/eleventy-plugin-rss")

const markdownIt = require("markdown-it")
const markdownItAnchor = require('markdown-it-anchor')
const markdownItFootnote = require("markdown-it-footnote")
const markdownItImageFigures = require('markdown-it-image-figures')

module.exports = function(eleventyConfig) {
  // Add alias for layouts
  eleventyConfig.addLayoutAlias('page', 'layouts/page')
  eleventyConfig.addLayoutAlias('article', 'layouts/article')

  // RSS
  eleventyConfig.addPlugin(pluginRss)

  // Make it possible to set the "post" tag in the "post.njk" layout while still assigning further tags in the individual post.
  // https://www.11ty.dev/docs/data-deep-merge/
  eleventyConfig.setDataDeepMerge(true)

  // Date filters
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
      return properTags.map(tag => `<a href="/tags/${slug(tag)}">#${tag}</a>`).join(", ")
    }
  })

  // Filter tags and return a string of html list elements
  eleventyConfig.addFilter("tagsListHtml", (obj) => {
    return Object.keys(obj)
                 .filter(tag => tag !== 'all' && tag !== 'posts')
                 .map(tag => `<li class="my-1.5"><a href="/tags/${slug(tag)}">#${tag}</a></li>`)
                 .join("")
  })

  //
  // Syntax highlight with PrismJS
  //
  eleventyConfig.addPlugin(syntaxHighlight, {
    init: ({ Prism }) => {
      // Prism require languages to be added
      Prism.languages.clojure = {
        'comment': /;+[^\r\n]*(\r?\n|$)/g,
        'string': /(")(\\?.)*?\1/g,
        'operator ': /(::|[:|'])\b[a-zA-Z][a-zA-Z0-9*+!-_?]*\b/g, //used for symbols and keywords
        'keyword': {
            pattern: /([^\w+*'?-])(def|if|require|atom|swap!|reset!|do|let|quote|var|fn|loop|recur|throw|try|monitor-enter|\.|new|set!|def\-|defn|defn\-|defmacro|defmulti|defmethod|defstruct|defonce|declare|definline|definterface|defprotocol|defrecord|deftype|defproject|ns|\*|\+|\-|\->|\/|<|<=|=|==|>|>=|\.\.|accessor|agent|agent-errors|aget|alength|all-ns|alter|and|append-child|apply|array-map|aset|aset-boolean|aset-byte|aset-char|aset-double|aset-float|aset-int|aset-long|aset-short|assert|assoc|assoc-in|await|await-for|bean|binding|bit-and|bit-not|bit-or|bit-shift-left|bit-shift-right|bit-xor|boolean|branch\?|butlast|byte|cast|char|case|children|class|clear-agent-errors|comment|commute|comp|comparator|complement|concat|conj|cons|constantly|cond|if-not|construct-proxy|contains\?|count|create-ns|create-struct|cycle|dec|deref|difference|disj|dissoc|distinct|doall|doc|dorun|doseq|dosync|dotimes|doto|double|down|drop|drop-while|edit|end\?|ensure|eval|every\?|false\?|ffirst|file-seq|filter|find|find-doc|find-ns|find-var|first|float|flush|for|fnseq|frest|gensym|get-proxy-class|get|get-in|hash-map|hash-set|identical\?|identity|if-let|import|in-ns|inc|index|insert-child|insert-left|insert-right|inspect-table|inspect-tree|instance\?|int|interleave|intersection|into|into-array|iterate|join|key|keys|keyword|keyword\?|last|lazy-cat|lazy-cons|left|lefts|line-seq|list\*|list|load|load-file|locking|long|loop|macroexpand|macroexpand-1|make-array|make-node|map|map-invert|map\?|mapcat|max|max-key|memfn|merge|merge-with|meta|min|min-key|name|namespace|neg\?|new|newline|next|nil\?|node|not|not-any\?|not-every\?|not=|ns-imports|ns-interns|ns-map|ns-name|ns-publics|ns-refers|ns-resolve|ns-unmap|nth|nthrest|or|parse|partial|path|peek|pop|pos\?|pr|pr-str|print|print-str|println|println-str|prn|prn-str|project|proxy|proxy-mappings|quot|rand|rand-int|range|re-find|re-groups|re-matcher|re-matches|re-pattern|re-seq|read|read-line|reduce|ref|ref-set|refer|rem|remove|remove-method|remove-ns|rename|rename-keys|repeat|replace|replicate|resolve|rest|resultset-seq|reverse|rfirst|right|rights|root|rrest|rseq|second|select|select-keys|send|send-off|seq|seq-zip|seq\?|set|short|slurp|some|sort|sort-by|sorted-map|sorted-map-by|sorted-set|special-symbol\?|split-at|split-with|str|string\?|struct|struct-map|subs|subvec|symbol|symbol\?|sync|take|take-nth|take-while|test|time|to-array|to-array-2d|tree-seq|true\?|union|up|update-proxy|val|vals|var-get|var-set|var\?|vector|vector-zip|vector\?|when|when-first|when-let|when-not|with-local-vars|with-meta|with-open|with-out-str|xml-seq|xml-zip|zero\?|zipmap|zipper)(?=[^\w+*'?-])/g,
            lookbehind: true
        },
        'boolean': /\b(true|false)\b/g,
        'number': /\b-?(0x)?\d*\.?\d+\b/g,
        'punctuation': /[{}\[\](),]/g
      }
    },
  })



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

  md.use(markdownItFootnote)
    .use(markdownItAnchor, {
      level: 2,
      permalink: markdownItAnchor.permalink.headerLink(),
    })
    .use(markdownItImageFigures, {
      figcaption: true,
      lazy: true,
      async: true,
    })

  // Style the footnote
  md.renderer.rules.footnote_caption = (tokens, idx) => {
    let n = Number(tokens[idx].meta.id + 1).toString();

    if (tokens[idx].meta.subId > 0) {
      n += ":" + tokens[idx].meta.subId;
    }

    return n;
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
      includes: '_includes',
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  }
};
