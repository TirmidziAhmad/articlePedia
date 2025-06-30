"use client";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

interface Article {
  id: string;
  title: string;
  createdAt: string;
  author: string;
  imageUrl: string;
  content: string;
  categories: string[];
  description: string;
}

export default function DetailArticle() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch the main article
        const articleRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/articles/${articleId}`
        );
        if (!articleRes.data) throw new Error("Article not found");
        setArticle(articleRes.data);

        // Fetch related articles (from same category if available)
        const categoryFilter = articleRes.data.categories?.[0]
          ? `?category=${articleRes.data.categories[0]}`
          : "";

        const relatedRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/articles${categoryFilter}`
        );

        // Filter out the current article and limit to 3
        setRelatedArticles(
          relatedRes.data
            .filter((item: Article) => item.id !== articleId)
            .slice(0, 3)
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching the article"
        );
      } finally {
        setLoading(false);
      }
    };

    if (articleId) fetchData();
  }, [articleId]);

  const navigateToArticle = (id: string) => {
    router.push(`/articles/${id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <h3 className="text-xl font-medium">Error loading article</h3>
        <p className="mt-2">{error}</p>
        <button
          onClick={() => router.push("/articles")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Articles
        </button>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium">Article not found</h3>
        <button
          onClick={() => router.push("/articles")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Articles
        </button>
      </div>
    );
  }

  return (
    <main className="mx-auto px-4 md:px-6 py-8 max-w-4xl">
      {/* Article Header */}
      <div className="mb-8 text-center">
        <div className="flex justify-center gap-4 text-sm text-gray-500 mb-4">
          <span>{formatDate(article.createdAt)}</span>
          {article.author && <span>• Created by {article.author}</span>}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          {article.title}
        </h1>
        {article.description && (
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {article.description}
          </p>
        )}
      </div>

      {/* Article Image */}
      <div className="mb-8 rounded-xl overflow-hidden">
        <Image
          src={article.imageUrl || "/article-placeholder.jpg"}
          alt={article.title}
          width={1200}
          height={630}
          className="w-full h-auto object-cover"
          priority
        />
      </div>

      {/* Article Content */}
      <article className="prose prose-lg max-w-none mb-12">
        {article.content.split("\n").map((paragraph, index) =>
          paragraph.trim() ? (
            <p key={index} className="mb-6">
              {paragraph}
            </p>
          ) : null
        )}
      </article>

      {/* Categories */}
      {article.categories?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-12">
          {article.categories.map((category, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              {category}
            </Badge>
          ))}
        </div>
      )}

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="pt-8 ">
          <h2 className="text-2xl font-bold mb-6">
            {article.categories?.[0]
              ? `More in ${article.categories[0]}`
              : "More articles"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((related) => (
              <article
                key={related.id}
                className="border rounded-2xl hover:shadow-md transition overflow-hidden cursor-pointer"
                onClick={() => navigateToArticle(related.id)}
              >
                <div className="relative h-48">
                  <Image
                    src={related.imageUrl || "/article.jpg"}
                    alt={related.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-400 mb-1">
                    {formatDate(related.createdAt)}
                  </p>
                  <h3 className="text-lg font-semibold mb-2">
                    {related.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2 mb-3">
                    {related.description}
                  </p>
                  {related.categories?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {related.categories.slice(0, 2).map((cat, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="bg-blue-500 text-white text-xs"
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
