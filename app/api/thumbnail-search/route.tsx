import { openai } from "@/inngest/functions";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    const { searchParams } = new URL(req.url);
    let query = searchParams.get('query');
    const thumbnailUrl = searchParams.get('thumbnailUrl');

    if (thumbnailUrl) {
        //AI Model Call
        const completion = await openai.chat.completions.create({
            model: 'google/gemini-2.5-flash',
            messages: [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": `Describe this thumbnail in short keywords suitable for searching similar YouTube videos, 
Give me tags with comm separated. Do not give any comment text, Maximum 5 tags. 
Make sure after searching that tags will get similer yotuube thumnails`
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": thumbnailUrl
                            }
                        }
                    ]
                }
            ]
        });

        const result = completion.choices[0].message.content;
        query = result;

    }

    console.log(query);
    //Get Youtube Video List API
    const result = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&videoDuration=long&maxResults=20&key=` + process.env.YOUTUBE_API_KEY)
    const searchData = result.data;
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
    console.log(videoIds);

    //Get Youtube Video Detaisl By ID API
    const videoResult = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${process.env.YOUTUBE_API_KEY}`)

    const videoResultData = videoResult.data;
    const FinalResult = videoResultData.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        channelTitle: item.snippet.channelTitle,
        publishAt: item.snippet.publishAt,
        viewCount: item.statistics.viewCount,
        likeCount: item.statistics.likeCount,
        commentCount: item.statistics.commentCount,

    }))

    return NextResponse.json(FinalResult)

}