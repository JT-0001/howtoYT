import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Features = [

    {
        id: 1,
        title: 'AI Thumbnail Search',
        image: '/searchthumbnail.png',
        path: '/thumbnail-search'
    },
    {
        id: 2,
        title: 'Content Generator',
        image: '/contentgenerate.png',
        path: '/ai-content-generator'
    },
    {
        id: 3,
        title: 'Outlier',
        image: '/outlier.png',
        path: '/outlier'
    },
    {
        id: 4,
        title: 'Trending Keywords',
        image: '/trendingkeywords.png',
        path: '/trending-keywords'
    },
    {
        id: 5,
        title: 'AI Thumbnail Generator',
        image: '/thumbnailgenerate.png',
        path: '/ai-thumbnail-generator'
    },
    {
        id: 6,
        title: 'Competitor Analyzer',
        image: '/competitoranalyzer.png',
        path: '/competitor-analyze'
    },
    {
        id: 7,
        title: "Subscriber-to-View Analyzer",
        image: "/subscriberanalyzer.png",
        path: "/subscriber-analyze"
    },
    {
        id: 8,
        title: 'Comment Analyzer',
        image: '/commentanalyzer.png',
        path: '/comment-analyzer'
    }
    // {
    //     id: 6,
    //     title: 'Optimze Video Collection',
    //     image: '/feature6.png',
    //     path: '/optimize'
    // }
]

function FeatureList() {
    return (
        <div className='mt-7'>
            <h2 className='font-bold text-2xl'>AI Tools</h2>
            
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-3'>
                {Features.map((feature, index) => (
                    <Link href={feature.path} key={index}>
                        <Image src={feature.image} alt={feature.title}
                            width={500}
                            height={500}
                            className='w-full object-cover aspect-video rounded-xl
                             hover:scale-105 transition-all cursor-pointer'
                        />
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default FeatureList