"use client";
import AuthWrapper from "@/components/auth/AuthWrapper";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import debounce from "lodash.debounce";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";

interface Article {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  imageUrl: string;
  categories: string[];
  category: string;
}

export default function Articles() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const articlesPerPage = 9;

  // Fetch articles from MockAPI
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/articles`
        );
        setArticles(response.data);
        setFilteredArticles(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch articles");
        setLoading(false);
        console.error("Error fetching articles:", err);
      }
    };

    fetchArticles();
  }, []);

  // Extract unique categories from articles
  const allCategories = useMemo(() => {
    return Array.from(new Set(articles.map((article) => article.category)));
  }, [articles]);

  // Navigate to article detail
  const navigateToArticle = (id: string) => {
    router.push(`/articles/${id}`);
  };

  // Filter articles based on search and category
  const filterArticles = useMemo(
    () =>
      debounce((searchQuery: string, category: string) => {
        const filtered = articles.filter((article) => {
          const matchesSearch = article.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
          const matchesCategory = category
            ? article.category === category
            : true;
          return matchesSearch && matchesCategory;
        });
        setFilteredArticles(filtered);
        setCurrentPage(1); // Reset to first page when filters change
      }, 500),
    [articles]
  );

  // Apply filters when search or category changes
  useEffect(() => {
    filterArticles(search, selectedCategory);
    return () => {
      filterArticles.cancel();
    };
  }, [search, selectedCategory, filterArticles]);

  // Paginate articles
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    return filteredArticles.slice(startIndex, endIndex);
  }, [filteredArticles, currentPage]);

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Format date from createdAt
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <AuthWrapper>
      <section
        id="hero"
        className="h-screen relative flex items-center justify-center text-center px-4"
      >
        <div className="absolute inset-0">
          <Image
            src="/hero.jpg"
            alt="Hero Background"
            fill
            priority
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-[#2563EBDB] bg-opacity-[86%]" />
        </div>

        <div className="relative z-10 text-white max-w-3xl">
          <p className="text-sm uppercase tracking-wide mb-2">Blog GenZet</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            The Journal : Design Resources,
            <br className="hidden md:block" />
            Interviews, and Industry News
          </h1>
          <p className="text-lg mb-6">Your daily dose of design insights!</p>

          <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl mx-auto bg-blue-500 p-2 rounded-md">
            <div className="relative w-full text-black">
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All categories</SelectItem>
                    {allCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                placeholder="Search articles"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white text-black"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section id="articles" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <h3 className="text-xl font-medium">Error loading articles</h3>
              <p className="mt-2">{error}</p>
            </div>
          ) : (
            <>
              <p className="mb-6">
                Showing:{" "}
                <span className="font-medium">{filteredArticles.length}</span>{" "}
                of <span className="font-medium">{articles.length}</span>{" "}
                articles
              </p>

              {paginatedArticles.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium">No articles found</h3>
                  <p className="text-gray-500 mt-2">
                    Try adjusting your search or filters
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {paginatedArticles.map((article) => (
                      <article
                        key={article.id}
                        className="border rounded-2xl hover:shadow-md transition overflow-hidden cursor-pointer"
                        onClick={() => navigateToArticle(article.id)}
                      >
                        <div className="relative h-48">
                          <Image
                            src={article.imageUrl || "/article.png"}
                            alt={article.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-gray-400 mb-1">
                            {formatDate(article.createdAt)}
                          </p>
                          <h2 className="text-xl font-semibold mb-2">
                            {article.title}
                          </h2>
                          <p className="text-gray-600 mb-4">
                            {article.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {article.categories.map((cat, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="bg-blue-500 text-white"
                              >
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => handlePageChange(currentPage - 1)}
                              aria-disabled={currentPage === 1}
                              className={
                                currentPage === 1
                                  ? "pointer-events-none opacity-50"
                                  : undefined
                              }
                            />
                          </PaginationItem>

                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => handlePageChange(page)}
                                isActive={page === currentPage}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}

                          <PaginationItem>
                            <PaginationNext
                              onClick={() => handlePageChange(currentPage + 1)}
                              aria-disabled={currentPage === totalPages}
                              className={
                                currentPage === totalPages
                                  ? "pointer-events-none opacity-50"
                                  : undefined
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>
    </AuthWrapper>
  );
}
