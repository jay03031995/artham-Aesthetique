import React from "react";
import { Link } from "react-router-dom";

/* ------------------------------------------------------------------ *
 * Wikipedia-style Journal engine (client-side).
 * Auto table of contents, auto internal backlinks, see-also, backlinks,
 * reading time — mirrors the health-wiki engine, adapted for React/CRA.
 * ------------------------------------------------------------------ */

export const MAX_LINKS_PER_ARTICLE = 10;

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Whole-word, case-insensitive matcher for a phrase. */
export function phraseRegExp(phrase, flags = "i") {
  return new RegExp(
    `(?<![A-Za-z0-9])(${escapeRegExp(phrase)})(?![A-Za-z0-9])`,
    flags,
  );
}

/** All the plain text of a post's body (lead + section blocks), no headings. */
export function bodyText(post) {
  const parts = [...(post.lead || [])];
  for (const s of post.sections || []) {
    for (const b of s.blocks || []) {
      if (b.type === "p" || b.type === "quote") parts.push(b.text);
      else if (b.type === "ul" || b.type === "ol") parts.push((b.items || []).join(" "));
    }
  }
  return parts.join(" ");
}

export function computeReadingTime(post) {
  const words = bodyText(post).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Build link targets (title + aliases + keywords → slug), longest phrase first. */
export function buildLinkTargets(posts = []) {
  const seen = new Set();
  const targets = [];
  for (const p of posts) {
    const phrases = [p.title, ...(p.aliases || []), ...(p.keywords || [])];
    for (const phrase of phrases) {
      const key = String(phrase).toLowerCase().trim();
      if (key.length < 4 || seen.has(key)) continue;
      seen.add(key);
      targets.push({ slug: p.slug, title: p.title, phrase, key });
    }
  }
  targets.sort((a, b) => b.phrase.length - a.phrase.length);
  return targets;
}

const _outCache = new Map();

/** Which post slugs this post auto-links to (deterministic; drives backlinks). */
export function getOutboundSlugs(post, targets = []) {
  if (_outCache.has(post.slug)) return _outCache.get(post.slug);
  const text = bodyText(post);
  const linked = new Set();
  for (const t of targets) {
    if (linked.size >= MAX_LINKS_PER_ARTICLE) break;
    if (t.slug === post.slug || linked.has(t.slug)) continue;
    if (phraseRegExp(t.phrase).test(text)) linked.add(t.slug);
  }
  const result = [...linked];
  _outCache.set(post.slug, result);
  return result;
}

/** "Linked from" — every post whose auto-links point at this one. */
export function getBacklinks(post, posts = []) {
  const targets = buildLinkTargets(posts);
  return posts.filter(
    (o) => o.slug !== post.slug && getOutboundSlugs(o, targets).includes(post.slug),
  );
}

function tokens(post) {
  const words =
    [post.title, ...(post.keywords || []), ...(post.aliases || [])]
      .join(" ")
      .toLowerCase()
      .match(/[a-z0-9]+/g) || [];
  return new Set(words.filter((w) => w.length > 3));
}

/** "See also" — related posts by token overlap + link graph + category. */
export function getSeeAlso(post, posts = [], limit = 4) {
  const targets = buildLinkTargets(posts);
  const myOut = new Set(getOutboundSlugs(post, targets));
  const myTokens = tokens(post);
  return posts
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      let overlap = 0;
      for (const t of tokens(p)) if (myTokens.has(t)) overlap += 1;
      const linked = myOut.has(p.slug) || getOutboundSlugs(p, targets).includes(post.slug);
      const catBoost = p.category === post.category ? 2 : 0;
      return { post: p, score: overlap * 2 + (linked ? 4 : 0) + catBoost };
    })
    .sort((a, b) => b.score - a.score || (a.post.date < b.post.date ? 1 : -1))
    .filter((s) => s.score > 0)
    .slice(0, limit)
    .map((s) => s.post);
}

/** Table of contents entries from a post's sections (h2/h3). */
export function buildToc(post) {
  return (post.sections || [])
    .filter((s) => s.heading)
    .map((s) => ({
      id: s.id || slugify(s.heading),
      text: s.heading,
      level: s.level === 3 ? 3 : 2,
    }));
}

/**
 * Render a paragraph string into React nodes, supporting:
 *  - **bold** (e.g. the bold lead definition),
 *  - inline citations like [1] → superscript link to the references list,
 *  - and auto-backlinks via the provided `linkify` function.
 */
export function renderRichText(text, linkify, keyPrefix = "r") {
  const boldParts = String(text).split("**");
  const out = [];
  boldParts.forEach((seg, bi) => {
    if (!seg) return;
    if (bi % 2 === 1) {
      out.push(React.createElement("strong", { key: `${keyPrefix}-b${bi}` }, seg));
      return;
    }
    // Non-bold: split out [n] citations, linkify the rest.
    const citeParts = seg.split(/(\[\d+\])/g);
    citeParts.forEach((cp, ci) => {
      if (!cp) return;
      const m = cp.match(/^\[(\d+)\]$/);
      if (m) {
        out.push(
          React.createElement(
            "sup",
            { key: `${keyPrefix}-c${bi}-${ci}`, className: "journal-cite" },
            React.createElement("a", { href: "#references" }, cp),
          ),
        );
      } else {
        out.push(
          React.createElement(
            React.Fragment,
            { key: `${keyPrefix}-f${bi}-${ci}` },
            linkify(cp, `${keyPrefix}-${bi}-${ci}`),
          ),
        );
      }
    });
  });
  return out;
}

/**
 * Factory that produces a linkifier bound to one article render.
 * Tracks linked slugs + total across the whole article (first-occurrence,
 * max 1 per target, global cap). Returns an array of React nodes.
 */
export function makeLinker(currentSlug, targets = buildLinkTargets()) {
  const linked = new Set();
  const state = { total: 0 };

  return function linkify(text, keyPrefix = "l") {
    if (!text) return [text];
    const nodes = [];
    let pos = 0;
    let idx = 0;
    while (pos < text.length && state.total < MAX_LINKS_PER_ARTICLE) {
      let best = null;
      for (const t of targets) {
        if (t.slug === currentSlug || linked.has(t.slug)) continue;
        const re = phraseRegExp(t.phrase, "ig");
        re.lastIndex = pos;
        const m = re.exec(text);
        if (
          m &&
          (!best || m.index < best.index || (m.index === best.index && m[0].length > best.len))
        ) {
          best = { index: m.index, len: m[0].length, target: t };
        }
      }
      if (!best) break;
      if (best.index > pos) nodes.push(text.slice(pos, best.index));
      nodes.push(
        React.createElement(
          Link,
          {
            key: `${keyPrefix}-${idx++}`,
            to: `/blog/${best.target.slug}`,
            className: "journal-autolink",
            title: best.target.title,
          },
          text.slice(best.index, best.index + best.len),
        ),
      );
      linked.add(best.target.slug);
      state.total += 1;
      pos = best.index + best.len;
    }
    if (pos < text.length) nodes.push(text.slice(pos));
    return nodes.length ? nodes : [text];
  };
}
