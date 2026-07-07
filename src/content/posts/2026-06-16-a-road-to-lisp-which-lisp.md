---
title: "A Road to Lisp: Which Lisp"
description: "Comparison of Lisp dialects"
date: 2026-06-16
tags:
 - posts
 - common-lisp
 - clojure
---

Most programming languages come in a single dialect. You just have to learn the language once, and the toolchains will be compatible with it. Your C/C++ code can be compiled with GCC and Clang, Javascript runs the same in Firefox and Chrome, Java runs on OpenJDK or GraalVM. Lisp is not like that.

The [Wikipedia page](https://en.wikipedia.org/wiki/Lisp_(programming_language)) shows more than 20 different dialects, which means there are many syntactic variations for writing code with it. That’s because Lisp is a *family* of programming languages, not a single one. They share the same fundamental syntax, but operators, special forms, standard libraries and capabilities are different.

In this article I’ll present the most relevant dialects, mostly *Common Lisp* and *Clojure*, and try to highlight their strengths and weaknesses to give an idea on which one might be the best to pick for beginners.

## Common Lisp

Abbreviated CL, it’s considered the old-school Lisp. It’s the most mature and powerful among the Lisps, and the language was standardised in the 90s. This means that there are multiple compatible implementations for it, which usually target different platforms and use cases.

The most famous implementation is *SBCL*, which compiles directly into native code. It is fast, open-source and compatible with modern hardware, so that good Common Lisp code is capable of performance comparable to C and Rust. SBCL optimises heavily, it compiles a bit slower than other implementations, but generates some of the fastest code of any Lisp.

![Common Lisp Logo](/assets/img/icons8-lisp.svg)

Common Lisp is the most powerful dialect in the family because it offers the richest standard library, which means it has functions to do almost everything. It also has the most evolved system for condition/restart I’ve seen in any other language, which means that if your program encounters a condition (an error) it will stop and let you debug from that point in time, and then restart the program or continue the execution.

Common Lisp supports most of the programming paradigms: functional, imperative, generic programming, metaprogramming and even OOP. It offers arguably the most advanced object system, called [CLOS](https://courses.cs.northwestern.edu/325/readings/clos.html), which is more expressive than Java or C#.

The Common Lisp REPL is also the most deeply integrated in the Lisp family. You can decompile functions and read the assembly code in it, or check the state of your entire program when a condition is raised, without the need for a debugger. So if your program fails on a server, you can connect the REPL to it and understand why it failed.

The language standardisation means that the syntax never changes. Programmers can avoid falling victim to *backward incompatibility* because old Common Lisp code still runs today. For example, if you decide to go through the code of a Lisp book like [PAIP](https://github.com/norvig/paip-lisp) written by Peter Norvig in 1991, you'll find it still runs today. With Common Lisp, you can forget about broken dependencies and version incompatibility typical of JS or Ruby projects. Even Common Lisp libraries not recently updated are probably still running fine on your system.

One of the downsides of standardisation is that Common Lisp lacks modern features and syntax. Things like common constructs for modern data structures, lazy sequences, built-in pattern matching, and an easy way to do variable destructuring. Lisp's history goes back to the '60s, when its designers chose to retain part of the syntax and the patterns of older dialects, trying to consolidate them into a single language. So the syntax ended up being constrained by backward compatibility, to make sure programmers would have an easy way to adopt the language without having to re-learn a completely new syntax.

It also lacks support for concurrency and parallelism, a package manager, modern data structures, and so on. But most of these missing features have been integrated into the language using external libraries maintained by the community. For example concurrency with *Bordeaux Threads*, a package manager called *QuickLisp*, more extensions for the standard library like *Alexandria* and better OS interface with *UIOP*, regex support with *CL-PPCRE*, and a lot of other libraries and wrappers. Also, Common Lisp comes with _CFFI_, an interface for calling C code from Common Lisp, useful for interfacing with existing APIs and libraries, or for cases where critical performance prohibits the use of Common Lisp's garbage collector.

Common Lisp doesn't have a central direction or company sponsors. The community is small and fractured and mostly run by volunteers, which help keeping the language alive. It might be a bit difficult to find guides and help, often certain content is too simple or too hard, and documentation is not always easy to find or [free to use](https://www.reddit.com/r/lisp/comments/36kkdc/copyright_on_hyperspec/).

In recent years there have not been many large projects using Common Lisp, since a large part of the software world transitioned to web development, a field that came to be dominated by other languages. It’s currently used in [quantum computing](https://www.youtube.com/watch?v=svmPz5oxMlI) for virtual machines and compilers, famously at [Rigetti Computing](https://www.rigetti.com/), and it has been used at [Grammarly](https://www.grammarly.com/blog/engineering/running-lisp-in-production/) for its core grammar service. Worth mentioning is [Kandria](https://codeberg.org/shirakumo/kandria), an open-source videogame released on Steam written entirely in Common Lisp by [Shinmera](https://raw.githubusercontent.com/Shinmera/talks/master/els2023-kandria/paper.pdf) and the [Shirakumo](https://shirakumo.org/) team. Interesting fact: Paul Graham wrote [Hacker News](https://news.ycombinator.com/) in a custom Lisp dialect called Arc, which today runs on Common Lisp’s SBCL[^1], serving ~10M pages per day.

### Where Common Lisp shines

CL is compiled natively on all major operating systems and can achieve fast execution, at the cost of a slightly slower startup, so it's great for long-running processes. It offers the most powerful REPL among the Lisp dialects and can be considered, despite its steep learning curve, one of the fastest languages for writing solid software in a short time. So CL shines when you need to do research and prototyping with quick iterations, as in quantum computing, or where the specifications aren’t fully defined yet and change frequently, requiring the software to adapt fast, as in startups. [Paul Graham](https://www.paulgraham.com/avg.html) wrote a famous and inspiring article on how Common Lisp helped his internet startup beat the competition.

### Learning resources

A good starting point is [A Road to Common Lisp](https://stevelosh.com/blog/2018/08/a-road-to-common-lisp/) by Steve Losh, which inspired me to write this article. To write CL you need an IDE with support for it, like Emacs + [Sly](https://github.com/joaotavora/sly) ([Doom](https://github.com/doomemacs/doomemacs) already has support for it) or Vim + [VLime](https://github.com/vlime/vlime). A weaker alternative is VSCode + [Alive](https://marketplace.visualstudio.com/items?itemName=rheller.alive).

One of the most accessible books for beginners is [Practical Common Lisp](https://gigamonkeys.com/book/) by Peter Seibel, which is entirely available online. It’s the best introduction to the language and can also work as a reference, since the most important concepts are neatly separated into chapters. A more playful introduction is [Land of Lisp](http://landoflisp.com/), which uses some funny characters and comics to explain game programming. A more advanced book I enjoyed is [On Lisp](https://www.paulgraham.com/onlisp.html) by Paul Graham, entirely dedicated to the *macro* system.

The online language reference is [The Common Lisp Cookbook](https://lispcookbook.github.io/cl-cookbook/) which receives good updates and tutorials. For references and libraries, the [Awesome-CL](https://github.com/CodyReichert/awesome-cl) list is also worth a look.

## Clojure

Rich Hickey created it during a sabbatical year, frustrated by clients refusing to let him use Common Lisp instead of Java and C#, as they were too afraid of compatibility and maintenance issues. So he decided to write a new Lisp language targeting the JVM, since he could access everything the Java ecosystem built over decades and so make a useful language. The deal is that Clojure provides the language, the host platform provides the runtime.

Clojure compiles directly to bytecode, which means it's compatible with any codebase that runs on the JVM (Java, Kotlin, Scala). The compatibility means that Clojure can coexist with another JVM language in the same codebase, use the same Java libraries directly, access all the features the JVM offers, like OS portability, a garbage collector, and a fast, optimised runtime for execution, and so on. 

Rich Hickey chose to target the JVM so he didn't have to reinvent the wheel and write a new compiler for his Lisp. Instead he focused his energies on studying the latest research on language design and data structures, bringing the most effective discoveries into the language.

![Clojure Logo](/assets/img/Clojure_logo.svg)

The language at its core is composed of *pure functions operating on immutable data structures*. This design choice made Clojure a *functional* programming language, but with the addition of OOP constructs like *multimethods* and *protocols*. Rich Hickey rejected class-based inheritance and mutable state, the primary modelling tools of Java and C#, in favour of constructs closer to Common Lisp's CLOS and Smalltalk. The syntax is more modern that Common Lisp, with richer literals, destructuring and overall a more compact code.

Rich Hickey explicitly designed Clojure with the intention to prioritise stability, similarly to what made Common Lisp gain its reliability. Even though the language has not been standardised and it’s actively developed, you don't need to expect large deprecations when updating to a newer version since the maintainers keep backwards compatibility in place, and mostly add features via new core libraries.

Since Clojure is designed to be hosted on other platforms, it can be ported to other virtual machines, like the one that runs Javascript in your browser. ClojureScript is a Clojure compiler that targets JavaScript (rather than JVM), so the same language runs on both server and browser. This means that Clojure can be used full-stack in the same project.

The JVM integration is great, but comes with some tradeoffs. The error messages are contaminated with a lot of Java’s implementation classes and aren’t really self-explanatory, so the stack trace is not always helpful to debug issues. Java profilers like YourKit are compatible, but even there you will see a lot of Java classes and it can be hard to map them to the code you wrote.

You don’t need to know Java to learn Clojure. I didn’t know Java when I started and never had problems with that, but some JVM compilation parameters might be helpful to do performance tuning on the server.

The community around Clojure is small but active, and happy to help newcomers pick up the language quickly. It’s called *Clojurians* and mostly hangs around on Slack, where you can collaborate on projects and also find work offers.

Clojure is actively used by companies and startups around the world, and it’s probably the most widely used Lisp in production. Some large names are NuBank (one of the largest fintech bank in Latin America), Walmart, Netflix, Apple, Salesforce, Amazon, Cisco, and Grammarly.
### Where Clojure shines

Clojure shines in large backends where the workload consists of a lot of data processing, or more broadly, anywhere you would previously have picked Java. Code can be written and tested quickly in continuous iteration thanks to the REPL, and this makes the language suitable for delivering reliable solutions in less time. Its immutable design helps eliminate some of the hard concurrency bugs, and the functional orientation guides the programmer to write programs as a series of data transformations. Clojure shines in fields where operations need to happen quickly and often involve processing large sets of data, like finance and trading. It’s also great for startups to solve domain-specific problems with complex logic since the language’s extensibility allows it to be modelled around the problem.

### Learning resources

Clojure was my first Lisp; I picked it over Haskell when looking for a new language to learn. My method of judging was creating a Brainfuck interpreter in both languages and then choosing the one I felt more drawn to — a bit naïve as an approach, but it worked. Clojure grabbed my attention for how it worked, progressively deriving the new state in a recursive loop, until a condition was met that triggered the end. From that point, I had to dig deeper and deeper into this strange language, to understand what its benefits were.

To give Clojure a try, you might want to check out [TryClojure](https://tryclojure.org/) and then solve some exercises like [Clojure Koans](http://clojurekoans.com/) and then [4Clojure](https://4clojure.oxal.org/) for more advanced stuff. The [official website](https://clojure.org/index) offers the most curated material you can find, with great explanations of all the core features and motivations behind the design choices that helped make the language special. Clojure also has one of the best [documentation](https://clojuredocs.org/) websites that I’ve ever found for a language, since all the core library functions come with docstrings, and the community added usage examples so you can quickly grasp what each method is about. The best *pitch* for the language is [Clojure Distilled](https://yogthos.net/ClojureDistilled.html) by Dmitri Sotnikov. Even if it’s a bit hard to grasp all the concepts in one go, it’s probably one of the shortest explanations of what Clojure offers.

After the release of Clojure, Rich Hickey became famous for a series of talks about software design, in which he showed deep expertise in fundamental topics like simplicity in software design, state and time, databases, concurrency, and language design. Some of his best talks, [*Simple Made Easy*](https://www.youtube.com/watch?v=SxdOUGdseq4), [*The Value of Values*](https://www.youtube.com/watch?v=-6BsiVyC1kM), [*Hammock-Driven Development*](https://www.youtube.com/watch?v=f84n5oFoZBc), [*Are We There Yet?*](https://www.youtube.com/watch?v=ScEPu1cs4l0), [*Design, Composition, and Performance*](https://www.youtube.com/watch?v=QCwqnjxqfmY) are easy to find on YouTube. I highly recommend spending time watching them to better understand the decisions that went into Clojure, and also to learn how a great thinker thinks about programming. To quote Alan Kay, *a point of view is worth 80 IQ points*, and Hickey's talks are valuable precisely because they give you a handful of new points of view.

Some good books are [Clojure for the Brave and True](https://www.braveclojure.com/) by Daniel Higginbotham, which is free to read online and good for beginners. The one I bought is [The Joy of Clojure](https://www.amazon.com/dp/1617291412), which is recommended for programmers who come from OOP languages like Java.

For editors, VSCode has [Calva](https://calva.io/), a batteries-included extension for Clojure. If you use Emacs you can try [Cider](https://cider.mx/), but there are extensions for most editors/IDEs anyway.

## Special mentions

Other relevant dialects are *Racket* and *Elisp*. [Racket](https://racket-lang.org/) is particularly appreciated by universities and researchers. I’ve tried [DrRacket](https://docs.racket-lang.org/drracket/) and it’s a good IDE with everything ready to use the language on every platform, plus there are libraries for writing GUI programs quickly. I’ve read that it is a Lisp designed specifically for creating new programming languages and compilers (I found a [compiler course](https://kmicinski.com/functional-programming/2025/11/23/build-a-language/) done with it), but never had the chance to explore it yet.

 [Elisp](https://learnxinyminutes.com/elisp/) is a small dialect that’s part of Emacs, and it’s used to customise the IDE. It’s an old Lisp dialect that comes with quite a few limitations, but it’s probably one of the best practical uses I’ve ever found for Lisp, other than as a programming language. It’s used for customising and extending functionalities of the IDE since most of Emacs is written in Elisp. Actually Emacs is a running Lisp image that can be programmed live. By evaluating Elisp code inside it, you can change how Emacs looks and behaves in real time, without any reload required. Quite impressive if you think that Emacs was born in the 80s. Extensions for the IDE are easy to write, since you can write the code, test it live and then publish it online.

## Which one to pick?

To summarise the above:
- **Clojure** gives you modern syntax, functional and immutable data structures, great tooling and libraries, an almost drop-in replacement for Java, full-stack language, a strong community and maybe a job.
- **Common Lisp** gives you native compiled binaries, performance, most powerful REPL, a stable and battle-tested language.
- **Racket** gives you a pedagogical language, an IDE great for beginners.
- **Elisp** gives you the possibility to extend Emacs, ad infinitum.

So as a beginner the best choice overall might be Clojure, but really depends what your goals are.

I try to read all emails I receive, so feel free to contact me for feedbacks, questions and suggestions.

[^1]: https://news.ycombinator.com/item?id=41683969
