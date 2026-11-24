import { NextRequest, NextResponse } from "next/server";

interface ServerAnalyticsRecord {
  id: string;
  event: string;
  properties: Record<string, unknown>;
  timestamp: string;
  url?: string;
  ip?: string;
  userAgent?: string;
}

// In-memory ring buffer for recent server-side analytics events (stores last 100)
const serverAnalyticsEvents: ServerAnalyticsRecord[] = [];
const MAX_SERVER_EVENTS = 100;

export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown> = {};
    const text = await req.text();
    if (text) {
      body = JSON.parse(text);
    }

    const { event, properties, timestamp, id, url } = body as {
      event?: string;
      properties?: Record<string, unknown>;
      timestamp?: string;
      id?: string;
      url?: string;
    };

    if (!event) {
      return NextResponse.json(
        { error: "Event name is required" },
        { status: 400 }
      );
    }

    const record: ServerAnalyticsRecord = {
      id: id || `srv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      event,
      properties: properties || {},
      timestamp: timestamp || new Date().toISOString(),
      url,
      userAgent: req.headers.get("user-agent") || undefined,
    };

    // Keep server event ring buffer bounded
    serverAnalyticsEvents.unshift(record);
    if (serverAnalyticsEvents.length > MAX_SERVER_EVENTS) {
      serverAnalyticsEvents.pop();
    }

    console.log(
      `[Pax Analytics] Event: ${record.event} | Time: ${record.timestamp} | Data:`,
      JSON.stringify(record.properties)
    );

    return NextResponse.json({
      success: true,
      eventId: record.id,
      trackedAt: record.timestamp,
    });
  } catch (error) {
    console.error("[Pax Analytics] Error ingesting event:", error);
    return NextResponse.json(
      { error: "Failed to process analytics event" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    totalIngested: serverAnalyticsEvents.length,
    recentEvents: serverAnalyticsEvents.slice(0, 30),
  });
}
