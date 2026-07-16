import { useMemo, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ChevronRight, Info, Clock, Calendar } from "lucide-react";
import { useCmsContent } from "../lib/cmsContent";
import Seo from "../lib/seo";
import useReveal from "../hooks/useReveal";
import ImageLightbox from "../components/ImageLightbox";
import JournalToc from "../components/journal/JournalToc";
import JournalShare from "../components/journal/JournalShare";

const fallbackAuthor = { name: "Artham Aesthetique" };

const slugify = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const fmtDate = (date) => {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
};

const plainText = (blocks = []) =>
  (Array.isArray(blocks) ? blocks : [])
    .flatMap((block) => (block?._type === "block" ? block.children || [] : []))
    .map((child) => child?.text || "")
    .join(" ")
    .trim();

const legacyText = (post = {}) =>
  [
    ...(post.lead || []),
    ...(post.sections || []).flatMap((section) =>
      (section.blocks || []).flatMap((block) => {
        if (block.text) return block.text;
        if (block.items) return block.items;
        if (block.rows) return block.rows.flat();
        return "";
      }),
    ),
  ]
    .join(" ")
    .trim();

const markChild = (child, blockKey) => {
  let node = child.text || "";
  const marks = child.marks || [];
  marks.forEach((mark) => {
    if (mark === "strong") node = <strong key={`${blockKey}-${mark}`}>{node}</strong>;
    if (mark === "em") node = <em key={`${blockKey}-${mark}`}>{node}</em>;
  });
  return node;
};

const renderChildren = (block, keyPrefix) =>
  (block.children || []).map((child, index) => {
    const markDef = (block.markDefs || []).find((mark) => (child.marks || []).includes(mark._key) && mark.href);
    const node = markChild(child, `${keyPrefix}-${index}`);
    return markDef ? (
      <a key={child._key || index} href={markDef.href} target="_blank" rel="noopener noreferrer">
        {node}
      </a>
    ) : (
      <span key={child._key || index}>{node}</span>
    );
  });

const buildToc = (post = {}) => {
  const contentHeadings = (post.content || [])
    .filter((block) => block?._type === "block" && ["h2", "h3"].includes(block.style))
    .map((block, index) => {
      const text = plainText([block]);
      return { id: block._key || slugify(text) || `section-${index}`, text, level: block.style === "h3" ? 3 : 2 };
    })
    .filter((item) => item.text);

  if (contentHeadings.length) return contentHeadings;

  return (post.sections || [])
    .filter((section) => section.heading)
    .map((section, index) => ({
      id: section.id || slugify(section.heading) || `section-${index}`,
      text: section.heading,
      level: section.level === 3 ? 3 : 2,
    }));
};

const renderPortableBlocks = (blocks = [], onImageClick) => {
  const rendered = [];
  let listItems = [];
  let listType = "bullet";
  let imageIndex = 0;

  const flushList = () => {
    if (!listItems.length) return;
    const ListTag = listType === "number" ? "ol" : "ul";
    rendered.push(<ListTag key={`list-${rendered.length}`}>{listItems}</ListTag>);
    listItems = [];
  };

  blocks.forEach((block, index) => {
    if (!block) return;
    if (block._type === "image") {
      flushList();
      if (!block.url) return;
      const currentImageIndex = imageIndex;
      imageIndex += 1;
      rendered.push(
        <figure key={block._key || index}>
          <button
            type="button"
            onClick={() => onImageClick?.(currentImageIndex)}
            className="block w-full cursor-zoom-in text-left focus:outline-none focus:ring-2 focus:ring-coronation-gold"
            aria-label={`Open image preview${block.alt ? `: ${block.alt}` : ""}`}
          >
            <img src={block.url} alt={block.alt || ""} loading="lazy" />
          </button>
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>,
      );
      return;
    }
    if (block._type !== "block") return;

    const key = block._key || index;
    if (block.listItem) {
      if (listItems.length && listType !== block.listItem) flushList();
      listType = block.listItem;
      listItems.push(<li key={key}>{renderChildren(block, key)}</li>);
      return;
    }

    flushList();
    const children = renderChildren(block, key);
    const id = ["h2", "h3"].includes(block.style) ? key : undefined;
    if (block.style === "h2") rendered.push(<h2 key={key} id={id}>{children}</h2>);
    else if (block.style === "h3") rendered.push(<h3 key={key} id={id}>{children}</h3>);
    else if (block.style === "blockquote") rendered.push(<blockquote key={key}>{children}</blockquote>);
    else rendered.push(<p key={key}>{children}</p>);
  });

  flushList();
  return rendered;
};

