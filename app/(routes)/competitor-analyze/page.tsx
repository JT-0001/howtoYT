"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Search, BarChart3 } from "lucide-react";
import CompetitorResults from "./_components/CompetitorResults";

export default function CompetitorAnalyzePage() {
  const [input, setInput] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeChannel = async () => {
    if (!input.trim()) {
      setError("Please enter a YouTube Channel URL or ID");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setData(null);

      const res = await fetch("/api/competitor-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Something went wrong");
        return;
      }

      setData(result);
    } catch (err) {
      setError("Failed to analyze channel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div className="px-10 md:px-20 lg:px-40">
        <div className="flex items-center justify-center mt-5 flex-col gap-2">
          <h2 className="font-bold text-4xl text-center">
            Competitor Channel Analyzer
          </h2>

          <p className="text-gray-400 text-center ">
            Analyze any YouTube competitor using AI-powered insights.
            Discover their top-performing videos, title strategies,
            thumbnail patterns, and posting frequency to reverse engineer
            what actually works. 🚀
          </p>
        </div>

        {/* Input + Button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            analyzeChannel();
          }}
          className="p-2 border rounded-xl flex gap-2 items-center bg-secondary mt-6"
        >
          <input
            type="text"
            placeholder="Paste YouTube Channel URL, @handle, or Channel ID"
            className="w-full p-2 outline-none bg-transparent"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <BarChart3 />
            )}
            Analyze
          </Button>
        </form>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 mt-4 text-center">
            {error}
          </p>
        )}
      </div>

      {/* Results Section */}
      <div className="px-10 md:px-20 lg:px-40">
        <CompetitorResults data={data} loading={loading} />
      </div>
    </div>
  );
}