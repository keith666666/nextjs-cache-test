import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-xl font-bold">My Blog</h1>
        <nav>
          <Link href="/" className="mr-4">
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}
