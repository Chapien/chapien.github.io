/** @preserve webmention.js

Simple thing for embedding webmentions from webmention.io into a page, client-side.

(c)2018-2020 fluffy (http://beesbuzz.biz)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

GitHub repo (for latest released versions, issue tracking, etc.):

    http://github.com/PlaidWeb/webmention.js

*/

/**
Basic usage:

<script src="/path/to/webmention.js" data-param="val" ... async />
<div id="webmentions"></div>

Allowed parameters:

    page-url:

        The base URL to use for this page. Defaults to window.location

    add-urls:

        Additional URLs to check, separated by |s

    id:

        The HTML ID for the object to fill in with the webmention data.
        Defaults to "webmentions"

    wordcount:

        The maximum number of words to render in reply mentions.

    max-webmentions:

        The maximum number of mentions to retrieve. Defaults to 30.

    prevent-spoofing:

        By default, Webmentions render using the mf2 'url' element, which plays
        nicely with webmention bridges (such as brid.gy and telegraph)
        but allows certain spoofing attacks. If you would like to prevent
        spoofing, set this to 1.

A more detailed example:

<script src="/path/to/webmention.js"
    data-id="webmentionContainer"
    data-wordcount="30"
    data-prevent-spoofing="1"
    />

*/


(function () {
    "use strict";

    function getCfg(key, dfl) {
        return document.currentScript.getAttribute("data-" + key) || dfl;
    }

    var refurl = getCfg('page-url',
                        window.location.href.replace(/#.*$/, ''));
    var addurls = getCfg('add-urls', undefined);
    var containerID = getCfg('data-id', "webmentions");
    var textMaxWords = getCfg('wordcount');
    var maxWebmentions = getCfg('max-webmentions', 30);
    var mentionSource = getCfg('prevent-spoofing') ? 'wm-source' : 'url';

    var reactTitle = {
        'in-reply-to': 'replied',
        'like-of': 'liked',
        'repost-of': 'reposted',
        'bookmark-of': 'bookmarked',
        'mention-of': 'mentioned',
        'rsvp': 'RSVPed',
        'follow-of': 'followed'
    };

    var reactEmoji = {
        'in-reply-to': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-more-icon lucide-message-circle-more"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg>',
        'like-of': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#bf616a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-icon lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
        'repost-of': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a3be8c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-repeat-icon lucide-repeat"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>',
        'bookmark-of': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>',
        'mention-of': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-more-icon lucide-message-circle-more"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg>',
        'rsvp': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-icon lucide-calendar"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>',
        'follow-of': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-plus-icon lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>'
    };

    var rsvpEmoji = {
        'yes': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a3be8c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check-big-icon lucide-circle-check-big"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>',
        'no': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#bf616a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-slash2-icon lucide-circle-slash-2"><path d="M22 2 2 22"/><circle cx="12" cy="12" r="10"/></svg>',
        'interested': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ebcb8b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lightbulb-icon lucide-lightbulb"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>',
        'maybe': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d8dee9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-dashed-icon lucide-message-circle-dashed"><path d="M13.5 3.1c-.5 0-1-.1-1.5-.1s-1 .1-1.5.1"/><path d="M19.3 6.8a10.45 10.45 0 0 0-2.1-2.1"/><path d="M20.9 13.5c.1-.5.1-1 .1-1.5s-.1-1-.1-1.5"/><path d="M17.2 19.3a10.45 10.45 0 0 0 2.1-2.1"/><path d="M10.5 20.9c.5.1 1 .1 1.5.1s1-.1 1.5-.1"/><path d="M3.5 17.5 2 22l4.5-1.5"/><path d="M3.1 10.5c0 .5-.1 1-.1 1.5s.1 1 .1 1.5"/><path d="M6.8 4.7a10.45 10.45 0 0 0-2.1 2.1"/></svg>'
    };

    function entities(text) {
        return text.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function reactImage(r) {
        var who = entities((r.author && r.author.name)
                           ? r.author.name
                           : r.url.split('/')[2]);
        var response = reactTitle[r['wm-property']] || 'reacted';
        var html = '<a class="reaction" rel="nofollow ugc" title="' + who + ' ' +
            response + '" href="' + r[mentionSource] + '">';
        if (r.author && r.author.photo) {
            html += '<img src="' + entities(r.author.photo) + '">';
        }
        html += (reactEmoji[r['wm-property']] || '💥');
        if (r.rsvp && rsvpEmoji[r.rsvp]) {
            html += '<sub>' + rsvpEmoji[r.rsvp] + '</sub>';
        }
        html += '</a>';

        return html;
    }

    // strip the protocol off a URL
    function stripurl(url) {
        return url.substr(url.indexOf('//'));
    }

    // Deduplicate multiple mentions from the same source URL
    function dedupe(mentions) {
        var filtered = [];
        var seen = {};

        mentions.forEach(function(r) {
            // Strip off the protocol (i.e. treat http and https the same)
            var source = stripurl(r.url);
            if (!seen[source]) {
                filtered.push(r);
                seen[source] = true;
            }
        });

        return filtered;
    }

    function formatComments(comments) {
        var html = '<h2>' + comments.length + ' Response' +
            (comments.length > 1 ? 's' : '') +
            '</h2><ul class="comments">';
        comments.forEach(function(c) {
            html += '<li>';

            html += reactImage(c);

            html += ' <a class="source" rel="nofollow ugc" href="' +
                c[mentionSource] + '">';
            if (c.author && c.author.name) {
                html += entities(c.author.name);
            } else {
                html += entities(c.url.split('/')[2]);
            }
            html += '</a>: ';

            var linkclass;
            var linktext;
            if (c.name) {
                linkclass = "name";
                linktext = c.name;
            } else if (c.content && c.content.text) {
                var text = entities(c.content.text);

                if (textMaxWords) {
                    var words = text.replace(/\s+/g,' ')
                        .split(' ', textMaxWords + 1);
                    if (words.length > textMaxWords) {
                        words[textMaxWords - 1] += '&hellip;';
                        words = words.slice(0, textMaxWords);
                        text = words.join(' ');
                    }
                }

                linkclass = "text";
                linktext = text;
            } else {
                linkclass = "name";
                linktext = "(mention)";
            }

            html += '<span class="' + linkclass + '">' + linktext + '</span>';

            html += '</li>';
        });
        html += '</ul>';

        return html;
    }

    function formatReactions(reacts) {
        var html = '<h2>' + reacts.length + ' Reaction' +
            (reacts.length > 1 ? 's' : '') +
            '</h2><ul class="reacts">';

        reacts.forEach(function(r) {
            html += reactImage(r);
        });

        return html;
    }

    function getData(url, callback) {
        if (window.fetch) {
            window.fetch(url).then(function(response) {
                if (response.status >= 200 && response.status < 300) {
                    return Promise.resolve(response);
                } else {
                    return Promise.reject(new Error(response.statusText));
                }
            }).then(function(response) {
                return response.json();
            }).then(callback).catch(function(error) {
                console.error("Request failed", error);
            });
        } else {
            var oReq = new XMLHttpRequest();
            oReq.onload = function(data) {
                callback(JSON.parse(data));
            };
            oReq.onerror = function(error) {
                console.error("Request failed", error);
            };
        }
    }

    window.addEventListener("load", function () {
        var container = document.getElementById(containerID);
        if (!container) {
            // no container, so do nothing
            return;
        }

        var pages = [stripurl(refurl)];
        if (!!addurls) {
            addurls.split('|').forEach(function (url) {
                pages.push(stripurl(url));
            })
        }

        var apiURL = 'https://webmention.io/api/mentions.jf2?per-page=' +
            maxWebmentions;

        pages.forEach(function (path) {
            apiURL += '&target[]=' + encodeURIComponent('http:' + path) +
                '&target[]=' + encodeURIComponent('https:' + path);
        });

        getData(apiURL, function(json) {
            var html = '';

            var comments = [];
            var collects = [];

            var mapping = {
                "in-reply-to": comments,
                "like-of": collects,
                "repost-of": collects,
                "bookmark-of": collects,
                "mention-of": comments,
                "rsvp": comments
            };

            json.children.forEach(function(c) {
                var store = mapping[c['wm-property']];
                if (store) {
                    store.push(c);
                }
            });

            // format the comment-type things
            if (comments.length > 0) {
                html += formatComments(dedupe(comments));
            }

            // format the other reactions
            if (collects.length > 0) {
                html += formatReactions(dedupe(collects));
            }

            container.innerHTML = html;
        });
    });

}());
