import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { db } from "@/configs/db";
import { AiContentTable } from "@/configs/schema";
import moment from "moment";
import { currentUser } from "@clerk/nextjs/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { userInput } = await req.json();
        const user = await currentUser();

        if (!userInput) {
            return NextResponse.json({ error: "Input required" }, { status: 400 });
        }

        // 🔹 STEP 1: Generate AI Content
        const completion = await openai.chat.completions.create({
            model: "gpt-5-mini",
            messages: [
                {
                    role: "user",
                    content: `
Generate YouTube SEO content in STRICT JSON format.

Return ONLY JSON like this:

{
  "titles": [
    { "title": "Title 1", "seo_score": 90 },
    { "title": "Title 2", "seo_score": 85 },
    { "title": "Title 3", "seo_score": 80 }
  ],
  "description": "Write a proper YouTube description",
  "tags": ["tag1", "tag2", "tag3"]
}

Topic: ${userInput}
      `
                }
            ],
        });

        let raw = completion.choices[0].message.content || "";

        // 🔥 Remove markdown if AI returns ```json
        raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

        console.log("AI RAW:", raw); // debug

        let parsed;

        try {
            parsed = JSON.parse(raw);
        } catch (e) {
            console.log("JSON parse error:", raw);

            parsed = {
                titles: [],
                description: raw,
                tags: []
            };
        }
        // 🔹 STEP 2: Save to DB
        const saved = await db
            .insert(AiContentTable)
            .values({
                userInput: userInput,
                content: parsed,
                thumbnailUrl: null,
                createdOn: moment().format("YYYY-MM-DD"),
                userEmail: user?.primaryEmailAddress?.emailAddress,
            })
            .returning();

        // 🔹 STEP 3: Return response
        return NextResponse.json(saved[0]);
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { error: err.message || "Something went wrong" },
            { status: 500 }
        );
    }
}