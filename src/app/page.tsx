import ArticleList from "@/components/ArticleList";
import Header from "@/components/Header";

async function getInitialArticles() {
  const res = await fetch("http://localhost:3000/api/articles?page=1", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch articles");
  return res.json();
}

export default async function Home() {
  const initialData = await getInitialArticles();

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 pt-20">
        <ArticleList initialData={initialData} />
      </main>
    </>
  );
}
