import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Event } from "@/database";
import type { IEvent } from "@/database/event.model";

/**
 * Route context for /api/events/[slug].
 * In Next.js 15+, dynamic route params are passed as a Promise.
 */
interface RouteContext {
  params: Promise<{ slug: string }>;
}

/**
 * Valid slug: lowercase alphanumeric characters and hyphens,
 * must start with an alphanumeric character.
 * Matches the format produced by the Event model's pre-save hook.
 */
const SLUG_REGEX = /^[a-z0-9][a-z0-9-]*$/;

/**
 * GET /api/events/[slug]
 * Returns the event matching the given slug.
 *
 * Responses:
 *   200 – Event found and returned.
 *   400 – Slug is missing or contains invalid characters.
 *   404 – No event exists with the given slug.
 *   500 – Unexpected server error.
 */
export async function GET(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    // Await params — required in Next.js 15+ App Router
    const { slug } = await context.params;

    // Validate slug format before touching the database
    if (!slug || !SLUG_REGEX.test(slug)) {
      return NextResponse.json(
        { message: "Invalid or missing slug. Slugs must be lowercase alphanumeric words separated by hyphens." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Use lean() for a plain JS object — faster and sufficient for read-only responses
    const event = await Event.findOne({ slug }).lean<IEvent>();

    if (!event) {
      return NextResponse.json(
        { message: `No event found with slug "${slug}".` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Event fetched successfully.", event },
      { status: 200 }
    );
  } catch (error) {
    // Log full error server-side; never expose internals to the client
    console.error("[GET /api/events/[slug]]", error);

    return NextResponse.json(
      { message: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
