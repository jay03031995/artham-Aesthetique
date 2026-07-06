import { Link, useParams, Navigate } from "react-router-dom";
import { ChevronRight, Info, Clock, Calendar } from "lucide-react";
import { findPost, POSTS } from "../data/blog";
import { findService } from "../data/treatments";
import Seo from "../lib/seo";
import useReveal from "../hooks/useReveal";
import {
  buildToc,
  buildLinkTargets,
  makeLinker,
  renderRichText,
  getSeeAlso,
  getBacklinks,
  computeReadingTime,
  bodyText,
} from "../lib/journal";
import JournalToc from "../components/journal/JournalToc";
import JournalShare from "../components/journal/JournalShare";

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default function BlogPost({ onOpenBooking }) {
  useReveal();
  const { slug } = useParams();
  const post = findPost(slug);
  if (!post) return <Navigate to="/blog" replace />;

  const toc = buildToc(post);
  const targets = buildLinkTargets();
  const linkify = makeLinker(post.slug, targets);
  const seeAlso = getSeeAlso(post);
  const backlinks = getBacklinks(post, POSTS);
  const related = (post.relatedSlugs || []).map(findService).filter(Boolean);
  const readingTime = computeReadingTime(post);
  const shareUrl = typeof window !== "undefined" ? window.location.href : `/blog/${post.slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": ["MedicalWebPage", "Article"],
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      dateModified: post.updated || post.date,
      image: post.coverImage,
      articleSection: post.category,
      keywords: (post.keywords || []).join(", "),
      author: { "@type": "Person", name: "Dr. Omaima Jawed" },
      publisher: { "@type": "Organization", name: "Artham Aesthetique" },
      articleBody: bodyText(post),
    },
  ];
  if (post.faq && post.faq.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  const renderBlock = (block, si, bi) => {
    const kp = `s${si}-b${bi}`;
    switch (block.type) {
      case "p":
        return <p key={kp}>{renderRichText(block.text, linkify, kp)}</p>;
      case "quote":
        return <blockquote key={kp}>{renderRichText(block.text, linkify, kp)}</blockquote>;
      case "ul":
        return (
          <ul key={kp}>
            {block.items.map((it, ii) => (
              <li key={ii}>{renderRichText(it, linkify, `${kp}-${ii}`)}</li>
            ))}
          </ul>
        );
      case "ol":
        return (
          <ol key={kp}>
            {block.items.map((it, ii) => (
              <li key={ii}>{renderRichText(it, linkify, `${kp}-${ii}`)}</li>
            ))}
          </ol>
        );
      case "table":
        return (
          <table key={kp}>
            <thead>
              <tr>
                {block.head.map((h, hi) => (
                  <th key={hi}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((r, ri) => (
                <tr key={ri}>
                  {r.map((c, ci) => (
                    <td key={ci}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return null;
    }
  };

  const Infobox = () => (
    <aside className="border border-coronation-gold/30 bg-summer-peach" aria-label={`Key facts about ${post.title}`}>
      <div className="border-b border-coronation-gold/30 px-4 py-3">
        <p className="font-display text-lg text-armadillo leading-tight">{post.title}</p>
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-coronation-gold" style={{ fontFamily: "'Raleway', sans-serif" }}>
          {post.category}
        </span>
      </div>
      <dl className="text-sm">
        {(post.keyFacts || []).map((f, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 px-4 py-2.5 border-b border-coronation-gold/20">
            <dt className="col-span-1 font-medium text-armadillo/60" style={{ fontFamily: "'Raleway', sans-serif" }}>{f.label}</dt>
            <dd className="col-span-2 m-0 text-armadillo">{f.value}</dd>
          </div>
        ))}
        <div className="grid grid-cols-3 gap-2 px-4 py-2.5 border-b border-coronation-gold/20">
          <dt className="col-span-1 font-medium text-armadillo/60" style={{ fontFamily: "'Raleway', sans-serif" }}>Reading time</dt>
          <dd className="col-span-2 m-0 text-armadillo">{readingTime} min</dd>
        </div>
        <div className="grid grid-cols-3 gap-2 px-4 py-2.5">
          <dt className="col-span-1 font-medium text-armadillo/60" style={{ fontFamily: "'Raleway', sans-serif" }}>Updated</dt>
          <dd className="col-span-2 m-0 text-armadillo">{fmtDate(post.updated || post.date)}</dd>
        </div>
      </dl>
    </aside>
  );

  return (
    <>
      <Seo title={post.title} description={post.excerpt} ogImage={post.coverImage} jsonLd={jsonLd} />

      {/* Hero */}
      <section className="bg-summer-peach pt-40 pb-14 lg:pt-48 lg:pb-16">
        <div className="container-editorial max-w-4xl">
          <nav className="fine text-xs text-armadillo/60 flex items-center flex-wrap gap-2 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-burma-teak">Home</Link>
            <ChevronRight size={12} />
            <Link to="/blog" className="hover:text-burma-teak">Journal</Link>
            <ChevronRight size={12} />
            <Link to={`/blog?cat=${encodeURIComponent(post.category)}`} className="hover:text-burma-teak">{post.category}</Link>
            <ChevronRight size={12} />
            <span className="text-armadillo">{post.title}</span>
          </nav>
          <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-coronation-gold" style={{ fontFamily: "'Raleway', sans-serif" }}>
            {post.category}
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-armadillo leading-[1.05] mt-3 mb-6">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-armadillo/70">
            <span className="inline-flex items-center gap-2">
              <img src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=200&q=80" alt="Dr. Omaima Jawed" className="w-9 h-9 rounded-full object-cover" loading="lazy" />
              <span className="font-display text-armadillo">Dr. Omaima Jawed</span>
            </span>
            <span className="inline-flex items-center gap-1.5"><Calendar size={14} /> Published {fmtDate(post.date)}</span>
            {post.updated && <span className="inline-flex items-center gap-1.5"><Calendar size={14} /> Updated {fmtDate(post.updated)}</span>}
            <span className="inline-flex items-center gap-1.5"><Clock size={14} /> {readingTime} min read</span>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-arabian-white py-14 lg:py-20">
        <div className="container-editorial max-w-6xl">
          <div className="aspect-[16/9] overflow-hidden mb-12 max-w-4xl mx-auto">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>

          <div className="lg:grid lg:grid-cols-[13rem_minmax(0,1fr)_15rem] lg:gap-10">
            {/* Left: sticky TOC */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pb-8">
                <JournalToc items={toc} />
              </div>
            </aside>

            {/* Center: article */}
            <article className="min-w-0">
              {/* Mobile infobox + share + toc */}
              <div className="lg:hidden space-y-6 mb-10">
                <Infobox />
                <JournalShare url={shareUrl} title={post.title} />
                {toc.length > 0 && (
                  <details className="border border-coronation-gold/30 bg-summer-peach p-4">
                    <summary className="cursor-pointer text-sm font-semibold text-armadillo">Contents</summary>
                    <div className="mt-3"><JournalToc items={toc} /></div>
                  </details>
                )}
              </div>

              <div className="journal-prose max-w-prose">
                {/* Lead */}
                {(post.lead || []).map((para, i) => (
                  <p key={`lead-${i}`}>{renderRichText(para, linkify, `lead-${i}`)}</p>
                ))}

                {/* Sections */}
                {(post.sections || []).map((s, si) => {
                  const HeadingTag = s.level === 3 ? "h3" : "h2";
                  return (
                    <section key={s.id || si} aria-labelledby={s.id}>
                      <HeadingTag id={s.id}>{s.heading}</HeadingTag>
                      {(s.blocks || []).map((b, bi) => renderBlock(b, si, bi))}
                    </section>
                  );
                })}

                {/* FAQ */}
                {post.faq && post.faq.length > 0 && (
                  <section aria-labelledby="faq">
                    <h2 id="faq">Frequently asked</h2>
                    {post.faq.map((f, i) => (
                      <div key={i}>
                        <h3>{f.q}</h3>
                        <p>{f.a}</p>
                      </div>
                    ))}
                  </section>
                )}

                {/* References */}
                {post.references && post.references.length > 0 && (
                  <section aria-labelledby="references-heading">
                    <h2 id="references">References</h2>
                    <ol className="text-[15px] text-armadillo/75">
                      {post.references.map((r, i) => (
                        <li key={i} id={`ref-${i + 1}`}>{r}</li>
                      ))}
                    </ol>
                  </section>
                )}

                {/* Further reading */}
                {post.furtherReading && post.furtherReading.length > 0 && (
                  <section aria-labelledby="further-heading">
                    <h2 id="further-reading">Further reading</h2>
                    <ul>
                      {post.furtherReading.map((f, i) => (
                        <li key={i}>{f.href ? <a href={f.href}>{f.label}</a> : f.label}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>

              {/* Medical disclaimer */}
              <aside role="note" aria-label="Medical disclaimer" className="mt-10 flex gap-3 border border-coronation-gold/30 bg-summer-peach/70 p-4 text-sm text-armadillo/75">
                <Info size={20} className="mt-0.5 shrink-0 text-coronation-gold" />
                <p>
                  <strong className="text-armadillo">Not medical advice.</strong> This article is for general
                  information and education only. It is not a substitute for professional diagnosis or treatment.
                  Please consult a qualified healthcare professional — or book a consultation with Dr. Omaima Jawed —
                  before acting on anything here.
                </p>
              </aside>

              {/* Explored in this post — treatment CTA */}
              {related.length > 0 && (
                <aside className="mt-10 bg-summer-peach p-8 border border-coronation-gold/30" data-testid="blog-related-cta">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-coronation-gold" style={{ fontFamily: "'Raleway', sans-serif" }}>
                    Explored in this post
                  </span>
                  <ul className="space-y-2 mt-3">
                    {related.map((r) => (
                      <li key={r.slug}>
                        <Link to={`/services/${r.slug}`} className="link-gold font-display text-lg">{r.name} →</Link>
                      </li>
                    ))}
                  </ul>
                  <button onClick={onOpenBooking} className="btn-primary mt-6" data-testid="blog-related-book">Book a Consult</button>
                </aside>
              )}

              {/* See also — related journal articles */}
              {seeAlso.length > 0 && (
                <section aria-labelledby="see-also-heading" className="mt-12">
                  <h2 id="see-also-heading" className="font-display text-2xl text-armadillo mb-4">See also</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {seeAlso.map((p) => (
                      <Link key={p.slug} to={`/blog/${p.slug}`} className="block border border-coronation-gold/30 bg-white/60 p-4 hover:border-burma-teak transition-colors">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-coronation-gold" style={{ fontFamily: "'Raleway', sans-serif" }}>{p.category}</span>
                        <span className="block font-display text-armadillo mt-1">{p.title}</span>
                        <span className="block text-sm text-armadillo/70 mt-1">{p.excerpt}</span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Linked from — bidirectional backlinks */}
              {backlinks.length > 0 && (
                <section aria-labelledby="linked-from-heading" className="mt-10 border-t border-coronation-gold/30 pt-6">
                  <h2 id="linked-from-heading" className="text-[12px] font-semibold uppercase tracking-[0.14em] text-coronation-gold mb-3" style={{ fontFamily: "'Raleway', sans-serif" }}>
                    Linked from
                  </h2>
                  <ul className="flex flex-wrap gap-2">
                    {backlinks.map((p) => (
                      <li key={p.slug}>
                        <Link to={`/blog/${p.slug}`} className="inline-block border border-coronation-gold/40 px-3 py-1 text-sm text-armadillo/80 hover:border-burma-teak hover:text-burma-teak transition-colors">
                          {p.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </article>

            {/* Right: infobox + sticky share */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-6">
                <Infobox />
                <JournalShare url={shareUrl} title={post.title} />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
