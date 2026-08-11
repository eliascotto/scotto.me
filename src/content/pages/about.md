---
title: About me
name: About
eleventyExcludeFromCollections: true
---

<div class="hidden overflow-hidden md:flex flex-col justify-center mb-8">
  <img
    class="object-cover rounded-full w-1/6 aspect-square border-2 border-gray-200 dark:border-gray-400"
    alt="Elia Scotto"
    src="/assets/img/profile_VSCO.JPG"
  />
</div>

Hi, I'm Elia (pronounced <code class="dark:text-gray-200 text-gray-900 bg-lightBackground dark:bg-darkBackground border-none">/eˈli.a/</code>), a **software engineer** living in Hobart, Australia.

If want to connect, **drop me an email** at <span id="contact"><span class="email-obf">em.<span class="email-decoy">PLZNO</span>ottocs@<span class="email-decoy">SPAM</span>olleh</span></span> .

If you like my writing or find my software helpful, you can support my work by [buying me a coffee](https://ko-fi.com/eliascotto).

### Work

Currently available for contract or fractional work, ideally with early-stage startups or bootstrappers. Open to remote roles across Australia or worldwide for the right opportunity.

<style>
  .email-obf { unicode-bidi: bidi-override; direction: rtl; }
  .email-decoy { display: none; }
</style>

<script>
  (function () {
    var u = "hello", d = "scotto", t = "me";
    var addr = u + "@" + d + "." + t;
    var contact = document.getElementById("contact");
    if (!contact) return;
    var a = document.createElement("a");
    a.href = "mailto:" + addr;
    a.textContent = addr;
    contact.replaceChildren(a);
  })();
</script>


### Career

Recently I've helped [VerifiMe](https://www.verifime.com/) build their identity verification platform for businesses. I also worked on the messaging system and analytics at [Audience Republic](https://www.audiencerepublic.com/), a marketing platform based in Sydney. Before that I helped grow the cloud training platform at CloudAcademy (now [QA](https://www.qa.com/)) in Switzerland, where I had the opportunity to learn basic data science and machine learning. During university I was an early employee at [Sysdig](https://www.sysdig.com/). Thanks to them I flew to Silicon Valley where I worked on the UI library for the core product and a couple of open-source UIs for the monitoring tools. As a freelancer I've collaborated with projects in the fields of video streaming and logistics.

### More?

You can find me on <a href="https://bsky.app/profile/scotto.me" rel="me noopener noreferrer" target="_blank">BlueSky</a> and <a href="https://github.com/eliascotto" rel="me noopener noreferrer" target="_blank">GitHub</a>. You can subscribe to my posts using [RSS](/feed.xml).

I have a [now](/now/) page.
