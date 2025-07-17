+++
title = "Comments Enabled! And Goodbye to Webmentions"
date = "2025-07-01"
description = "Switching away from webmentions and to isso comments"
summary = "An update on some site infrastructure."
draft = false
categories = [ "Blog" ] 
tags = [ "meta" ]
author = "Claire"
toc = true
tocopen = true
hidesummary = false
slug = "/comments-enabled"
ShowCanonicalLink = true
fmContentType = "blog"

[cover]
image = "cover.png"
hidden = true
relative = true
caption = "Image taken from [Wikimedia](https://commons.wikimedia.org/wiki/File:Chat_bubbles.svg)."
+++
# Switching Away from Webmentions
## Webmentions? What are those?
At the bottom of each of my blog posts, you may have noticed in the past a section called 'webmentions'. This was how I previously served interactions on my post; they're a neat bit of technology that effectively associated each post with a syndicated post on one of my social media platforms. This meant that if you replied to a post on, say, Bluesky linking to my article, your reply would show up as a comment on my blog. Pretty neat! 
## Why Use Them at All?
Well, first and foremost, I thought they were pretty cool. But beyond that, my website is a static site. It is hosted on Github Pages, meaning any sort of live updating has to be handled via a separate server. When I first begun my webhosting journey, I was unaware of any easy to set up free solutions; and I did not want to pay for one of the many services that provided comments. The reason I didn't want to pay is pretty simple; I don't expect to get a ton of engagement on my posts anyway, so why pay for a service that only three people will ever interact with? Webmentions were free, albeit a bit difficult to set up -- but it was a fun challenge, and I learned quite a bit.
## What Changed?
I discovered something called [isso](https://isso-comments.de/). This is a self-hosted comments provider that I can run from my own home server. In fact, it's running in a docker container on my server right now. At first, I was reticent to expose any services on my home server to the wider internet. However, thanks to some tunnels and reverse proxying, I feel more comfortable doing so now, at the very least for something small-scale like this. Comments will have to be approved before they appear, just to keep some control over my content, but I get an e-mail notification when you comment so it should not take too long for me to approve any appropriate comments. My [guestbook](https://chapien.net/guestbook/) is also powered by isso, with the same approval system.
## But I Want to Send Webmentions!
You still can! My website will still receive webmentions, it just won't display them anymore. I might do something with them down the road -- maybe enable showing likes and reposts, but not replies, or perhaps allowing people to post their own articles in response to my own. Regardless, for now, I want to focus just on isso.
## And Another Thing...
I'm considering switching my blog's theme off of Papermod and into something more modular. I plan on having more static (non-article) pages on my blog, such as a gallery of commissioned art, a list of projects, and so on, and while Papermod is a lovely theme, I'm not exactly sure it's well-suited to anything other than a standard homepage and a list of articles. That said, it would be quite a project to move my modified shortcodes and templates (which were made using Papermod as a base) into a different theme! 
## That's It?
I realize it's been almost two months since my last post, and for that I am sorry. I've been busy with life, including a new job, and I've been trying to avoid burnout. That said, thank you for sticking with me, and please watch this space for more!