const renderLegacyBlock = (block, si, bi) => {
  const key = `s${si}-b${bi}`;
  if (block.type === "p") return <p key={key}>{block.text}</p>;
  if (block.type === "quote") return <blockquote key={key}>{block.text}</blockquote>;
  if (block.type === "ul") return <ul key={key}>{(block.items || []).map((item, index) => <li key={index}>{item}</li>)}</ul>;
  if (block.type === "ol") return <ol key={key}>{(block.items || []).map((item, index) => <li key={index}>{item}</li>)}</ol>;
  if (block.type === "table") {
    return (
      <table key={key}>
        <thead>
          <tr>{(block.head || []).map((head, index) => <th key={index}>{head}</th>)}</tr>
        </thead>
        <tbody>
          {(block.rows || []).map((row, rowIndex) => (
            <tr key={rowIndex}>{(row || []).map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    );
  }
  return null;
};

export default function BlogPost() {
  useReveal();
  const { slug } = useParams();
  const { posts, findPost, isLoading } = useCmsContent();
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const post = findPost(slug);
  const contentImages = useMemo(
    () =>
      (post?.content || [])
        .filter((block) => block?._type === "image" && block.url)
        .map((block) => ({
          src: block.url,
          alt: block.alt || post?.title || "",
          caption: block.caption || "",
        })),
    [post?.content, post?.title],
  );

  if (!post && isLoading) {
    return (
      <section className="bg-summer-peach pt-40 pb-24 lg:pt-48">
        <div className="container-editorial">
          <p className="fine text-armadillo/70">Loading journal article...</p>
        </div>
      </section>
    );
  }

  if (!post) return <Navigate to="/blog" replace />;

  const author = post.author || fallbackAuthor;
  const published = fmtDate(post.publishedAt || post.date);
  const toc = buildToc(post);
  const shareUrl = typeof window !== "undefined" ? window.location.href : `/blog/${post.slug}`;
  const hasPortableContent = Array.isArray(post.content) && post.content.length > 0;
  const relatedBlogs = (post.relatedBlogs || []).length
    ? post.relatedBlogs
    : posts
        .filter((item) => item.slug !== post.slug && (item.category === post.category || (item.tags || []).some((tag) => (post.tags || []).includes(tag))))
        .slice(0, 3);

  const articleBody = plainText(post.content) || legacyText(post);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    datePublished: post.publishedAt || post.date,
    image: post.coverImage,
    articleSection: post.category,
    keywords: (post.tags || []).join(", "),
    author: { "@type": "Person", name: author.name },
    publisher: { "@type": "Organization", name: "Artham Aesthetique" },
    articleBody,
  };

  const Infobox = () => (
    <aside className="border border-coronation-gold/30 bg-summer-peach" aria-label={`Details about ${post.title}`}>
      <div className="border-b border-coronation-gold/30 px-4 py-3">
        <p className="font-display text-lg text-armadillo leading-tight">{post.title}</p>
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-coronation-gold" style={{ fontFamily: "'Raleway', sans-serif" }}>
          {post.category}
        </span>
      </div>
      <dl className="text-sm">
        <div className="grid grid-cols-3 gap-2 px-4 py-2.5 border-b border-coronation-gold/20">
          <dt className="col-span-1 font-medium text-armadillo/60" style={{ fontFamily: "'Raleway', sans-serif" }}>Author</dt>
          <dd className="col-span-2 m-0 text-armadillo">{author.name}</dd>
        </div>
        {published && (
          <div className="grid grid-cols-3 gap-2 px-4 py-2.5 border-b border-coronation-gold/20">
            <dt className="col-span-1 font-medium text-armadillo/60" style={{ fontFamily: "'Raleway', sans-serif" }}>Published</dt>
            <dd className="col-span-2 m-0 text-armadillo">{published}</dd>
          </div>
        )}
        <div className="grid grid-cols-3 gap-2 px-4 py-2.5">
          <dt className="col-span-1 font-medium text-armadillo/60" style={{ fontFamily: "'Raleway', sans-serif" }}>Reading time</dt>
          <dd className="col-span-2 m-0 text-armadillo">{post.readingTimeMin} min</dd>
        </div>
      </dl>
    </aside>
  );

  return (
    <>
      <Seo title={post.seoTitle || post.title} description={post.seoDescription || post.excerpt} ogImage={post.coverImage} jsonLd={jsonLd} />

      <section className="bg-summer-peach pt-40 pb-14 lg:pt-48 lg:pb-16">
        <div className="container-editorial max-w-4xl">
          <nav className="fine text-xs text-armadillo/60 flex items-center flex-wrap gap-2 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-burma-teak">Home</Link>
            <ChevronRight size={12} />
            <Link to="/blog" className="hover:text-burma-teak">Journal</Link>
            <ChevronRight size={12} />
            <Link to={`/blog?category=${encodeURIComponent(post.category)}`} className="hover:text-burma-teak">{post.category}</Link>
            <ChevronRight size={12} />
            <span className="text-armadillo">{post.title}</span>
          </nav>
          <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-coronation-gold" style={{ fontFamily: "'Raleway', sans-serif" }}>
            {post.category}
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-armadillo leading-[1.05] mt-3 mb-6">{post.title}</h1>
          {post.excerpt && <p className="fine text-lg text-armadillo/75 leading-relaxed mb-6">{post.excerpt}</p>}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-armadillo/70">
            <span className="inline-flex items-center gap-2">
              {author.portrait && <img src={author.portrait} alt={author.name} className="w-9 h-9 rounded-full object-cover" loading="lazy" />}
              <span className="font-display text-armadillo">{author.name}</span>
              {author.designation && <span>{author.designation}</span>}
            </span>
            {published && <span className="inline-flex items-center gap-1.5"><Calendar size={14} /> Published {published}</span>}
            <span className="inline-flex items-center gap-1.5"><Clock size={14} /> {post.readingTimeMin} min read</span>
          </div>
        </div>
      </section>

      <section className="bg-arabian-white py-14 lg:py-20">
        <div className="container-editorial max-w-6xl">
          <div className="aspect-[16/8] overflow-hidden mb-12 max-w-4xl mx-auto">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>

          <div className="lg:grid lg:grid-cols-[13rem_minmax(0,1fr)_15rem] lg:gap-10">
            <aside className="hidden lg:block">
              <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pb-8">
                <JournalToc items={toc} />
              </div>
            </aside>

            <article className="min-w-0">
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
                {hasPortableContent ? (
                  renderPortableBlocks(post.content, setLightboxIndex)
                ) : (
                  <>
                    {(post.lead || []).map((para, index) => <p key={`lead-${index}`}>{para}</p>)}
                    {(post.sections || []).map((section, sectionIndex) => {
                      const HeadingTag = section.level === 3 ? "h3" : "h2";
                      const id = section.id || slugify(section.heading);
                      return (
                        <section key={id || sectionIndex} aria-labelledby={id}>
                          <HeadingTag id={id}>{section.heading}</HeadingTag>
                          {(section.blocks || []).map((block, blockIndex) => renderLegacyBlock(block, sectionIndex, blockIndex))}
                        </section>
                      );
                    })}
                  </>
                )}
              </div>

              <aside role="note" aria-label="Medical disclaimer" className="mt-10 flex gap-3 border border-coronation-gold/30 bg-summer-peach/70 p-4 text-sm text-armadillo/75">
                <Info size={20} className="mt-0.5 shrink-0 text-coronation-gold" />
                <p>
                  <strong className="text-armadillo">Not medical advice.</strong> This article is for general
                  information and education only. It is not a substitute for professional diagnosis or treatment.
                  Please consult a qualified healthcare professional before acting on anything here.
                </p>
              </aside>

              {relatedBlogs.length > 0 && (
                <section aria-labelledby="related-blogs-heading" className="mt-12">
                  <h2 id="related-blogs-heading" className="font-display text-2xl text-armadillo mb-4">Related blogs</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {relatedBlogs.map((item) => (
                      <Link key={item.slug} to={`/blog/${item.slug}`} className="block border border-coronation-gold/30 bg-white/60 p-4 hover:border-burma-teak transition-colors">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-coronation-gold" style={{ fontFamily: "'Raleway', sans-serif" }}>{item.category}</span>
                        <span className="block font-display text-armadillo mt-1">{item.title}</span>
                        <span className="block text-sm text-armadillo/70 mt-1">{item.excerpt}</span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </article>

            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-6">
                <Infobox />
                <JournalShare url={shareUrl} title={post.title} />
              </div>
            </aside>
          </div>
        </div>
      </section>
      <ImageLightbox
        images={contentImages}
        currentIndex={lightboxIndex || 0}
        open={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  );
}
