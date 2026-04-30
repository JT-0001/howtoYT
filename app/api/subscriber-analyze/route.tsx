import { NextResponse } from "next/server";
import OpenAI from "openai";

const YT_API_KEY = process.env.YOUTUBE_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    if (!YT_API_KEY || !OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing API keys" },
        { status: 500 }
      );
    }

    const { yourUrl, competitorUrl, videoCount = 15 } =
      await req.json();

    if (!yourUrl) {
      return NextResponse.json(
        { error: "Your channel URL is required" },
        { status: 400 }
      );
    }

    const yourChannelId = await extractChannelId(yourUrl);
    const competitorChannelId = competitorUrl
      ? await extractChannelId(competitorUrl)
      : null;

    const yourData = await analyzeChannel(
      yourChannelId,
      videoCount
    );

    let competitorData = null;

    if (competitorChannelId) {
      competitorData = await analyzeChannel(
        competitorChannelId,
        videoCount
      );
    }

    return NextResponse.json({
      yourData,
      competitorData,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}

/* ------------------- ANALYZE CHANNEL ------------------- */

async function analyzeChannel(
  channelId: string,
  videoCount: number
) {

  /* ---------- Channel Info ---------- */

  const channelRes = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=statistics,contentDetails,snippet&id=${channelId}&key=${YT_API_KEY}`
  );

  const channelData = await channelRes.json();
  const channel = channelData.items[0];

  const subscribers = Number(
    channel.statistics.subscriberCount
  );

  const uploadsPlaylist =
    channel.contentDetails.relatedPlaylists.uploads;

  /* ---------- Recent Videos ---------- */

  const playlistRes = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${videoCount}&playlistId=${uploadsPlaylist}&key=${YT_API_KEY}`
  );

  const playlistData = await playlistRes.json();

  const videoIds = playlistData.items
    .map((item: any) => item.snippet.resourceId.videoId)
    .join(",");

  const videosRes = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${YT_API_KEY}`
  );

  const videosData = await videosRes.json();
  const videos = videosData.items;

  let totalViews = 0;
  let totalLikes = 0;
  let totalComments = 0;
  const viewsArray: number[] = [];

  videos.forEach((video: any) => {
    const views = Number(video.statistics.viewCount);
    totalViews += views;
    totalLikes += Number(video.statistics.likeCount || 0);
    totalComments += Number(video.statistics.commentCount || 0);
    viewsArray.push(views);
  });

  const avgViews = Math.floor(totalViews / videos.length);

  const reachPercent = Number(
    ((avgViews / subscribers) * 100).toFixed(2)
  );

  const engagementRate = Number(
    (((totalLikes + totalComments) / totalViews) * 100).toFixed(2)
  );

  /* ---------- Trend ---------- */

  const mid = Math.floor(viewsArray.length / 2);

  const firstHalf =
    viewsArray.slice(0, mid).reduce((a, b) => a + b, 0) / mid;

  const secondHalf =
    viewsArray.slice(mid).reduce((a, b) => a + b, 0) /
    (viewsArray.length - mid);

  const trendPercent = Number(
    (((secondHalf - firstHalf) / firstHalf) * 100).toFixed(2)
  );

  /* ---------- Upload Frequency ---------- */

  const publishDates = videos
    .map((v: any) =>
      new Date(v.snippet.publishedAt).getTime()
    )
    .sort((a: number, b: number) => b - a);

  let postingFrequency = "Not enough data";

  if (publishDates.length > 1) {
    const gaps: number[] = [];

    for (let i = 1; i < publishDates.length; i++) {
      gaps.push(
        (publishDates[i - 1] - publishDates[i]) /
          (1000 * 60 * 60 * 24)
      );
    }

    const avgGap =
      gaps.reduce((sum, g) => sum + g, 0) /
      gaps.length;

    if (avgGap <= 2)
      postingFrequency = "Daily uploads";
    else if (avgGap <= 7)
      postingFrequency = "Weekly uploads";
    else if (avgGap <= 14)
      postingFrequency = "Bi-weekly uploads";
    else postingFrequency = "Irregular uploads";
  }

  /* ---------- Health Score ---------- */

  let score = 0;
  score += Math.min(reachPercent * 3, 30);
  score += Math.min(engagementRate * 5, 25);
  score += trendPercent > 0 ? 20 : 10;

  const healthScore = Math.min(Math.floor(score), 100);

  /* ---------- REAL AI CALL ---------- */

 const aiPrompt = `
You are a professional YouTube growth strategist.

Analyze this data and respond concisely.

Channel Data:
Subscribers: ${subscribers}
Average Views: ${avgViews}
Subscriber Reach: ${reachPercent}%
Engagement Rate: ${engagementRate}%
Trend: ${trendPercent}%
Posting Frequency: ${postingFrequency}
Health Score: ${healthScore}/100

Rules:
- Keep diagnosis under 3 short sentences.
- Give EXACTLY 3 actionable recommendations.
- Each recommendation must be one short sentence.
- Biggest opportunity must be 1 powerful sentence.
- Be direct and strategic.
- No fluff.
- Return STRICT JSON only.

Format:
{
  "diagnosis": "short paragraph",
  "recommendations": ["rec1", "rec2", "rec3"],
  "biggestOpportunity": "one short sentence"
}
`;

  const aiResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content:
          "You are an expert YouTube growth consultant."
      },
      { role: "user", content: aiPrompt }
    ]
  });

  const aiRaw = aiResponse.choices[0].message.content;

  let aiStructured = null;

  try {
    aiStructured = JSON.parse(aiRaw || "{}");
  } catch {
    aiStructured = {
      diagnosis: aiRaw,
      recommendations: [],
      biggestOpportunity: ""
    };
  }

  return {
    title: channel.snippet.title,
    subscribers,
    avgViews,
    reachPercent,
    engagementRate,
    trendPercent,
    postingFrequency,
    healthScore,
    ai: aiStructured
  };
}

/* ---------- Extract Channel ID ---------- */

async function extractChannelId(input: string) {

  if (input.startsWith("UC")) return input;

  if (input.includes("/channel/"))
    return input.split("/channel/")[1].split(/[/?]/)[0];

  if (input.includes("@")) {

    const handle = input.split("@")[1].split(/[/?]/)[0];

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${handle}&key=${YT_API_KEY}`
    );

    const data = await res.json();
    return data.items[0].id;
  }

  return input;
}