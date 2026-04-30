import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// create OpenAI instance here (replace Inngest dependency)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function GET(req: NextRequest) {

    const { searchParams } = new URL(req.url);
    let query = searchParams.get('query');
    const thumbnailUrl = searchParams.get('thumbnailUrl');

    if (thumbnailUrl) {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `Describe this thumbnail in short keywords suitable for YouTube search. 
Give comma-separated tags only. Max 5 tags. No explanation.`
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: thumbnailUrl
                            }
                        }
                    ]
                }
            ]
        });

        query = completion.choices[0].message.content || "";
    }

    console.log(query);

    const result = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&videoDuration=long&maxResults=20&key=${process.env.YOUTUBE_API_KEY}`
    );

    const searchData = result.data;
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');

    const videoResult = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${process.env.YOUTUBE_API_KEY}`
    );

    const FinalResult = videoResult.data.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        channelTitle: item.snippet.channelTitle,
        publishAt: item.snippet.publishAt,
        viewCount: item.statistics.viewCount,
        likeCount: item.statistics.likeCount,
        commentCount: item.statistics.commentCount,
    }));

    return NextResponse.json(FinalResult);
}