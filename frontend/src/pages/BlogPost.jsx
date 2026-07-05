import { Link, useParams, Navigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { findPost } from "../data/blog";
import { findService } from "../data/treatments";
import Seo from "../lib/seo";
import useReveal from "../hooks/useReveal";

export default function BlogPost({ onOpenBooking }) {
  useReveal();
  const { slug } = useParams();
  const post = findPost(slug);
  if (!post) return <Navigate to="/blog" replace />;

  const related = (post.relatedSlugs || []).map(findService).filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    image: post.coverImage,
    author: { "@type": "Person", name: "Dr. Omaima Jawed" },
    articleBody: post.body.join(" "),
  };

  return (
    <>
      <Seo title={post.title} description={post.excerpt} ogImage={post.coverImage} jsonLd={jsonLd} />

      <section className="bg-summer-peach pt-40 pb-16 lg:pt-48 lg:pb-20">
        <div className="container-editorial max-w-3xl">
          <nav className="fine text-xs text-armadillo/60 flex items-center gap-2 mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-burma-teak">Home</Link>
            <ChevronRight size={12} />
            <Link to="/blog" className="hover:text-burma-teak">Journal</Link>
            <ChevronRight size={12} />
            <span className="text-armadillo">{post.title}</span>
          </nav>
          <p className="overline text-coronation-gold mb-4">{post.category} · {post.readingTimeMin} min read</p>
          <h1 className="font-display text-4xl md:text-5xl text-armadillo leading-[1.05] mb-8">{post.title}</h1>
          <div className="flex items-center gap-4">
            <img src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=200&q=80" alt="Dr. Omaima Jawed" className="w-11 h-11 rounded-full object-cover" loading="lazy" />
            <div>
              <div className="font-display text-armadillo">Dr. Omaima Jawed</div>
              <div className="overline text-coronation-gold text-[10px]">{new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-arabian-white py-16 lg:py-24">
        <div className="container-editorial max-w-3xl">
          <div className="aspect-[16/10] overflow-hidden mb-14">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
          <article className="prose-editorial fine text-armadillo/85 text-lg leading-[1.9]">
            {post.body.map((para, i) => (
              <p key={i} className="mb-6">{para}</p>
            ))}
          </article>

          {related.length > 0 && (
            <aside className="mt-16 bg-summer-peach p-8 border border-coronation-gold/30" data-testid="blog-related-cta">
              <p className="overline text-coronation-gold mb-3">Explored in this post</p>
              <ul className="space-y-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link to={`/services/${r.slug}`} className="link-gold font-display text-lg">{r.name} →</Link>
                  </li>
                ))}
              </ul>
              <button onClick={onOpenBooking} className="btn-primary mt-6" data-testid="blog-related-book">Book a Consult</button>
            </aside>
          )}
        </div>
      </section>
    </>
  );
}
