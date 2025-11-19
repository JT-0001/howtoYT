"use client"
import { Button } from '@/components/ui/button'
import axios from 'axios';
import { Loader2, Search } from 'lucide-react'
import React, { useState } from 'react'
import ThumbnailSearchList from './_components/ThumbnailSearchList';
import { Skeleton } from '@/components/ui/skeleton';
import VideoListSkeleton from '@/app/_components/VideoListSkeleton';

export type VideoInfo = {
    id: string,
    title: string,
    description: string,
    thumbnail: string,
    channelTitle: string,
    publishedAt: string,
    viewCount: string,
    likeCount: string,
    commentCount: string,
}

function ThumbnailSearch() {
    const [userInput, setUserInput] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [videoList, setVideoList] = useState<VideoInfo[]>();

    const onSearch = async () => {
        setLoading(true)
        const result = await axios.get('/api/thumbnail-search?query=' + userInput);
        console.log(result.data);
        setLoading(false);
        setVideoList(result.data);
    }

    const SearchSimilerThumbnail = async (url: string) => {
        setLoading(true)
        const result = await axios.get('/api/thumbnail-search?thumbnailUrl=' + url);
        console.log(result.data);
        setLoading(false);
        setVideoList(result.data);
    }

    return (
        <div className=''>
            <div className='px-10 md:px-20 lg:px-40'>
                <div className='flex items-center justify-center mt-5 flex-col gap-2 '>
                    <h2 className='font-bold text-4xl'>AI Thumbnail Search 🔍✨</h2>
                    <p className='text-gray-400 text-center '>Discover thumbnails that match your content using smart AI-powered search.
                        Just enter a title or keyword and get visually similar YouTube thumbnails in seconds!</p>
                </div>
                <div className=' p-2 border rounded-xl flex gap-2 items-center bg-secondary mt-5'>
                    <input type='text' placeholder='Enter any topic/prompt to search '
                        className='w-full p-2 outline-none bg-transparent'
                        onChange={(event) => setUserInput(event.target.value)}
                    />
                    <Button onClick={onSearch} disabled={loading || !userInput}>
                        {loading ? <Loader2 className='animate-spin' /> : <Search />}Search </Button>
                </div>
            </div>

            <div>
                {loading ?
                    <VideoListSkeleton />

                    :
                    <ThumbnailSearchList videoList={videoList}
                        SearchSimilerThumbnail={(url: string) => SearchSimilerThumbnail(url)} />

                }
            </div>
        </div>
    )
}

export default ThumbnailSearch