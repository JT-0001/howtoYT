import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    // Step 1: Fetch YouTube video titles
    const youtubeResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          key: process.env.YOUTUBE_API_KEY,
          part: "snippet",
          q: query,
          maxResults: 20,
        },
      }
    );

    const titles = youtubeResponse.data.items.map(
      (item: any) => item.snippet.title
    );

    // Step 2: Extract keywords with weighted scoring
    const keywordsMap: Record<string, { score: number; related: Set<string> }> = {};

    titles.forEach((title: string) => {
      const cleanTitle = title.toLowerCase().replace(/[^a-z0-9 ]/g, "");
      const words = cleanTitle.split(" ").filter(w => w.length > 3);

      words.forEach((word, index) => {
        const weight = (words.length - index) / words.length; // higher for earlier words

        if (!keywordsMap[word]) keywordsMap[word] = { score: 0, related: new Set() };
        keywordsMap[word].score += weight;

        // Add related words
        words.forEach((w) => {
          if (w !== word) keywordsMap[word].related.add(w);
        });
      });

      // Step 2b: Add bigrams
      for (let i = 0; i < words.length - 1; i++) {
        const bigram = words[i] + " " + words[i + 1];
        if (!keywordsMap[bigram]) keywordsMap[bigram] = { score: 0, related: new Set() };
        keywordsMap[bigram].score += 1; // bigrams get simpler weight

        // related words for bigram
        words.forEach((w) => {
          if (w !== words[i] && w !== words[i + 1]) keywordsMap[bigram].related.add(w);
        });
      }
    });

    // Step 3: Normalize scores to 1-100 range
    const keywordsArray = Object.entries(keywordsMap).map(([keyword, data]) => ({
      keyword,
      rawScore: data.score,
      related_queries: Array.from(data.related).slice(0, 5),
    }));

    const maxScore = Math.max(...keywordsArray.map(k => k.rawScore));
    const minScore = Math.min(...keywordsArray.map(k => k.rawScore));

    const keywords = keywordsArray
      .sort((a, b) => b.rawScore - a.rawScore)
      .slice(0, 10)
      .map(k => ({
        keyword: k.keyword,
        score: Math.round(((k.rawScore - minScore) / (maxScore - minScore)) * 99 + 1), // scaled 1-100
        related_queries: k.related_queries
      }));

    const response = {
      main_keyword: query,
      keywords,
      titles,
    };

    return NextResponse.json(response);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
