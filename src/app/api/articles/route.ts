import { NextResponse } from "next/server";
import type { Article } from "@/types/article";

// Mock data generator
function generateArticles(page: number): Article[] {
  return Array.from({ length: 20 }, (_, i) => ({
    id: page * 20 + i,
    title: `Article ${page * 20 + i + 1}`,
    content: `This is the content for article ${page * 20 + i + 1}...`,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");

  // Simulate server delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const articles = generateArticles(page - 1);

  return NextResponse.json({
    articles,
    hasMore: page < 5, // Limit to 5 pages for demo
    nextPage: page < 5 ? page + 1 : null,
  });
}
