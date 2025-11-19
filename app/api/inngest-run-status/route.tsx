import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get('eventId');
    const response = await fetch(process.env.INNGEST_SERVER_URL + `/v1/events/${eventId}/runs`, {
        headers: {
            Authorization: `Bearer ${process.env.INNGEST_SIGINING_KEY}`,
        },
    });
    const json = await response.json();
    return NextResponse.json(json.data);
}