import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Features = [
    {
        id: 1,
        title: 'AI Thumbnail Generator',
        image: '/thumbnailgenerate.png',
        path: '/ai-thumbnail-generator'
    },
    {
        id: 2,
        title: 'AI Thumbnail Search',
        image: '/searchthumbnail.png',
        path: '/thumbnail-search'
    },
    {
        id: 3,
        title: 'Content Generator',
        image: '/feature4.png',
        path: '/ai-content-generator'
    },
    {
        id: 4,
        title: 'Outlier',
        image: '/feature3.png',
        path: '/outlier'
    },
    {
        id: 5,
        title: 'Trending Keywords',
        image: '/feature5.png',
        path: '/trending-keywords'
    },
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

            <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-3'>
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