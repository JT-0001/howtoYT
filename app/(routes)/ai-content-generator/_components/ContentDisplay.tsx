import React from 'react'
import { Content } from '../page'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
    content: Content,   // The generated content object including titles, description, tags, and thumbnail
    loading: boolean    // Loading state used to show skeletons
}

/**
 * Displays the AI-generated YouTube content such as:
 * - Title suggestions with SEO scores
 * - Description
 * - Tags
 * - Thumbnail image
 */
function ContentDisplay({ content, loading }: Props) {
    return (
        <div className='mt-10'>
            {loading ? (
                // Skeleton UI while loading
                <div className='grid grid-cols-2 gap-5'>
                    <Skeleton className='w-full h-[200px] rounded-lg' />
                    <Skeleton className='w-full h-[200px] rounded-lg' />
                    <Skeleton className='w-full h-[200px] rounded-lg' />
                    <Skeleton className='w-full h-[200px] rounded-lg' />
                </div>
            ) : (
                content && (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                        {/* Title Suggestions */}
                        <div className='rounded-xl border p-6'>
                            <h2 className='py-2 text-lg font-bold'>YouTube Video Title Suggestions</h2>
                            {content?.content?.titles.map((item: any, index) => (
                                <h2
                                    key={index}
                                    className='font-medium p-2 my-1 bg-secondary rounded-md flex justify-between items-center'
                                >
                                    {item?.title}
                                    <span className='p-1 bg-blue-50 text-blue-500 rounded-full font-medium'>
                                        {item?.seo_score}
                                    </span>
                                </h2>
                            ))}
                        </div>

                        {/* Description */}
                        <div className='p-6 rounded-xl border'>
                            <h2 className='py-2 text-lg font-bold'>YouTube Video Description</h2>
                            <p className=''>{content?.content?.description}</p>
                        </div>

                        {/* Tags */}
                        <div className='p-6 border rounded-xl'>
                            <h2 className='py-2 text-lg font-bold'>YouTube Video Tags</h2>
                            {content?.content?.tags.map((tag, index) => (
                                <Badge variant="secondary" className='text-md m-1' key={index}>
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        {/* Thumbnail 
                        <div>
                            <h2 className='py-2 text-lg font-bold'>YouTube Thumbnail</h2>
                            {content?.thumbnailUrl && (
                                <Link href={content?.thumbnailUrl} target='_blank'>
                                    <Image
                                        src={content?.thumbnailUrl}
                                        width={300}
                                        height={300}
                                        className='w-full aspect-video rounded-xl'
                                        alt='Thumbnail'
                                    />
                                </Link>
                            )}
                        </div>
                        */}
                    </div>
                )
            )}
        </div>
    )
}

export default ContentDisplay
