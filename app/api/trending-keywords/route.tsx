import { db } from "@/configs/db";
import { TrendingKeywordsTable } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    const user = await currentUser();

    const youtubeResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          key: process.env.YOUTUBE_API_KEY,
          part: "snippet",
          q: query,
          maxResults: 9,
        },
      }
    );

    const titles = youtubeResponse.data.items.map(
      (item: any) => item.snippet.title
    );

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "user",
          content: `
Generate SEO keywords from:
${JSON.stringify(titles)}

Return JSON:
{
  "main_keyword": "${query}",
  "keywords": [
    {
      "keyword": "",
      "score": 0,
      "related_queries": []
    }
  ]
}
          `,
        },
      ],
    });

    let raw = aiResponse.choices[0].message.content || "";
    raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { main_keyword: query, keywords: [] };
    }

    // ✅ SAVE TO DB (FIXED)
    await db.insert(TrendingKeywordsTable).values({
      userInput: query,
      keywordsData: parsed,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdOn: new Date().toISOString(),
    });

    return NextResponse.json({
      main_keyword: parsed.main_keyword,
      keywords: parsed.keywords,
      titles,
    });

  } catch (err: any) {
    console.error("API ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}