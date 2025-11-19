import React from 'react'
import { VideoInfo } from '../page'
import Image from 'next/image'
import { ExternalLink, Eye, ThumbsUp } from 'lucide-react'
import { VideoInfoOutlier } from '../../outlier/page'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from 'next/link'
type props = {
    videoInfo: VideoInfoOutlier
}
function VideoOutlierCard({ videoInfo }: props) {


    return (
        <div className='p-2 border rounded-2xl cursor-pointer  relative'>
            <Tooltip>
                <TooltipTrigger asChild>
                    <h2 className='absolute right-2 p-1 bg-blue-500 text-white rounded-sm'>{(videoInfo.smartScore * 10).toFixed(2)}x</h2>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Outlier and Smartscore</p>
                </TooltipContent>
            </Tooltip>
            <Image src={videoInfo.thumbnail} alt={videoInfo.title}
                width={300}
                height={300}
                className='rounded-xl object-cover aspect-video'
            />
            <h2>{videoInfo.title}</h2>
            <h2 className='text-xs text-gray-400'>{videoInfo.channelTitle}</h2>
            <div className='flex justify-between items-center mt-1'>
                <h2 className='flex gap-2 items-center text-xs text-gray-400'> <Eye className='h-4 w-4' /> {videoInfo.viewCount}</h2>
                <div className='flex gap-2 items-center'>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <h2 className='flex gap-2 items-center text-xs text-white bg-red-500 p-1 rounded-sm'> <ThumbsUp className='h-4 w-4' /> {videoInfo.engagementRate}</h2>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>EngagementRate</p>
                        </TooltipContent>
                    </Tooltip>
                    <Link href={`https://www.youtube.com/watch?v=${videoInfo.id}`} target='_blank'>
                        <ExternalLink className='h-5 w-5' />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default VideoOutlierCard