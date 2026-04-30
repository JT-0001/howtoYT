"use client";

import { useState } from "react";
import CommentResults from "./_components/CommentResults";
import { Loader2, Search } from "lucide-react";

export default function CommentAnalyzerPage() {
  const [input, setInput] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeComments = async () => {
    if (!input) return;

    try {
      setLoading(true);
      setError("");
      setData(null);

      const res = await fetch("/api/comment-analyzer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoUrl: input,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Something went wrong");
        return;
      }

      setData(result); // ✅ FIXED
    } catch (error) {
      setError("Failed to analyze comments");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-10 md:px-20 lg:px-40">

      <div className="text-center mt-6">
        <h1 className="text-4xl font-bold">
          Comment Sentiment Analyzer
        </h1>

        <p className="text-gray-400 mt-2">
          Discover what viewers really want from competitor videos 💡
        </p>
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          analyzeComments();
        }}
        className="flex gap-2 mt-6 border p-3 rounded-xl bg-secondary"
      >
        <input
          className="w-full bg-transparent outline-none"
          placeholder="Paste YouTube Video URL..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Search />
          )}
        </button>
      </form>

      {/* Error */}
      {error && (
        <p className="text-red-500 mt-4">
          {error}
        </p>
      )}

      {/* Results */}
      <CommentResults data={data} loading={loading} />

    </div>
  );
}