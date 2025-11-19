import { db } from "@/configs/db";
import { inngest } from "./client";
import ImageKit from "imagekit"
import OpenAI from 'openai';
import Replicate from 'replicate'
import { AiContentTable, AiThumbnailTable, TrendingKeywordsTable } from "@/configs/schema";
import moment from 'moment'
import axios from "axios";
export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        await step.sleep("wait-a-moment", "1s");
        return { message: `Hello ${event.data.email}!` };
    },
);

//@ts-ignore
const imageKit = new ImageKit({
    //@ts-ignore
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    //@ts-ignore
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    //@ts-ignore
    urlEndpoint: process.env.IMAGEKIT_URLENDPOINT
})


export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


const AIContentGeneratorSystemPrompt = `You are an expert YouTube SEO strategist and AI creative assistant. Based on the user input below, generate a JSON response only (no explanation, no markdown, no commentary), containing:

Three YouTube video titles optimized for SEO.

SEO Score for each title (1 to 100).

A compelling YouTube video description based on the topic.

10 relevant YouTube video tags.

Two YouTube thumbnail image prompts, each including:

Professional illustration style based on the video title

A short 3–5 word heading that will appear on the thumbnail image

Visually compelling layout concept to grab attention

User Input: {{user_input}}

Return format (JSON only):

json
Copy
Edit
{
  "titles": [
    {
      "title": "Title 1",
      "seo_score": 87
    },
    {
      "title": "Title 2",
      "seo_score": 82
    },
    {
      "title": "Title 3",
      "seo_score": 78
    }
  ],
  "description": "Write a professional and engaging YouTube video description here based on the input.",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10"],
  "image_prompts": [
    {
      "heading": "Heading Text 1",
      "prompt": "Professional illustration for thumbnail image based on Title 1. Include elements such as..."
    },
    {
      "heading": "Heading Text 2",
      "prompt": "Professional illustration for thumbnail image based on Title 2. Include elements such as..."
    }
  ]
}
Make sure the thumbnail image prompt reflects the respective title context, includes visual style (3D/flat/vector), character/action/objects (if needed), background design, and text position ideas.`

export const GenerateAIContent = inngest.createFunction(
    { id: 'ai/generateContent' },
    { event: 'ai/generateContent' },
    async ({ event, step }) => {
        const { userInput, userEmail } = await event.data;

        //TO Generate Title,Description,Tags and Thumbnail Prompt
        const generateAiContent = await step.run('GenerateAiContent', async () => {
            const completion = await openai.chat.completions.create({
                model: 'gpt-5-mini',
                messages: [
                    {
                        role: 'user',
                        content: AIContentGeneratorSystemPrompt.replace('{{user_input}}', userInput),
                    },
                ],
            });

            const RawJson = completion.choices[0].message.content;
            const formattedJsonString = RawJson?.replace('```json', '').trim().replace('```', '').trim();
            const formattedJson = formattedJsonString && JSON.parse(formattedJsonString);
            return formattedJson;
        })
        // To Generate Thumbnail Prompt
        // Generate AI Image
        /*
        const generateThumbnailImage = await step.run('Generate Image', async () => {
            const input = {
                prompt: generateAiContent?.image_prompts[0].prompt,
                aspect_ratio: "16:9",
                output_format: "png",
                safety_filter_level: "block_only_high"
            };
            const output = await replicate.run("google/imagen-4-fast", { input });

            // To access the file URL:
            //@ts-ignore
            return output.url();
        })
        //Save Image to Cloud

        const uploadThumnail = await step.run('Upload Thumbnail', async () => {
            const imageRef = await imageKit.upload({
                file: generateThumbnailImage,
                fileName: Date.now() + '.png',
                isPublished: true,
                useUniqueFileName: false
            })

            return imageRef.url
        })
*/
        // Save Everything to Database
        const SaveContentDB = await step.run('SaveToDb', async () => {
            const result = await db.insert(AiContentTable).values({
                content: generateAiContent,
                createdOn: moment().format('yyyy-mm-DD'),
                thumbnailUrl:null,
                userEmail: userEmail,
                userInput: userInput
                //@ts-ignore
            }).returning(AiContentTable);

            return result
        })

        return SaveContentDB
    }
)

