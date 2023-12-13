//
// Syntax highlight with PrismJS
// Added Clojure, lisp, e-lisp
//
module.exports = {
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


    /**
     * Functions to construct regular expressions
     * e.g. (interactive ... or (interactive)
     *
     * @param {string} name
     * @returns {RegExp}
     */
    function simple_form(name) {
      return RegExp(/(\()/.source + '(?:' + name + ')' + /(?=[\s\)])/.source);
    }
    /**
     * booleans and numbers
     *
     * @param {string} pattern
     * @returns {RegExp}
     */
    function primitive(pattern) {
      return RegExp(/([\s([])/.source + '(?:' + pattern + ')' + /(?=[\s)])/.source);
    }

    // Patterns in regular expressions

    // Symbol name. See https://www.gnu.org/software/emacs/manual/html_node/elisp/Symbol-Type.html
    // & and : are excluded as they are usually used for special purposes
    var symbol = /(?!\d)[-+*/~!@$%^=<>{}\w]+/.source;
    // symbol starting with & used in function arguments
    var marker = '&' + symbol;
    // Open parenthesis for look-behind
    var par = '(\\()';
    var endpar = '(?=\\))';
    // End the pattern with look-ahead space
    var space = '(?=\\s)';
    var nestedPar = /(?:[^()]|\((?:[^()]|\((?:[^()]|\((?:[^()]|\((?:[^()]|\([^()]*\))*\))*\))*\))*\))*/.source;

    var language = {
      // Three or four semicolons are considered a heading.
      // See https://www.gnu.org/software/emacs/manual/html_node/elisp/Comment-Tips.html
      heading: {
        pattern: /;;;.*/,
        alias: ['comment', 'title']
      },
      comment: /;.*/,
      string: {
        pattern: /"(?:[^"\\]|\\.)*"/,
        greedy: true,
        inside: {
          argument: /[-A-Z]+(?=[.,\s])/,
          symbol: RegExp('`' + symbol + "'")
        }
      },
      'quoted-symbol': {
        pattern: RegExp("#?'" + symbol),
        alias: ['variable', 'symbol']
      },
      'lisp-property': {
        pattern: RegExp(':' + symbol),
        alias: 'property'
      },
      splice: {
        pattern: RegExp(',@?' + symbol),
        alias: ['symbol', 'variable']
      },
      keyword: [
        {
          pattern: RegExp(
            par +
              '(?:and|(?:cl-)?letf|loop|cond|cons|error|if|(?:lexical-)?let\\*?|message|not|null|or|provide|require|setq|setf|unless|nth|push|use-package|when|while)' +
              space
          ),
          lookbehind: true
        },
        {
          pattern: RegExp(
            par + '(?:append|by|collect|concat|do|finally|for|in|return)' + space
          ),
          lookbehind: true
        },
      ],
      declare: {
        pattern: simple_form(/declare/.source),
        lookbehind: true,
        alias: 'keyword'
      },
      interactive: {
        pattern: simple_form(/interactive/.source),
        lookbehind: true,
        alias: 'keyword'
      },
      boolean: {
        pattern: primitive(/nil|t/.source),
        lookbehind: true
      },
      number: {
        pattern: primitive(/[-+]?\d+(?:\.\d*)?/.source),
        lookbehind: true
      },
      defvar: {
        pattern: RegExp(par + 'def(?:const|custom|group|parameter|var)\\s+' + symbol),
        lookbehind: true,
        inside: {
          keyword: /^def[a-z]+/,
          variable: RegExp(symbol)
        }
      },
      defun: {
        pattern: RegExp(par + /(?:cl-)?(?:defmacro|defun\*?)\s+/.source + symbol + /\s+\(/.source + nestedPar + /\)/.source),
        lookbehind: true,
        greedy: true,
        inside: {
          keyword: /^(?:cl-)?def\S+/,
          // See below, this property needs to be defined later so that it can
          // reference the language object.
          arguments: null,
          function: {
            pattern: RegExp('(^\\s)' + symbol),
            lookbehind: true
          },
          punctuation: /[()]/
        }
      },
      lambda: {
        pattern: RegExp(par + 'lambda\\s+\\(\\s*(?:&?' + symbol + '(?:\\s+&?' + symbol + ')*\\s*)?\\)'),
        lookbehind: true,
        greedy: true,
        inside: {
          keyword: /^lambda/,
          // See below, this property needs to be defined later so that it can
          // reference the language object.
          arguments: null,
          punctuation: /[()]/
        }
      },
      car: {
        pattern: RegExp(par + symbol),
        lookbehind: true
      },
      punctuation: [
        // open paren, brackets, and close paren
        /(?:['`,]?\(|[)\[\]])/,
        // cons
        {
          pattern: /(\s)\.(?=\s)/,
          lookbehind: true
        },
      ]
    };

    var arg = {
      'lisp-marker': RegExp(marker),
      'varform': {
        pattern: RegExp(/\(/.source + symbol + /\s+(?=\S)/.source + nestedPar + /\)/.source),
        inside: language
      },
      'argument': {
        pattern: RegExp(/(^|[\s(])/.source + symbol),
        lookbehind: true,
        alias: 'variable'
      },
      rest: language
    };

    var forms = '\\S+(?:\\s+\\S+)*';

    var arglist = {
      pattern: RegExp(par + nestedPar + endpar),
      lookbehind: true,
      inside: {
        'rest-vars': {
          pattern: RegExp('&(?:body|rest)\\s+' + forms),
          inside: arg
        },
        'other-marker-vars': {
          pattern: RegExp('&(?:aux|optional)\\s+' + forms),
          inside: arg
        },
        keys: {
          pattern: RegExp('&key\\s+' + forms + '(?:\\s+&allow-other-keys)?'),
          inside: arg
        },
        argument: {
          pattern: RegExp(symbol),
          alias: 'variable'
        },
        punctuation: /[()]/
      }
    };

    language['lambda'].inside.arguments = arglist;
    language['defun'].inside.arguments = Prism.util.clone(arglist);
    language['defun'].inside.arguments.inside.sublist = arglist;

    Prism.languages.lisp = language;
    Prism.languages.elisp = language;
    Prism.languages.emacs = language;
    Prism.languages['emacs-lisp'] = language;
  },
};