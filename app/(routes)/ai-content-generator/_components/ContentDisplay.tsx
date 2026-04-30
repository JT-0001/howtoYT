import React from 'react'
import { Content } from '../page'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

type Props = {
    content: Content | undefined;
    loading: boolean;
}

function ContentDisplay({ content, loading }: Props) {
    return (
        <div className='mt-10'>
            {loading ? (
                <div className='grid grid-cols-2 gap-5'>
                    <Skeleton className='w-full h-[200px] rounded-lg' />
                    <Skeleton className='w-full h-[200px] rounded-lg' />
                    <Skeleton className='w-full h-[200px] rounded-lg' />
                    <Skeleton className='w-full h-[200px] rounded-lg' />
                </div>
            ) : (
                content && (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>

                        <div className='rounded-xl border p-6'>
                            <h2 className='py-2 text-lg font-bold'>YouTube Video Title Suggestions</h2>
                            {content?.content?.titles?.map((item: any, index) => (
                                <h2 key={index} className='font-medium p-2 my-1 bg-secondary rounded-md flex justify-between'>
                                    {item?.title}
                                    <span className='p-1 bg-blue-50 text-blue-500 rounded-full'>
                                        {item?.seo_score}
                                    </span>
                                </h2>
                            ))}
                        </div>

                        <div className='p-6 rounded-xl border'>
                            <h2 className='py-2 text-lg font-bold'>Description</h2>
                            <p>{content?.content?.description || "No description generated"}</p>
                        </div>

                        <div className='p-6 border rounded-xl'>
                            <h2 className='py-2 text-lg font-bold'>Tags</h2>
                            {content?.content?.tags?.map((tag, index) => (
                                <Badge key={index} variant={"secondary"} className='m-1'>
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                    </div>
                )
            )}
        </div>
    )
}

export default ContentDisplay;