"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import type { Article } from "@/types/article";

async function fetchArticles(page: number) {
  const res = await fetch(`/api/articles?page=${page}`);
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
}

interface ArticleListProps {
  initialData: {
    articles: Article[];
    hasMore: boolean;
    nextPage: number | null;
  };
}

export default function ArticleList({ initialData }: ArticleListProps) {
  const { ref, inView } = useInView();
  const [editingId, setEditingId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  console.log(`initialData: ${JSON.stringify(initialData)}`);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["articles"],
      queryFn: ({ pageParam = 1 }) => fetchArticles(pageParam),
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: 1,
      initialData: {
        pages: [initialData],
        pageParams: [1],
      },
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const updateArticleTitle = (articleId: number, newTitle: string) => {
    queryClient.setQueryData(["articles"], (oldData: any) => ({
      ...oldData,
      pages: oldData.pages.map((page: any) => ({
        ...page,
        articles: page.articles.map((article: Article) =>
          article.id === articleId ? { ...article, title: newTitle } : article
        ),
      })),
    }));
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {data?.pages.map((page, i) => (
        <div key={i} className="space-y-6">
          {page.articles.map((article: Article) => (
            <article
              key={article.id}
              className="bg-white p-6 rounded-lg shadow"
            >
              {editingId === article.id ? (
                <input
                  type="text"
                  className="text-xl font-bold mb-2 p-1 border rounded"
                  defaultValue={article.title}
                  onBlur={(e) => updateArticleTitle(article.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateArticleTitle(article.id, e.currentTarget.value);
                    }
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  autoFocus
                />
              ) : (
                <h2
                  className="text-xl font-bold mb-2 cursor-pointer hover:text-blue-600"
                  onClick={() => setEditingId(article.id)}
                >
                  {article.title}
                </h2>
              )}
              <p className="text-gray-600">{article.content}</p>
              <time className="text-sm text-gray-500">
                {new Date(article.createdAt).toLocaleDateString()}
              </time>
            </article>
          ))}
        </div>
      ))}

      <div ref={ref} className="h-10 flex items-center justify-center">
        {isFetchingNextPage && <div>Loading more...</div>}
      </div>
    </div>
  );
}
