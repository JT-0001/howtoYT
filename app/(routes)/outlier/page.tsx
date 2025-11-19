"use client";

import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Loader2, Search } from 'lucide-react';
import React, { useState } from 'react';
import { VideoInfo } from '../thumbnail-search/page';
import VideoOutlierCard from '../thumbnail-search/_components/VideoOutlierCard';
import VideoListSkeleton from '@/app/_components/VideoListSkeleton';

// Type definition for the enriched video info used to highlight outliers
export type VideoInfoOutlier = {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    channelTitle: string;
    publishedAt: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    smartScore: number;
    viewsPerDay: number;
    isOutlier: boolean;
    engagementRate: number;
    outlierScore: number;
};

/**
 * Outlier Component
 * 
 * Allows users to search for YouTube videos and identify high-performing "outlier" videos 
 * based on metrics like views, engagement rate, and smart scoring.
 */
function Outlier() {
    // State to hold user input from the search bar
    const [userInput, setUserInput] = useState<string>();

    // Loading state to toggle between skeleton and actual results
    const [loading, setLoading] = useState(false);

    // List of videos fetched from the backend, enriched with outlier info
    const [videoList, setVideoList] = useState<VideoInfoOutlier[]>();

    /**
     * Handles the search functionality.
     * Sends the query to `/api/outlier` which returns a list of enriched videos.
     */
    const onSearch = async () => {
        try {
            setLoading(true);

            // API call to fetch videos with outlier metadata
            const result = await axios.get('/api/outlier?query=' + userInput);
            console.log(result.data);

            setVideoList(result.data);
            setLoading(false);
        } catch (e) {
            console.error("Failed to fetch outlier videos", e);
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className='px-10 md:px-20 lg:px-40'>
                <div className='flex items-center justify-center mt-5 flex-col gap-2'>
                    <h2 className='font-bold text-4xl'>Outlier 🔍✨</h2>
                    <p className='text-gray-400 text-center'>
                        Discover standout videos by spotting outliers in views, likes, and engagement.
                        Analyze your video’s performance with smart scoring to optimize growth and reach!
                    </p>
                </div>

                {/* Input + Search Button */}
                <div className='p-2 border rounded-xl flex gap-2 items-center bg-secondary mt-5'>
                    <input
                        type='text'
                        placeholder='Enter any topic to search'
                        className='w-full p-2 outline-none bg-transparent'
                        onChange={(event) => setUserInput(event.target.value)}
                    />
                    <Button onClick={onSearch} disabled={loading || !userInput}>
                        {loading ? <Loader2 className='animate-spin' /> : <Search />} Search
                    </Button>
                </div>
            </div>

            {/* Video Grid or Skeleton */}
            {!loading ? (
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-7'>
                    {videoList?.map((video, index) => (
                        <div key={index}>
                            <VideoOutlierCard videoInfo={video} />
                        </div>
                    ))}
                </div>
            ) : (
                <VideoListSkeleton />
            )}
        </div>
    );
}

export default Outlier;
