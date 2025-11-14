---
title: How to add a Clojure REPL to a web page
description: How I created TryClojure.org
date: 2023-03-24
tags:
 - clojurescript
 - SCI
---

One of the advantages of working with Clojure is that it can be used on top of the JVM as well as in the browser. This is possible thanks to the Clojurescript compiler, which takes your `.cljs` files and turns them into optimized Javascript with the help of the [Google Closure compiler](https://github.com/google/closure-compiler). The compilation is run during the project build stage, creating large `.js` files that will then be embedded into a webpage. Other than using the same language for backend and frontend development, a great advantage is that, in theory, you can even run Clojurescript directly in the client browser.

I got inspired after trying the cool project [Try Haskell](https://tryhaskell.org/) and it made me thinking about how I could replicate it, allowing users to try Clojure syntax in a REPL on a web page. So I started searching for a way to embed a working Clojure REPL in a small web app.

There are various way to achieve this. The old method was using the  [self-hosted cljs compiler](https://code.thheller.com/blog/shadow-cljs/2017/10/14/bootstrap-support.html), but there's a simpler approach. Thanks to SCI, the [Small Clojure Interpreter](https://github.com/babashka/sci) is now possible to write and execute Clojurescript code on top of Javascript; this means it can be executed in the browser.

You can *try* the Clojure REPL with a tutorial at [TryClojure.org](https://tryclojure.org/).

## SCI

The core of the app is the integration of SCI. It essentially provide a way to safely **evaluate** the strings that the user input in the REPL. I said "safe" since it creates a sandboxed environment where we can run our code. The Clojure interpreter runs directly in the browser's JavaScript engine, offering the same functionalities of the developer console.

We can create a SCI **context** by using the function `sci/init` with some initialization options.

```clojure
(ns app.sci
  (:require [sci.core :as sci]))
   
(defonce context (atom (sci/init init-opts)))
```

I'm, using an `atom` since it lets me add options during execution by updating the context, as shown in the following function.

```clojure
(defn extend-ctx
  "Extend default sci context merging `opts`."
  [opts]
  (reset! context (sci/merge-opts @context opts)))
```

I set a custom print function, by changing the default binding of `print-fn` for sci.

```clojure
(defn set-print-fn
  "Setup a custom `print-fn` for sci."
  [f]
  (sci/alter-var-root sci/print-fn (constantly f)))
```

I created a wrapper around `eval-string*` for better error management. The `error/error-handler` function prints errors to console along with the stacktrace. This is the core function of the app: SCI **evaluates a string** and returns the output of the execution.

```clojure
(defn eval-string
  "Evaluate `source` using the sci interpreter and return its output.
   If an error occurs during evaluation, raise an exception."
  [source]
  (try (sci/eval-string* @context source)
       (catch :default e
         (error/error-handler e (:src context))
         (let [sci-error? (isa? (:type (ex-data e)) :sci/error)]
           (throw (if sci-error?
                    (or (ex-cause e) e)
                    e))))))
```

## REPL

I created a custom function `write-repl!`, to print the evaluation output. It appends the value to a vector that stores the output history.

```clojure
(ns app.repl.core
  (:require [reagent.core :as r]
            [app.sci :as sci]))
  
(defonce repl-history (r/atom []))
  
(defn- write-repl!
  "Append `s` to the REPL history.
  Optional keyword `k` to use as a type."
  ([s]
   (write-repl! s :output))
  ([s k]
   (swap! repl-history conj {:type k :value s})))

(sci/set-print-fn (fn [s] (write-repl! s)))
```

I extended the context by adding a few functions to the `user` default namespace. This functions can be called in the REPL, and they're able to interact with the webpage. For example changing some environment variables like prompt symbol color, the current user name, or interacting with the tutorial steps.

```clojure
(sci/extend-ctx
 {:namespaces {'user {'start start-tutorial
                      'clear clear-repl
                      'restart restart-tutorial
                      'my-name set-name
                      'next-step inc-step!
                      'prev-step dec-step!
                      'set-step (when DEBUG set-step)
                      'set-prompt set-prompt
                      'more (fn [] true)
                      'help print-help}}})
```

For example the `clear-repl` function resets the history to an empty vector, returning `nil`.

```clojure
(defn clear-repl []
  (reset! repl-history [])
  nil)
```

All the Clojurescript code is evaluated using `eval-string`. The typical way to do this is when the user press "Enter" in the REPL HTML input element, but we can also use it to import an entire namespace.

```clojure
;; Import `repl` namespace helper functions 
(sci/eval-string "(require '[clojure.repl :refer :all])")
```

## Colophon

I released [TryClojure](https://tryclojure.org/) more than a year ago but I didn't write any content on how I made it. It's a frontend-only app served by Netlify, with no backend since all the code runs in the browser. I've used a few libraries to build the app. The build process is managed with [shadow-cljs](https://github.com/thheller/shadow-cljs), I've used [Tailwind](https://tailwindcss.com) for styles, and [Reagent](https://reagent-project.github.io/) for creating UI components.