export const GetTrendingKeywords = inngest.createFunction(
  { id: 'ai/trending-keywords' },
  { event: 'ai/trending-keywords' },
  async ({ event, step }: { event: any; step: any }) => {
    const { userInput, userEmail } = event.data;
  
    // Get youtube trending keywords from openai
    const YoutubeResult=await step.run("Youtube Result", async () => {
      const result = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(userInput)}&type=video&key=${process.env.YOUTUBE_API_KEY}`);
      const searchData = result.data;

      let titles:any=[];
      searchData.items.forEach((item:any) => {
        titles.push(item?.snippet?.title);
      })
      return titles;
    })

    //ai modelto generate keywords from titles
    const keywordslist=await step.run("Generate Keywords", async () => {
      const SystemPromptForKeyords=`Given the user input {{userInput}} and a list of YouTube video titles, extract high-ranking SEO-relevant keywords. For each keyword:

* Assign an SEO score (1–100) based on search potential and relevance.
* Include a few related queries or search phrases (based on user intent or variations from the video titles).

Return the result in this JSON format:
{
  "main_keyword": "NextJs AI Projects",
  "keywords": [
    {
      "keyword": "Your Extracted Keyword",
      "score": NumericScore,
      "related_queries": [
        "related query 1",
        "related query 2"
      ]
    }
    // ...
  ]
}

Use the titles below to extract SEO keywords and generate related search phrases:
{{titles}}

Only include keywords relevant to Next.js AI projects. Keep keywords concise, focused, and action-oriented.`
      const completion = await openai.chat.completions.create({
        model: "google/gemini-2.0-flash-exp:free",
        messages: [
          {
            "role": "user",
            "content":SystemPromptForKeyords.replace("{{userInput}}",userInput).replace("{{titles}}",JSON.stringify(YoutubeResult)) 
          }
        ],

      });
      const RawJson=completion.choices[0].message.content;
      const formattedJsonString=RawJson?.replace('```json','').trim().replace('```','').trim() ;
      const formattedJson =formattedJsonString && JSON.parse(formattedJsonString);
      return formattedJson;

    })
    console.log("Triggered GetTrendingKeywords with event:", event.name);
    console.log("Event data:", event.data);
    console.log("YoutubeResult:", YoutubeResult);
    console.log("Generated Keywords:", keywordslist);
    // Save to db
    const SaveToDB = await step.run("SaveToDb", async () => {
      const result=await db.insert(TrendingKeywordsTable).values({
        userInput: userInput,
        keywordsData: keywordslist,
        userEmail: userEmail,
        createdOn: new Date().toISOString(),
        //@ts-ignore
      }).returning(TrendingKeywordsTable);
      return result;
    })
   return SaveToDB;
  }
)
/*export const replicate = new Replicate({
    auth: process.env.RPELICATE_API_KEY
});*/

/*export const GenerateAiThumbnail = inngest.createFunction(
    { id: 'ai/generate-thumbnail' },
    { event: 'ai/generate-thumbnail' },
    async ({ event, step }) => {
        const { userEmail, refImage, faceImage, userInput } = await event.data;
        //Upload image to Cloud /ImageKit
        // await step.sleep("wait-a-moment", "3s");
        // return 'Success'
        const uploadImageUrls = await step.run(
            "UploadImage",
            async () => {

                if (refImage != null) {
                    const refImageUrl = await imageKit.upload({
                        file: refImage?.buffer ?? '',
                        fileName: refImage.name,
                        isPublished: true,
                        useUniqueFileName: false
                    })

                    // const faceImageUrl = await imageKit.upload({
                    //     file: faceImage?.buffer ?? '',
                    //     fileName: faceImage.name,
                    //     isPublished: true,
                    //     useUniqueFileName: false
                    // })

                    return refImageUrl.url
                }
                else {
                    return null;
                }

            }
        )

        // Generate AI prompt from AI Model
        const generateThumbnailPrompt = await step.run('generateThumnailPrompt', async () => {
            const completion = await openai.chat.completions.create({
                model: 'google/gemini-2.0-flash-exp:free',
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                "type": "text",
                                "text": uploadImageUrls ? `Refering to this thumbnail url write a text pronpt in details with colors pallter and each small details to generate youtube thumbnail
                            similar to the attached referance image with following user input:`+ userInput + 'Only give me text prompt, No other comment text' :
                                    `Depends on user input write a text prompt to generate high quality professional Youtube thumnail prompt, Make sure to keep title font bold and heighlighed, 
                            Add relavant icons , illustation or images as per title. UserInput`+ userInput + 'Only give me text prompt, No other comment text'
                            },
                            //@ts-ignore
                            ...(uploadImageUrls
                                ? [
                                    {
                                        type: "image_url",
                                        image_url: {
                                            url: uploadImageUrls,
                                        },
                                    },
                                ]
                                : [])
                        ],
                    },
                ],
            });

            console.log(completion.choices[0].message.content)

            return completion.choices[0].message.content;
        })

        // Generate AI Image
        const generateThumbnailImage = await step.run('Generate Image', async () => {
            const input = {
                prompt: generateThumbnailPrompt,
                aspect_ratio: "16:9",
                output_format: "png",
                safety_filter_level: "block_only_high"
            };
            const output = await replicate.run("google/imagen-4-fast", { input });

            // To access the file URL:
            //@ts-ignore
            return output.url();
        })
        //Save Image to Cloud

        const uploadThumnail = await step.run('Upload Thumbnail', async () => {
            const imageRef = await imageKit.upload({
                file: generateThumbnailImage,
                fileName: Date.now() + '.png',
                isPublished: true,
                useUniqueFileName: false
            })

            return imageRef.url
        })

        const SaveToDB = await step.run('SaveToDb', async () => {
            const result = await db.insert(AiThumbnailTable).values({
                userInput: userInput,
                thumbnailUrl: uploadThumnail,
                createdOn: moment().format('yyyy-mm-DD'),
                refImage: uploadImageUrls,
                userEmail: userEmail
                //@ts-ignore
            }).returning(AiThumbnailTable)

            return result
        })

        // Save record to database

        return uploadThumnail;
    }
)*/