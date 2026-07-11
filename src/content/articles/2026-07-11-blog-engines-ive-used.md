---
title: Blog Engines I've Used
description: History of my blog engines
date: 2026-07-11
tags:
 - articles
 - blog
---

Since I got my first internet connection as a kid, I’ve spent more time setting up new blogs than actually writing them. It’s not surprising. Configuring the platform and adding features was the whole point, the fun part. Writing never interested me at the time, perhaps because I never felt the urgency to express myself and didn’t have anything relevant to say.

I’ve always used self-hosted solutions and learned the advantages and tradeoffs of using them, so I will summarise here each blog and platform I have used. I might not know much about writing a blog, but I’m sure I know a thing or two about the platforms that make a blog possible.

## WordPress

This was the first blog I opened many years ago, and I believe I wrote it in Italian. I was mostly translating some guides from English, or reposting tutorials taken from other blogs or forums. I got a few readers and comments, but it was never a serious project.

[WordPress](https://wordpress.org/) has been the main CMS for a lot of websites for decades, and still today power 40% of the web. In 2006-2008 the community around it was active, and a lot of plugins and themes were released, since PHP, the language that WordPress uses, it’s easy to learn and quick to be productive with. Plenty of guides were available, so creating a blog at the time was a matter of installing WordPress, connecting to the hosting space via FTP using [FileZilla](https://filezilla-project.org/), and then connecting a [MySQL](https://www.mysql.com/) database to it.

In those years, the LAMP stack (Linux, Apache, MySQL, PHP) was the foundational architecture used by most websites and communities, so it wasn’t surprising that WordPress got so much traction. There were so many plugins and themes that it didn’t take much to put a decent website online. Besides my own blog, I had to install and configure WordPress websites for other people, and every time things went smoothly enough. Even when I had to do some small customisations to a theme, it was quite quick to do, considering that I never learned PHP and my changes were done by guessing and testing.

The CMS that WordPress offers is top notch; I’ve never found one as good since. The editor is decent and includes an instant preview of the articles and theme changes. It’s so easy to use that even your noob uncle who needed a website was able to put one together with images without having to call you over for help.

Also, the plugin library that WordPress offers is large, and the plugin quality is quite decent. Most website owners at the time were worried about SEO, and it was just a matter of installing the right plugins to make sure the website was picked up by Google with the right keywords.

Since WordPress workes with a database, it offers simple integration to add comments to a website, with the Akismet spam filter plugin and other nice features like user login and Gravatar integration.

The main problem with WordPress is that by supporting so many features it became a huge monster, far more than what’s really needed for a simple blog. I started abandoning WordPress when Markdown became popular and static websites had their Renaissance.

## Jekyll

After PHP came the Ruby era in 2008. [Tom Preston-Werner](https://tom.preston-werner.com/), after releasing GitHub (written in Ruby) in April, got tired of having to deal with a database in WordPress to host a simple blog and decided to write a new blog engine called [Jekyll](https://jekyllrb.com/), also in Ruby.

Jekyll is much simpler to configure and to understand what is happening inside the blog. A new project consists of a configuration file and a folder structure. Posts are simple Markdown files, and the styles use [SASS](https://sass-lang.com/), which at the time was more advanced than plain CSS. The pages are composed of layouts and smaller reusable components. For rendering the pages, Jekyll uses the [Liquid](https://shopify.github.io/liquid/) template engine, which allow the use of variables, conditionals, and loops alongside normal HTML tags. When my blog was ready to be served, I just needed to run the CLI command to build the project, and the compiled website was saved into the output directory.

Jekyll is a platform that mostly targets blogs. There are many plugins available that extended what is possible to put into posts and how the content is indexed. Plus, GitHub got popular and enabled the possibility to host a website directly on their platform. So publishing with Jekyll is a matter of pushing the updates to the repo, and the continuous integration would then run the build and serve the output directory.

Jekyll served my needs for a longer period than any other platform. It was minimalist compared to WordPress and, in a way, made the components of a blog much more visible and in the hands of the developers, since most files were HTML, Markdown, and SCSS.

Then Ruby lost its momentum and got a bit out of fashion. I have to admit that at the time I didn’t know Ruby well, and a few times when I wanted to change some plugins I ended up not doing it because of the language barrier. I didn’t abandon Jekyll because of that, but because the community itself got a bit smaller and less vibrant, probably because a part of it migrated to other platforms (or stopped blogging).

## Org mode publish

When I learned [Emacs](https://www.gnu.org/savannah-checkouts/gnu/emacs/emacs.html), I discovered the most advanced file format integration with an editor: [org](https://orgmode.org/). If you don’t know it, think of it as a more powerful Markdown with a series of shortcuts and extensions that make editing really fast and transform a directory of files into a perfect organisational system for your personal information.

Org comes with a publishing management system, which is a way to export a series of org files into HTML, with certain output configurations for directories and templating. It’s a static site generator that converts org files to HTML, similar to what Jekyll was doing with .md files. Once the project is configured with some Elisp code, saving a file in Emacs and running a command was enough for publishing changes to my Org-mode blog.

Since org is an advanced file format, the publishing came with some nice features too, like title links, dates, and automatic sitemap generation.

The difficulty is that org publish is more a system for converting files rather than producing a blog. So features like layouts, SASS for stylesheets, RSS feeds, a public folder for static files, they all needed a special Elisp configuration to be written and maintained.

It didn’t take me long to adapt some Elisp code to fit my project, but after making a few changes to the directory structure, every time the build was failing and I had to debug what was happening. It wasn’t ideal. Plus, features like image compression or integrating a search would have been hard to implement.

So, as usually happens with complex configurable systems, after having fun customising the whole setup, I got bored, since org publish wasn’t really what I would consider practical for a personal blog. Just my personal taste.

## 11ty

I finally found a static site generator written entirely in JS, so I wrote my blog in [11ty](https://www.11ty.dev/). It’s another pretty good system for creating static websites.

I found it a bit tricky to find official documentation for certain features, but I was able to integrate and customise my blog exactly how I wanted and write the plugins I needed in quite a short time.

Honestly, I don’t have much to say about 11ty. It’s a good alternative to Jekyll, and it uses Javascript, so if you know the language it becomes easy to customise. It’s actively supported and used on the web, so I recommend checking it out if you are looking for a blog platform.

What got me a bit frustrated is that I ended up having a large JS file with all the configuration required, and when I had to change some structure in my blog — for example, adding support for Italian/English translations to certain articles — the configuration file got a bit bloated.

## Astro

[Astro](https://astro.build/) is probably the definitive static site generator I’m using today. This blog moved from 11ty to Astro without even being noticeable, and I’ve used it in a few other projects where I needed a static site generator. I’ve even tried using [DecapCMS](https://decapcms.org/) with it, so that a friend was able to write pages and add images directly by pushing to the GitHub repo, avoiding the need for a database.

Astro has pretty much all I want for a blog: asset optimisation, partial hydration with islands, advanced templating, and variable support. Also, Astro uses **single-file components** to define pages, so that HTML, JS, and CSS that share the same scope are placed in a single file, like Vue does. Pretty neat, and it makes the code easy to organise and reuse. It also extensible using Javascript and offers an high level of customisation and a set of libraries to integrate more features.

## What I look for now

After all this, here's what I now consider essential for a blog engine:
- support for Markdown, since I write everything in Obsidian
- sensible defaults for common features like RSS and asset optimisation
- a healthy plugin ecosystem for when I need to extend things
- easy customisation

I hope Astro stays around for a long time. I'd rather not migrate again and instead spend that time on what actually matters: the writing.
