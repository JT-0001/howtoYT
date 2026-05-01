export const maxDuration = 60;
export const dynamic = "force-dynamic";

import { db } from "@/configs/db";
import { AiThumbnailTable } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { desc, eq } from "drizzle-orm";
import imagekit from "@/lib/imagekit";

// Create OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const userInput = formData.get("userInput") as string;
    const user = await currentUser();

    if (!userInput) {
      return NextResponse.json(
        { error: "Please enter title or description!" },
        { status: 400 }
      );
    }

    // Generate Image
    const result = await client.images.generate({
      model: "dall-e-3",
      prompt: `Create a visually striking background image suitable for a YouTube thumbnail, based on the topic: "${userInput}". 
Use only visuals (symbols, objects, characters, scenes) to express the topic — absolutely NO text-based storytelling. 
Style: bold cinematic lighting, dramatic shadows, high contrast, 3D premium look, dynamic and center-focused composition. 
Make the image exciting, clickable, professional, and appealing to all audiences. 
STRICT RULES: No text, no letters, no numbers, no signs, no headlines, no logos, no watermarks, no UI elements. 
Only clean pure visuals. The subject must be the clear focus.
`
      ,
      size: "1024x1024",
    });

    const imageUrl = result.data?.[0]?.url;
    if (!imageUrl) throw new Error("Image generation failed");

    const imgRes = await fetch(imageUrl);
    const arrayBuffer = await imgRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Step 3: Upload to ImageKit
    const uploadResult = await imagekit.upload({
      file: buffer,
      fileName: `thumbnail-${Date.now()}.png`,
      folder: "/thumbnails",
    });

    const permanentImageUrl = uploadResult.url;
    // Save into DB
    await db.insert(AiThumbnailTable).values({
      userInput,
      thumbnailUrl: permanentImageUrl,
      userEmail: user?.primaryEmailAddress?.emailAddress ?? "unknown",
      createdOn: new Date().toISOString(),
    });

    return NextResponse.json({ image: permanentImageUrl });

  } catch (err) {
    console.error("Thumbnail error:", err);
    return NextResponse.json(
      { error: "Failed to generate thumbnail" },
      { status: 500 }
    );
  }
}

// Get user thumbnails
export async function GET() {
  try {
    const user = await currentUser();
    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json([], { status: 200 });
    }

    const thumbnails = await db
      .select()
      .from(AiThumbnailTable)
      .where(eq(AiThumbnailTable.userEmail, user.primaryEmailAddress.emailAddress))
      .orderBy(desc(AiThumbnailTable.id));

    return NextResponse.json(thumbnails);
  } catch (err) {
    console.error("GET thumbnails error:", err);
    return NextResponse.json({ error: "Failed to fetch thumbnails" }, { status: 500 });
  }
}

