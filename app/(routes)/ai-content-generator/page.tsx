"use client";

import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Loader2, Settings } from 'lucide-react';
import React, { useState } from 'react';
import ContentDisplay from './_components/ContentDisplay';

export type Content = {
    id: number;
    userInput: string;
    content: subContent;
    thumbnailUrl: string;
    createdOn: string;
};

type subContent = {
    description: string;
    image_prompts: any;
    tags: string[];
    titles: {
        seo_score: number;
        title: string;
    }[];
};

function AiContentGenerator() {
    const [userInput, setUserInput] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<Content>();

    const onGenerate = async () => {
        try {
            setLoading(true);

            const result = await axios.post('/api/ai-content-generator', {
                userInput: userInput
            });

            console.log(result.data);

            // ✅ Direct response (NO polling)
            setContent(result.data);

        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className='px-10 md:px-20 lg:px-40'>
                <div className='flex items-center justify-center mt-5 flex-col gap-2'>
                    <h2 className='font-bold text-4xl'>AI Content Generator</h2>
                    <p className='text-gray-400 text-center'>
                        Generate engaging YouTube video scripts, titles, and descriptions instantly using AI.
                    </p>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onGenerate();
                    }}
                    className='p-2 border rounded-xl flex gap-2 items-center bg-secondary mt-5'
                >
                    <input
                        type='text'
                        placeholder='Enter prompt to generate content for your next video'
                        className='w-full p-2 outline-none bg-transparent'
                        value={userInput}
                        onChange={(event) => setUserInput(event.target.value)}
                    />

                    <Button type="submit" disabled={loading || !userInput}>
                        {loading ? <Loader2 className='animate-spin' /> : <Settings />} Generate
                    </Button>
                </form>
            </div>

            <ContentDisplay content={content} loading={loading} />
        </div>
    );
}

export default AiContentGenerator;