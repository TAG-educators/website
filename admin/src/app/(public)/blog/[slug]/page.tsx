import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchBlogPostBySlug, fetchPublishedBlogPosts } from "@/lib/blog";
import "../../public.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: post } = await fetchBlogPostBySlug(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: `${post.title} — TAG Educators Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: post } = await fetchBlogPostBySlug(slug);

  if (!post || post.status !== "published") notFound();

  const { data: allPosts } = await fetchPublishedBlogPosts();
  const related = allPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  return (
    <div className="blog-post-page">
      <article className="blog-article">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <Link href="/blog">Blog</Link>
            <span className="sep">/</span>
            <span className="current">{post.title}</span>
          </div>

          <div className="blog-post-header">
            <span className="blog-category">{post.category}</span>
            <h1>{post.title}</h1>
            <div className="blog-meta">
              <span>By {post.author}</span>
              {post.publishedAt && (
                <>
                  <span className="dot">·</span>
                  <span>{new Date(post.publishedAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</span>
                </>
              )}
            </div>
          </div>

          {post.coverImage && (
            <div className="blog-cover">
              <img src={post.coverImage} alt={post.title} />
            </div>
          )}

          <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />

          {post.tags.length > 0 && (
            <div className="blog-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="blog-tag">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="blog-related-section">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Keep Reading</span>
              <h2>Related articles</h2>
            </div>
            <div className="blog-grid">
              {related.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="blog-card">
                  {p.coverImage && (
                    <div className="blog-card-image">
                      <img src={p.coverImage} alt={p.title} />
                    </div>
                  )}
                  <div className="blog-card-body">
                    <span className="blog-category">{p.category}</span>
                    <h3>{p.title}</h3>
                    <p>{p.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
