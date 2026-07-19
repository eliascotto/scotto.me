---
title: "A Road to Lisp: Which Lisp"
description: Comparison of modern Lisp dialects
date: 2026-07-17
tags:
 - posts
 - lisp
 - a-road-to-lisp
---

Most programming languages evolve as a single language. Python, Java, Javascript, C++, have new versions and standards, multiple implementations, but they still remain the same language. C and C++ can be compiled with GCC or Clang, Python can be compiled with CPython or PyPy, the same JavaScript runs in both Firefox and Chrome, and Java programs can run on JVM or GraalVM.

Lisp is not like that.

![[Lisp Logo]](/assets/img/lisp-logo.svg "Lisp logo, NASA version.")

The [Wikipedia](https://en.wikipedia.org/wiki/Lisp_(programming_language)) page lists more than 20 different *dialects*, which means there are many variations to choose from. That’s because **Lisp is a *family* of programming languages**. They share the same fundamental syntax but differ in their operators, semantics, standard libraries, and language capabilities.

One of the main concerns Lisp beginners have is which dialect to learn first. I see this question frequently asked in online forums. The answer is that the dialect matters, but not as much as a beginner might think. Learning Lisp is about learning a new type of programming. **A new way of thinking about problems using code.** You will learn the fundamental concepts with any dialect. Then, once you have learned one, it will be relatively easy to switch to another.

I will briefly present the most relevant dialects that are actively used and maintained. I’ll try to highlight their strengths and weaknesses to help you overcome your indecision and pick one to start your Lisp journey. 

If you are a beginner, many of the concepts in this article might be completely new to you. Don’t worry too much about them yet. When I was a beginner, I found many of these concepts fascinating and they pushed me to learn more about the Lisp world.

## Common Lisp

Abbreviated as CL, it is the most mature and comprehensive of all Lisp dialects. It’s considered the old-school Lisp, since the language — I will call it a _language_ from now on — was standardised in 1994 with a formal ANSI specification. Thanks to this standardisation, there are multiple implementations of Common Lisp targeting different platforms and use cases.

The most famous implementation is _SBCL_, which compiles directly to native code. It is fast, open-source, and compatible with modern hardware. With it, well-written Common Lisp code can achieve performance comparable to C and Rust. Because SBCL optimises heavily, it compiles a bit more slowly than other implementations but generates some of the fastest code in the Lisp family.

![[Common Lisp Logo]](/assets/img/common-lisp-logo.svg "The Yin and Yang Common Lisp logo. The lambda symbol (λ) refer to lambda calculus invented by Alonzo Church.")

When I said above that Common Lisp is the most comprehensive dialect, I meant that it offers the broadest set of features among all Lisps. It provides a large amount of functionality out of the box, much of it defined directly in the standard. For example, CL has functions for controlling compilation and evaluation from within the language itself (`COMPILE`, `LOAD`, `EVAL`, `COMPILE-FILE`, and others). This means that I can use these functions in my code or at the REPL to tell the Lisp process to compile a function, load a file, or evaluate some code. CL also provides `DISASSEMBLE`, which lets you inspect the machine code generated for a compiled function.

Common Lisp has a condition and restart system, which is one of the most powerful way I ever saw to debug and inspect programs. If a condition occurs during execution, the Lisp process might stop and let you inspect the state of the program and its variables at that point in time. You can then choose to restart the program and maybe retry the operation, or ignore the condition and continue execution. This is also possible because the Common Lisp REPL is deeply integrated with the running system. If your program fails on a remote server, you can connect to its REPL and inspect the live process to understand what went wrong.

Common Lisp supports all major programming paradigms, like functional, imperative, metaprogramming, and object-oriented programming. It offers one of the most advanced object systems, called [CLOS](https://courses.cs.northwestern.edu/325/readings/clos.html), which supports features such as multiple dispatch and generic functions. This makes OOP more flexible than in common object-oriented languages such as Java or C++. It is also worth noting that Common Lisp is dynamically typed but has a rich and expressive type system with optional type declarations.

Standardisation means that the language is stable. The ANSI Common Lisp from 1994 is still the one in use today. Because of it, lispers rarely fall victim to _backward incompatibility_, and old Common Lisp code often still runs perfectly today. For example, if you go through old Lisp books such as [PAIP](https://github.com/norvig/paip-lisp) by Peter Norvig, published in 1991, you’ll find that much of the code still runs on modern implementations. With Common Lisp, you encounter far fewer of the incompatibilities typical of languages like Ruby and Python. Even Common Lisp libraries that haven’t been updated recently will often still run fine on your system because they don’t need to be continually adapted to new versions of the language.

Common Lisp lacks some conveniences that have become common in newer languages, such as concise literals for a wider variety of data structures, persistent immutable collections, lazy sequences and built-in general-purpose pattern matching. Common Lisp was designed in the 1980s by consolidating several existing Lisp dialects into a single language. Its designers chose to retain much of the syntax and patterns of those older dialects, making sure that existing Lisp programmers could adopt the language without having to learn a completely new syntax.


Common Lisp doesn’t have a central direction or corporate sponsor. The community is relatively small and spread across several implementations, projects and communication channels. It’s mostly made up of volunteers who help keep the language alive. It can be a bit difficult to find guides and help: tutorials are often either too simple or too advanced, and documentation is not always easy to find.

It’s currently used in [quantum computing](https://www.youtube.com/watch?v=svmPz5oxMlI) at [Rigetti Computing](https://www.rigetti.com/), and has been used at [Grammarly](https://www.grammarly.com/blog/engineering/running-lisp-in-production/) for its core grammar service and also powers [Google Flight Search](https://www.itasoftware.com/). Worth mentioning is [Kandria](https://codeberg.org/shirakumo/kandria), an open-source video game released on Steam and written entirely in Common Lisp. 

An interesting fact: Paul Graham originally wrote HackerNews in a custom Lisp dialect called Arc, based on Racket. Today, Daniel Gackle ([@dang](https://news.ycombinator.com/user?id=dang)) reimplemented it in Clarc, a Common Lisp implementation of Arc that runs on SBCL[^1], serving around 10 million pages per day.

### Where Common Lisp shines

CL compiles to native code on all major operating systems and can achieve fast execution, at the cost of slightly slower startup times, so it’s great for long-running processes. It offers one of the most powerful REPLs among Lisp dialects and can be considered, despite its steep learning curve, one of the fastest languages for writing solid software in a short time.

CL shines when you need to do research and prototyping with quick iterations, as in quantum computing, or when the specifications aren’t fully defined yet and change frequently, requiring the software to adapt quickly, as in startups. Paul Graham wrote a famous and inspiring [article](https://www.paulgraham.com/avg.html) about how Common Lisp helped his internet startup beat the competition.

### Learning resources

A good starting point is [A Road to Common Lisp](https://stevelosh.com/blog/2018/08/a-road-to-common-lisp/) by Steve Losh, which inspired me to write this series. One of the most accessible books for beginners is [Practical Common Lisp](https://gigamonkeys.com/book/) by Peter Seibel, which is available entirely online. It’s the best introduction to the language I’ve read, as the most important concepts are neatly separated into chapters. A more playful introduction is [Land of Lisp](http://landoflisp.com/), which uses funny characters and comics to teach programming through games. A more advanced book that I enjoyed is [On Lisp](https://www.paulgraham.com/onlisp.html) by Paul Graham, which is entirely dedicated to macros.

The best IDE support for CL is Emacs + [Sly](https://github.com/joaotavora/sly)/[Slime](https://slime.common-lisp.dev/) ([Doom](https://github.com/doomemacs/doomemacs) already has support for it) or Vim + [VLime](https://github.com/vlime/vlime). A weaker alternative is VSCode + [Alive](https://marketplace.visualstudio.com/items?itemName=rheller.alive).

One of the best resources for beginners is [The Common Lisp Cookbook](https://lispcookbook.github.io/cl-cookbook/), which has many up-to-date tutorials. For references and libraries, the [Awesome-CL](https://github.com/CodyReichert/awesome-cl) list is worth a look. I also printed my own copy of the [Common Lisp Quick Reference](http://clqr.boundp.org/) booklet, which can be faster than finding information in the CL [HyperSpec](https://www.lispworks.com/documentation/HyperSpec/Front/index.htm).

## Clojure

Rich Hickey created it during a sabbatical year, frustrated by clients refusing to let him use Common Lisp instead of Java and C# because they were concerned about compatibility and maintenance issues. So he decided to write a new Lisp language targeting the JVM, allowing it to access everything the Java ecosystem had built over decades and making it a practical language from the start. The deal is that Clojure provides the language, while the host platform — the JVM — provides the runtime.

Clojure compiles directly to JVM bytecode, which means it’s compatible with any codebase that runs on the JVM (Java, Kotlin, Scala). This compatibility means that Clojure can coexist with other JVM languages in the same codebase, use Java libraries directly, and access all the features the JVM offers, such as OS portability, garbage collection, a fast and optimised runtime, and so on.

Rich Hickey chose to target the JVM so that he didn't have to reinvent the wheel and build a new compiler for Clojure from scratch. Instead, he focused his efforts on reading research papers on language design and data structures, bringing some of the newest and most effective ideas into the language.

![[Clojure Logo]](/assets/img/clojure-logo.svg "The Clojure logo, designed by Tom Hickey, Rich's brother.")

The language at its core is composed of **pure functions operating on immutable data structures**. Instead of making mutable objects the primary way to represent changing state, it provides explicit mechanisms such as *atoms*, *refs* and *agents* for managing change. This design choice makes Clojure a _functional_ programming language. It supports object-oriented programming, but replaces class-based inheritance with abstractions such as protocols and multimethods. Also the syntax is more modern than Common Lisp’s, with richer literals, destructuring, and overall more compact code.

Clojure also comes with several new features. Its persistent data structures use structural sharing, making immutable updates efficient. It also uses lazy sequences, which allow computations to be performed only when their results are needed. It has strong support for concurrency through constructs such as *atoms*, *refs*, *agents* and *futures*, and provides *records* and custom data types when more structured data is needed. [EDN](https://github.com/edn-format/edn) (Extensible Data Notation) offers a simple extensible data format based on Clojure’s literals, a better lispy alternative to JSON, YAML and similar. Clojure doesn't have types, but `clojure.spec` can be used to describe, validate and generate data without introducing a static type system, useful in large applications.

Rich Hickey designed Clojure with the intention of prioritising stability, similar to what standardisation did for Common Lisp. Even though the language is actively developed, you don’t need to expect major deprecations when updating to a newer version, since the maintainers preserve backwards compatibility and mostly add new features through core libraries.

Since Clojure is designed to be hosted on other platforms, it can be ported to other runtimes, like the JavaScript engine that runs in your browser. _ClojureScript_ is a Clojure compiler that targets JavaScript rather than the JVM, so the same language can run on both the server and the browser. This means that Clojure can be used as a full-stack language.

The JVM integration is great, but it comes with some trade-offs. Error messages are contaminated with a lot of Java implementation details and aren’t always self-explanatory, so stack traces are not necessarily helpful when debugging issues. Java profilers like YourKit are compatible, but even there you will see a lot of Java classes, and it can be hard to map them back to the code you wrote.

In general you don’t need to know Java to learn Clojure. I didn’t know Java when I started and never had substantial problems because of that. However, knowing how to tweak the JVM can be helpful when doing performance tuning on the server.

The community around Clojure is small but active and happy to help newcomers pick up the language quickly. It’s known as _Clojurians_ and mostly hangs out on Slack, where you can also collaborate on open-source projects and find job opportunities.

Clojure is actively used by companies and startups around the world, and it’s probably the most widely used Lisp in production. Some big names include Nubank (one of the largest fintech companies in Latin America), which acquired Cognitect (the main sponsor of Clojure’s development), as well as Walmart, Netflix, Apple, Salesforce, Amazon, Cisco, and Grammarly.

### Where Clojure shines

Clojure shines in large software systems where the workload consists of a lot of data processing, or more broadly, anywhere you might previously have picked Java. Code can be written and tested quickly through continuous iteration thanks to the REPL, making the language suitable for delivering reliable solutions in less time. Its immutable design helps eliminate some of the hardest concurrency bugs, while its functional orientation guides programmers towards writing programs as a series of data transformations.

Clojure is great in fields where operations need to happen quickly and often involve processing large sets of data, such as finance and trading. It’s also great for startups solving domain-specific problems with complex logic, since the language’s extensibility allows it to be modelled around the problem.

### Learning resources

To give Clojure a try, you might want to check out [Try Clojure](https://tryclojure.org/), then solve some exercises like the [Clojure Koans](http://clojurekoans.com/), followed by [4Clojure](https://4clojure.oxal.org/) for more advanced stuff.

The [official website](https://clojure.org/index) offers some of the most curated material you can find, with great explanations of all the core features and the motivations behind the design choices that make the language special. Clojure also has one of the best [documentation](https://clojuredocs.org/) websites I’ve ever found for a language. All the core library functions come with docstrings, and the community has added usage examples, so you can quickly grasp what each function does.

The best _pitch_ for the language is [Clojure Distilled](https://yogthos.net/ClojureDistilled.html). It’s probably one of the shortest explanations of what Clojure has to offer.

After the release of Clojure, Rich Hickey became famous for a series of talks about software design, in which he shared his deep expertise in fundamental topics like simplicity in software design, state and time, databases, concurrency, and language design. Some of his best talks — [_Simple Made Easy_](https://www.youtube.com/watch?v=SxdOUGdseq4), [_The Value of Values_](https://www.youtube.com/watch?v=-6BsiVyC1kM), [_Hammock-Driven Development_](https://www.youtube.com/watch?v=f84n5oFoZBc), [_Are We There Yet?_](https://www.youtube.com/watch?v=ScEPu1cs4l0), and [_Design, Composition, and Performance_](https://www.youtube.com/watch?v=QCwqnjxqfmY). I highly recommend spending some time watching them, whether you choose Clojure or not.

Some good books are [Clojure for the Brave and True](https://www.braveclojure.com/) by Daniel Higginbotham, which is free to read online and good for beginners. The one I bought is [The Joy of Clojure](https://www.amazon.com/dp/1617291412), which is recommended for programmers who come from OOP languages like Java.

For editors, VSCode has [Calva](https://calva.io/), a complete and rich extension for Clojure. If you use Emacs you can use [Cider](https://cider.mx/), plus there are extensions available for most editors/IDEs.

## Racket

[Racket](https://racket-lang.org/) is a modern dialect descended of _Scheme_. While other Scheme dialects are generally small languages, Racket has evolved into a fully featured language with its own unique features.

The code is compiled on every major platform and the language has been used in a lot of fields to create web applications, graphical interfaces, database integrations and mostly to quickly develop tools with graphics.

![[Racket Logo]](/assets/img/racket-logo.svg "Racket logo.")

Racket is **language-oriented**, which means it’s designed for creating [new programming languages](https://racket-lang.org/languages.html). Every source file begins with `#lang`, which defines the language used by that module. You can create entirely new languages with their own syntax and semantics, while still using the Racket ecosystem underneath. Other Lisp dialects can easily build DSLs, but they are tied to Lisp. Racket advances the concept by making it easy to define completely new languages, without requiring them to use Lisp syntax.

Racket also comes with a wide range of features. It includes libraries for cross-platform GUIs, web servers, concurrency and parallelism, regular expressions, pattern matching, classes and objects, and an FFI for calling C code. Its package manager is integrated into the ecosystem, and a large collection of libraries is immediately available. Compared with other Lisp dialects, there is generally less setup required before you can start building something substantial.

Racket offers an advanced macro system, providing the same kind of macro support as other dialects, plus hygienic macros. _Hygienic_ means that identifiers introduced by a macro don’t accidentally capture those in the surrounding code. This makes macros safer to write, especially for beginners, that don’t have to rely on `gensym` like in the other dialects.

Static typing is supported with [Typed Racket](https://docs.racket-lang.org/ts-guide/), a typed variant of the language that lets programmers add type annotations and have their code checked before execution. Typed and untyped Racket modules can also work together, so typing can be introduced where it is useful without requiring an entire program to be rewritten.

Even though Racket comes from the Scheme tradition and has strong functional programming roots, it supports multiple paradigms. Programs can be written using imperative programming, objects and classes, functional techniques, and metaprogramming.

The language installation comes with [DrRacket](https://docs.racket-lang.org/drracket/), a great IDE with everything ready to use the language, available on all major platforms. It combines an editor, REPL, and debugger, in a single programming environment for writing and testing Racket code.

The main downsides are its small ecosystem and limited use in the industry. There are fewer libraries, projects and jobs compared to more popular languages. Performance and deployment can also be weaker points, especially compared with other compiled dialects.

### Where Racket shines

Racket shines when designing new programming languages, building compilers and interpreters, or experimenting with new language features. This makes it particularly popular in computer science education and university research. Also, since it’s language-oriented, it’s a great choice when a program needs to provide a simple DSL, for example for customisation, without forcing the user to use a Lisp dialect.

Racket is ideal for prototyping, scripting, and projects where having a comprehensive set of libraries and development tools immediately available is important. It’s worth noting that other dialects offer GUI support through external libraries and wrappers, while in Racket it is available out of the box.

### Learning Resources

Racket has a rich website with a lot of helpful information. Important resources for beginners include [Quick: An Introduction to Racket with Pictures](https://docs.racket-lang.org/quick/) and [The Racket Guide](https://docs.racket-lang.org/guide/), which is the complete guide to the language. Also worth mentioning is [Beautiful Racket](https://beautifulracket.com/) by Matthew Butterick, a visually curated guide to the language written by a passionate contributor. If you’re looking to write a compiler, check out [this course](https://kmicinski.com/functional-programming/2025/11/23/build-a-language/) using Racket.

The best resource available for Scheme is [SICP](https://web.mit.edu/6.001/6.037/sicp.pdf), also known as the _Wizard Book_. It’s not only about Lisp, but it’s a great book for learning the fundamentals of programming and programming languages. It’s also worth mentioning a rather unusual book, [The Little Schemer](https://www.goodreads.com/en/book/show/548914.The_Little_Schemer), which consists of a long series of questions that forces the reader to think before looking at the answer on the page.

## Special Mention
### Elisp

[Elisp](https://learnxinyminutes.com/elisp/) is a specialised dialect that’s part of Emacs and is used to customise the editor. It’s an old Lisp dialect that comes with quite a few limitations, but it’s probably one of the best practical uses I’ve ever found for Lisp, beyond using it as a general-purpose programming language. It’s used to customise and extend the functionality of Emacs, since much of the editor itself is written in Elisp. By evaluating Elisp code inside it, you can change how Emacs looks and behaves in real time, without requiring a reload.

#### Learning resources

[An Introduction to Programming in Emacs Lisp](https://www.gnu.org/software/emacs/manual/eintr.html) is freely available online. Another useful resource is [Emacs Lisp Elements](https://protesilaos.com/emacs/emacs-lisp-elements) by Protesilaos Stavrou, an active Emacs contributor and advocate.

## Syntax comparison

We can use a simple instruction interpreter to show some of the syntactic differences between the dialects.

```lisp
(defun calculate (instructions)
  (loop with result = 0
        for (operation value) in instructions
        do (setf result
                 (case operation
                   (add      (+ result value))
                   (subtract (- result value))
                   (multiply (* result value))))
        finally (return result)))

(calculate '((add 5) (multiply 3) (subtract 4))) ;; => 11
```

In Common Lisp, I used the `LOOP` macro to iterate over and destructure each instruction, then perform the operation by updating local state. Notice that it carries an accumulator (`result`) through the sequence, essentially doing the same job as a `reduce`.

```clojure
(defn calculate [instructions]
  (reduce
    (fn [result [operation value]]
      (case operation
        :add      (+ result value)
        :subtract (- result value)
        :multiply (* result value)))
    0
    instructions))

(calculate [[:add 5] [:multiply 3] [:subtract 4]]) ;; => 11
```

In Clojure, I used a reduction over the sequence of instructions. Notice that it doesn’t use or update any local state, since the reduction uses immutable accumulation. I also used some syntax that is specific to Clojure, such as vectors `[]` and keywords like `:add`, and destructured the contents of each vector with `[operation value]`.

```racket
(define (calculate instructions)
  (for/fold ([result 0])
            ([instruction (in-list instructions)])
    (match instruction
      [(list 'add value)
       (+ result value)]
      [(list 'subtract value)
       (- result value)]
      [(list 'multiply value)
       (* result value)])))

(calculate '((add 5) (multiply 3) (subtract 4))) ;; => 11
```

In Racket, we use `for/fold` to iterate over the instructions while carrying the result from one iteration to the next. We also use pattern matching with `match` to destructure each instruction and identify the operation at the same time. For example, `(list 'add value)` matches a two-element list whose first element is the symbol `add` and binds the second element to `value`.

## Which one to pick?

To summarise the above:

- **Clojure** gives you modern syntax, functional programming and immutable data structures, great tooling and libraries, an almost drop-in replacement for Java, a full-stack language, a strong community, and maybe even a job.
- **Common Lisp** gives you native compilation, high performance, the most powerful REPLs, multi-paradigm programming, and a stable, battle-tested language.
- **Racket** gives you a feature rich language, a great IDE for beginners, a cross-platform GUI, a powerful platform for building new languages and DSLs, easily approachable for students.
- **Elisp** gives you the ability to extend and customise Emacs.

For most programmers looking for a practical and elegant Lisp they could use professionally, **Clojure is probably the safest first choice**.

If you want to experience the traditional Lisp development model at its fullest, you want native compilation without rely on JVM, an exceptionally interactive environment and a huge language, choose **Common Lisp**.

If you are a computer science student, interested in compilers and programming-language design, or if you need a quick way to write tools or need an easy way to use a cross-platform GUI, choose **Racket**. This is probably the easiest to start with between the dialects.

---

If you have any questions of feedback, please send me an email.

[^1]: https://news.ycombinator.com/item?id=41683969
