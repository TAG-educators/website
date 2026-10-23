import Link from "next/link";
import { fetchPublishedBlogPosts } from "@/lib/blog";
import "../public.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog — TAG Educators",
  description: "Articles, study tips, and insights from TAG Educators tutors.",
};

export default async function BlogPage() {
  const { data: posts } = await fetchPublishedBlogPosts();

  // Group by category
  const categories = [...new Set(posts.map((p) => p.category))];
  const featured = posts.find((p) => p.tags.includes("featured")) || posts[0];
  const rest = posts.filter((p) => p.id !== featured?.id);

  return (
    <div className="catalog-page">
      <div className="wrap">
        <div className="section-head" style={{ textAlign: "left", marginBottom: 48 }}>
          <span className="eyebrow">Insights</span>
          <h1 style={{ fontSize: "var(--fs-h2)" }}>Blog & Articles</h1>
          <p>Study tips, exam strategies, and insights from our specialist tutors.</p>
        </div>

        {posts.length === 0 ? (
          <div className="public-empty">
            <p>No articles published yet.</p>
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featured && (
              <Link href={`/blog/${featured.slug}`} className="blog-featured-card">
                {featured.coverImage && (
                  <div className="blog-featured-image">
                    <img src={featured.coverImage} alt={featured.title} />
                  </div>
                )}
                <div className="blog-featured-body">
                  <span className="blog-category">{featured.category}</span>
                  <h2>{featured.title}</h2>
                  <p>{featured.excerpt}</p>
                  <div className="blog-meta">
                    <span>{featured.author}</span>
                    {featured.publishedAt && (
                      <>
                        <span className="dot">·</span>
                        <span>{new Date(featured.publishedAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            )}

            {/* Category chips */}
            {categories.length > 1 && (
              <div className="resource-filters" style={{ marginTop: 40 }}>
                <span className="filter-label">Categories:</span>
                {categories.map((cat) => (
                  <span key={cat} className="filter-chip">{cat}</span>
                ))}
              </div>
            )}

            {/* Post grid */}
            {rest.length > 0 && (
              <div className="blog-grid" style={{ marginTop: 32 }}>
                {rest.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="blog-card">
                    {post.coverImage && (
                      <div className="blog-card-image">
                        <img src={post.coverImage} alt={post.title} />
                      </div>
                    )}
                    <div className="blog-card-body">
                      <span className="blog-category">{post.category}</span>
                      <h3>{post.title}</h3>
                      <p>{post.excerpt}</p>
                      <div className="blog-meta">
                        <span>{post.author}</span>
                        {post.publishedAt && (
                          <>
                            <span className="dot">·</span>
                            <span>{new Date(post.publishedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
