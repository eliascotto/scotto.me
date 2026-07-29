---
title: Shai-Hulud and the risks of external dependencies
description: Shai-Hulud code review
date: 2026-07-29
tags:
 - posts
 - malware
 - npm
 - "package managers"
---

[Shai-Hulud](https://www.akamai.com/blog/security-research/mini-shai-hulud-worm-returns-goes-public) is a malware created by TeamPCP that targeted *npm* to spread across the Node supply chain. Its name refers the giant [sandworms](https://en.wikipedia.org/wiki/Sandworm_(Dune)) that populate the desert planet Arrakis in the sci-fi series *Dune* by [Frank Herbert](https://en.wikipedia.org/wiki/Frank_Herbert). If you've seen the movie, they are the creatures that get attracted by vibrations in the sand. The reference is explained clearly in the README:

> A sandworm surfaces in the desert. It takes everything.

An estimate of the damage caused by Shai-Hulud through multiple campaigns includes 500 compromised software packages, hundreds of organisations breached, 300 GB of data stolen, and roughly 500,000 credentials exfiltrated to the attackers.

TeamPCP decided to release its source code on 11 May. I’m not a security researcher, but I’ve always been interested in how criminals exploit complex systems and bypass their security. So I forked the repo to see what intrusion techniques or exploits were used. I also took some notes to turn into a code review article later. But the more I read through the code, the more I felt somehow disappointed.

![](/assets/img/Shai-Hulud_restricted_mode.png "Reading Shai-Hulud code")

I didn't find any advanced exploit system, but rather a collection of simple tricks to steal credentials, obfuscate strings, and inject malicious code into npm packages. At times, the code was inconsistent, contained a few bugs, and appeared incomplete.

So how did a codebase like this become so harmful? Because it exploited the Achilles' heel in modern development. The trust we place in other people's code and how much we love dependencies.

## How it works

The codebase I’ve analysed is Mini Shai-Hulud. There have been three versions of the worm, with what appears to be an increasing number of features from one version to another.

The project uses *Bun* for its build process, and the README includes it's usage instructions. 

> Drop this into a CI pipeline. The sandworm crawls through your infrastructure, feeding on credentials from every provider it can reach, then exfiltrates through encrypted channels. If it finds npm tokens or OIDC access, it backdoors packages and publishes them. Downstream consumers install the infection. The worm grows.

### Preflight and infection

Once the worm starts running, it first performs some checks, becomes a daemon if it is not running inside a CI environment, and compromises the [OpenSearch](https://www.npmjs.com/package/@opensearch-project/opensearch) repository if the infected system has access to it, using an OIDC attack.

The worm uses two separate methods to poison a package. The OIDC attack involves injecting a new optional dependency, `@opensearch/setup`, pinned to a specific commit in another package, `opensearch-project/opensearch-js`, which has presumably already been compromised. The other method adds a `preinstall` script containing a malicious setup file that downloads Bun and then runs the worm.

### Credentials harvesting

Because the code has access to the host system, it simply reads configuration files and grabs tokens from processes and apps.

In short, it steals almost everything a developer can access: AWS credentials and secrets, SSH keys, cloud configuration files, cryptocurrency wallets, web chat data, VPN configurations, Kubernetes credentials, HashiCorp Vault secrets, GitHub tokens, Actions secrets, Claude settings, `.npmrc`, `.netrc`, Bash, Zsh, and Python shell histories, and MySQL, PostgreSQL, and Redis credentials.

### Data exfiltration

Once the malware has collected the credentials, it needs to send them to the attackers. The data is first compressed and encrypted using a public key embedded in the payload.

The malware then tries to contact the typosquatted domain `git-tanstack.com`. If that fails, it searches GitHub for other compromised repositories through signed commit messages and retrieves a fallback domain from one of them. If even that fails, it creates multiple GitHub repositories with names made from random adjectives and nouns drawn from _Dune_. The stolen data is later uploaded to these repositories through a GitHub Actions workflow.

A quick GitHub search showed thousands of repositories containing encrypted JSON data. A significant number of these repositories were created only a few days after the release of Mini Shai-Hulud’s source code, making me wonder whether someone had used it in a new campaign.

### Embedded payload

The payload contains a few scripts that download and install Bun on the system before executing the malware. Two of the files are configuration files for VS Code and Claude, designed to be injected into repositories so that whenever a user opens the project in the editor or with a coding agent, the worm compromises the machine and replicates itself. There is also a GitHub Actions workflow designed to collect repository secrets and upload them as artifacts. Then there are two public keys: one used to encrypt data and another to verify commit signatures. Finally, there is a Python script that dumps the memory of a GitHub Actions runner.

The payload contains also the `DEADMAN_SWITCH`, a Bash script that installs a daemon that once minute for the next 24h checks whether the GitHub token has been revoked, and if it has, wipes the home directory.

### Obfuscation

The code is obfuscated at build time in two layers. The first makes important strings unreadable in the built code and decodes them only at runtime. This prevents a signature-based malware detector from being triggered by a string such as `rm -rf ~`, because it is transformed into something like `LG+0RPNiAq6wTcBsei6MwLKLjyZ79e67`. The second layer obfuscates the entire codebase with `javascript-obfuscator` library.

## Imperfect code

I found a few issues in the codebase. Some expected files are missing, which could potentially prevent execution of a part of the malware. The bootstrapper exits if Bun is already installed, without executing the worm. `BASH_LOADER` and `PYTHON_LOADER` appear unused. The fallback-domain verification mechanism uses mismatched markers: it searches for `thebeautifulmarchoftime` but parses `thebeautifulsnadsoftime`, so verification with `verify_key.pub` likely never succeeds. I also found unused TypeScript interfaces and some `catch` and `finally` blocks left empty.

The credentials stealing and the `DEADMAN_SWITCH` script targets macOS and Linux systems. Code targeting Windows appears in the codebase, but it's unused. A good amount of Node developers use macOS, while CI systems usually run Linux, so if those were the main targets, maybe there was little reason to support Windows.

The README claims that the malware was vibe-coded, but it made me wonder whether an agent could have quickly fixed a few of these issues. The the source contains signs of work produced across multiple prompts: inconsistent abstractions, unfinished branches, unused interfaces, and code that appears to have been patched together from few sources, or precedent versions. The author seems fairly knowledgeable about security and build pipelines, but the project has been left in a prototype state.

The important lesson from this codebase it that it doesn’t have to be particularly sophisticated or complex to exploit a supply chain.

## How this happened?

What we have ignored for years is that every time we run `npm install`, we give code written by others access to our machine and the network. It sounds nightmarish, but that’s what happens.

Every time you run a linter, whether directly or through your editor, compromised code can steal your credentials, access your servers and cryptocurrency wallets, send your data to a remote server, and push new versions of your repositories to GitHub with poisoned dependencies, spreading itself like a worm. Dependencies are insecure, and editor extensions are no exception[^1].

Node, the runtime behind most JavaScript projects, has security flaws built into its design, as its creator, Ryan Dahl, [has himself acknowledged](https://www.youtube.com/watch?v=M3BM9TB-8yA&t=362s). We got used to writing web applications faster by relying on a large number of dependencies and on a network of trust, expecting maintainers and the open-source community to do a good job. Very large companies were built using these technologies.

While forward-thinking companies developed the habit of giving back to the community by open-sourcing their code and financially supporting maintainers, we also saw [signs](https://www.zdnet.com/article/when-open-source-developers-go-bad/) that this equilibrium was not always stable.

TeamPCP decided to attack developers because, in some respects, we became an easy target. Also the credentials on our machines are more valuable than ordinary users’ data. Now that writing imperfect but runnable code has become extremely cheap thanks coding agents, we should stop blindly trusting third-party code without security measures in place.

## What can we do?

The creator of Odin, Ginger Bill, argued last year that [package managers are evil](https://www.gingerbill.org/article/2025/09/08/package-managers-are-evil/). I recommend reading the article because it’s very interesting. The key point for this discussion is that we tend to trust others and therefore “assume random code off the internet _works_”.

We have become used to believing that code published online is reliable, and that relying on third-party packages whenever possible is efficient[^2]. We hid the [dependency hell](https://en.wikipedia.org/wiki/Dependency_hell) behind automated systems, making it nice and easy to use, but almost impossible to verify what code we are actually importing. If a dependency nested four layers down gets compromised, developers will install and run it, without even realising what happened.

Token protection, credential rotation, CI monitoring, delayed dependency updates, agentic auditing and supervision can reduce the risk, but they do not remove the design problem. Node, Python, Rust, Ruby and Go all rely on third-party dependencies whose code execute with the same privileges as the application, without being isolated from the rest of the system.

Going forward, we should seriously consider adopting a **zero-trust mindset** when developing software.

npm has [recently removed](https://github.blog/changelog/2026-06-09-upcoming-breaking-changes-for-npm-v12/) the ability for packages to run their own scripts during installation. As a result, it will no longer execute `preinstall`, `install`, or `postinstall` scripts from dependencies, which helped previous versions of Shai-Hulud spread.

One effective approach often proposed online is to **reduce the number of dependencies to a minimum**. Prefer mature, **actively maintained packages** with a **limited dependency tree** and a long, stable release history. This would reduce the probability of being attacked through small, obscure dependencies.

Also we can consider choosing programming languages that provide **larger standard libraries** and runtimes, so we can write code faster without the need to import many external packages.

When dependencies are necessary, they can be distributed with a reliable **release model** closer to those used by linux distributions like Debian, with different channels such as `stable`, `testing`, and `nightly`. This would allow code to be audited by a larger community of maintainers, preventing frequent release.

A stronger protection comes from **limiting access to third-party code**. This has been successfully applied by Apple in macOS, by requiring permission before they can access sensitive folders or other apps’ data.

![Adobe Photoshop 2025 macOS access screen](/assets/img/macos_access_allow.png "You wouldn't give Photoshop 2025 access to your data, right?")

A more effective approach is to **sandbox third-party dependencies**. The code runs inside an isolated and restricted environment, preventing it from compromising the system.

These techniques have been partially addressed by the new JavaScript runtime [Deno](https://deno.com/), another project created by Node creator Ryan Dahl. Deno implements runtime permissions and package sandboxing. It provides dependency auditing, minimum-age controls, a larger built-in toolset, and it's almost entirely compatible with npm packages. It does not eliminate the problem of trusting external dependencies, but it reduces the amount of permissions granted to them by default.

Whatever we choose, we should start considering every single dependency as a new tradeoff. We need to become responsible for it, rather than expecting someone else to take that responsibility.

[^1]: One of the latest attack from TeamPCP in May, involved a GitHub developer installing a malicious software extension for VSCode, which ended up in almost 4000 private repositories violated.
[^2]: [is-string](https://www.npmjs.com/package/is-string) has 83K weekly download.
