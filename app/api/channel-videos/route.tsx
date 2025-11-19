import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { userId, getToken, sessionClaims } = await auth();
    console.log('Session Claims:', sessionClaims);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = await getToken({ template: 'oauth_google' });
    console.log(token)
    if (!token) {
        return NextResponse.json({ error: 'Google Token Not Found' }, { status: 400 });
    }


    // Step 1: Get uploads playlist ID
    const channelRes = await fetch(
        'https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true',
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    const channelData = await channelRes.json();
    const uploadsId = channelData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsId) {
        return NextResponse.json({ error: 'No uploads playlist found' }, { status: 400 });
    }
    return NextResponse.json({ uploadsId })
}