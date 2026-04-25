import Link from "next/link";
import { getNotFound } from "@/lib/content";

const nf = getNotFound();

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <h1 className="text-6xl font-black mb-4">{nf.code}</h1>
      <p className="text-xl text-muted mb-8">{nf.message}</p>
      <Link
        href="/"
        className="bg-white text-black font-bold px-6 py-3 rounded hover:bg-gray-200 transition-colors"
      >
        {nf.cta}
      </Link>
    </div>
  );
}
