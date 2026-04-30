import { NextResponse } from "next/server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

export async function POST(req: Request) {
    try {
        const { input } = await req.json();

        if (!input) {
            return NextResponse.json(
                { error: "Channel URL or ID is required" },
                { status: 400 }
            );
        }

        let channelId = "";

        // ---------- CHANNEL ID EXTRACTION ----------
        if (input.startsWith("UC")) {
            channelId = input;
        } else if (input.includes("/channel/")) {
            channelId = input.split("/channel/")[1].split(/[/?]/)[0];
        } else if (input.includes("@")) {
            const handle = input.includes("/@")
                ? input.split("/@")[1].split(/[/?]/)[0]
                : input.replace("@", "");

            const handleRes = await fetch(
                `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${handle}&key=${YOUTUBE_API_KEY}`
            );
            const handleData = await handleRes.json();

            if (!handleData.items?.length)
                return NextResponse.json(
                    { error: "Channel not found from handle" },
                    { status: 404 }
                );

            channelId = handleData.items[0].id;
        }

        if (!channelId)
            return NextResponse.json(
                { error: "Invalid channel URL or ID" },
                { status: 400 }
            );

        // ---------- CHANNEL INFO ----------
        const channelRes = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet,statistics&id=${channelId}&key=${YOUTUBE_API_KEY}`
        );
        const channelData = await channelRes.json();

        if (!channelData.items?.length)
            return NextResponse.json(
                { error: "Channel not found" },
                { status: 404 }
            );

        const channel = channelData.items[0];
        const uploadsPlaylistId =
            channel.contentDetails.relatedPlaylists.uploads;

        // ---------- FETCH VIDEOS ----------
        const playlistRes = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=${uploadsPlaylistId}&key=${YOUTUBE_API_KEY}`
        );
        const playlistData = await playlistRes.json();

        const videoIds = playlistData.items
            .map((item: any) => item.snippet.resourceId.videoId)
            .join(",");

        const videosRes = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
        );
        const videosData = await videosRes.json();

        const videos = videosData.items;

        const sortedVideos = [...videos].sort(
            (a, b) =>
                Number(b.statistics.viewCount) -
                Number(a.statistics.viewCount)
        );

        const topVideos = sortedVideos.slice(0, 5);

        const titles = videos.map((v: any) => v.snippet.title);

        const publishDates = videos.map((v: any) =>
            new Date(v.snippet.publishedAt).getTime()
        );

        // ---------- POSTING FREQUENCY ----------
        publishDates.sort((a: number, b: number) => b - a);

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
                gaps.reduce((sum, g) => sum + g, 0) / gaps.length;

            if (avgGap <= 2) postingFrequency = "Daily uploads";
            else if (avgGap <= 7) postingFrequency = "Weekly uploads";
            else if (avgGap <= 14) postingFrequency = "Bi-weekly uploads";
            else postingFrequency = "Irregular uploads";
        }

        // ---------- AI ANALYSIS ----------

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
                    temperature: 0.7,
                    messages: [
                        {
                            role: "system",
                            content: "You are a YouTube growth analyst. Be concise and structured."
                        },
                        {
                            role: "user",
                            content: `
Analyze this competitor channel:

Titles:
${titles.join("\n")}

Posting Frequency:
${postingFrequency}

Return in this exact format:

TITLE FORMULA:
- bullet points

PSYCHOLOGICAL HOOKS:
- bullet points

THUMBNAIL STYLE:
- bullet points

HOW TO OUTPERFORM:
- bullet points

Keep it under 12 total bullet points.
Be sharp and practical.
`
                        }
                    ]
                }),
            }
        );

        const aiData = await aiRes.json();
        const aiInsights =
            aiData?.choices?.[0]?.message?.content ||
            "AI analysis unavailable";

        return NextResponse.json({
            channel: {
                title: channel.snippet.title,
                subscribers: channel.statistics.subscriberCount,
                totalViews: channel.statistics.viewCount,
            },
            topVideos,
            postingFrequency,
            aiInsights,
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}