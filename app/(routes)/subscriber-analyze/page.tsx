"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, BarChart3 } from "lucide-react";
import SubscriberResults from "./_components/SubscriberResults";

export default function SubscriberAnalyzePage() {
  const [yourUrl, setYourUrl] = useState("");
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [videoCount, setVideoCount] = useState(15);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeChannel = async () => {
    if (!yourUrl.trim()) {
      setError("Please enter your channel URL");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setData(null);

      const res = await fetch("/api/subscriber-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          yourUrl,
          competitorUrl,
          videoCount,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Something went wrong");
        return;
      }

      setData(result);
    } catch {
      setError("Failed to analyze channel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="px-10 md:px-20 lg:px-40">

        {/* Header */}
        <div className="flex items-center justify-center mt-5 flex-col gap-3">
          <h2 className="font-bold text-4xl text-center">
            Subscriber-to-View Analyzer
          </h2>

          <p className="text-gray-400 text-center">
            Discover how effectively your subscribers convert into views.
            Analyze reach percentage, engagement rate, growth trend, and
            receive concise AI recommendations to improve performance. 🚀
          </p>
        </div>

        {/* Only One Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            analyzeChannel();
          }}
          className="p-4 border rounded-xl flex flex-col gap-3 bg-secondary mt-6"
        >
          <input
            type="text"
            placeholder="Your Channel URL, @handle, or Channel ID"
            className="w-full p-3 outline-none bg-transparent border rounded-md"
            value={yourUrl}
            onChange={(e) => setYourUrl(e.target.value)}
          />

          <input
            type="text"
            placeholder="Competitor Channel (Optional)"
            className="w-full p-3 outline-none bg-transparent border rounded-md"
            value={competitorUrl}
            onChange={(e) => setCompetitorUrl(e.target.value)}
          />

          <div className="flex flex-col md:flex-row gap-3 items-center">
            <select
              className="border p-3 rounded-md w-full md:w-auto"
              value={videoCount}
              onChange={(e) => setVideoCount(Number(e.target.value))}
            >
              <option value={10}>Last 10 Videos</option>
              <option value={20}>Last 20 Videos</option>
              <option value={30}>Last 30 Videos</option>
            </select>

            <Button
              type="submit"
              disabled={loading || !yourUrl.trim()}
              className="flex items-center gap-2 w-full md:w-auto"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <BarChart3 />
              )}
              {loading ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
        </form>

        {error && (
          <p className="text-red-500 mt-4 text-center">
            {error}
          </p>
        )}
      </div>

      {/* Results */}
      <div className="px-10 md:px-20 lg:px-40">
        <SubscriberResults data={data} />
      </div>
    </div>
  );
}