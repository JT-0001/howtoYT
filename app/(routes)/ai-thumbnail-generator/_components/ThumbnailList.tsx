import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

type Thumbnail = {
    id: number;
    thumbnailUrl: string;
    refImage?: string;
    userInput: string;
};

function ThumbnailList() {
    const [thumbnailList, setThumbnailList] = useState<Thumbnail[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getThumbnailList();
    }, []);

    const getThumbnailList = async () => {
        setLoading(true);
        try {
            const result = await axios.get('/api/generate-thumbnail');
            // Clean ImageKit URLs (remove query params)
            const cleanData = result.data.map((thumb: Thumbnail) => ({
                ...thumb,
                thumbnailUrl: thumb.thumbnailUrl.split('?')[0],
            }));
            setThumbnailList(cleanData);
        } catch (err) {
            console.error("Failed to fetch thumbnails:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='mt-10'>
            <h2 className='font-bold text-xl'>Previously Generated Thumbnails</h2>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-6'>
                {!loading
                    ? thumbnailList.map((thumbnail) => (
                        <Link href={thumbnail.thumbnailUrl} target='_blank' key={thumbnail.id}>
                            <Image
                                src={thumbnail.thumbnailUrl}
                                alt={thumbnail.userInput || 'Thumbnail'}
                                width={200}
                                height={200}
                                className='w-full aspect-video rounded-xl'
                            />
                        </Link>
                    ))
                    : [1, 2, 3, 4, 5, 6].map((item) => (
                        <div className="flex flex-col space-y-3" key={item}>
                            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default ThumbnailList;
