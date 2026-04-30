import { NextRequest, NextResponse } from "next/server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

export async function POST(req: NextRequest) {
  try {
    const { videoUrl } = await req.json();

    if (!videoUrl) {
      return NextResponse.json(
        { error: "Video URL is required" },
        { status: 400 }
      );
    }

    // 🔹 Extract Video ID
    const videoId = extractVideoId(videoUrl);

    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube Video URL" },
        { status: 400 }
      );
    }

    // 🔥 Fetch up to 150 comments (3 pages × 50)
    let allComments: string[] = [];
    let nextPageToken = "";
    let pages = 0;

    while (pages < 3) {
      const commentsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=50&pageToken=${nextPageToken}&key=${YOUTUBE_API_KEY}`
      );

      const commentsData = await commentsRes.json();

      if (!commentsData.items) break;

      const pageComments = commentsData.items.map(
        (item: any) =>
          item.snippet.topLevelComment.snippet.textDisplay
      );

      allComments.push(...pageComments);

      nextPageToken = commentsData.nextPageToken || "";

      if (!nextPageToken) break;

      pages++;
    }

    // 🔴 No comments found
    if (allComments.length === 0) {
      return NextResponse.json(
        { error: "No comments found or comments are disabled." },
        { status: 400 }
      );
    }

    const comments = allComments;

    // 🔥 AI ANALYSIS
    const aiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.5,
          messages: [
            {
              role: "system",
              content:
                "You are a YouTube growth strategist. Return only valid JSON.",
            },
            {
              role: "user",
              content: `
Analyze these YouTube comments:

${comments.join("\n")}

Return ONLY this JSON format:

{
  "complaints": [
    "point 1",
    "point 2"
  ],
  "questions": [
    "point 1",
    "point 2"
  ],
  "ideas": [
    "point 1",
    "point 2"
  ]
}
              `,
            },
          ],
        }),
      }
    );

    const aiData = await aiRes.json();

    if (!aiData.choices || !aiData.choices[0]) {
      return NextResponse.json(
        { error: "AI analysis failed" },
        { status: 500 }
      );
    }

    const rawText = aiData.choices[0].message.content;

    let parsedInsights;

    try {
      parsedInsights = JSON.parse(rawText);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      complaints: parsedInsights.complaints || [],
      questions: parsedInsights.questions || [],
      ideas: parsedInsights.ideas || [],
      totalCommentsAnalyzed: comments.length,
    });

  } catch (error) {
    console.error("Comment Analyzer Error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// 🔹 Extract Video ID
function extractVideoId(url: string) {
  try {
    if (url.includes("watch?v=")) {
      return url.split("v=")[1].split("&")[0];
    }

    if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1].split("?")[0];
    }

    if (url.length === 11) {
      return url;
    }

    return null;
  } catch {
    return null;
  }
}