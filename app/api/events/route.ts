import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Event from "@/database/event.model";
import {v2 as cloudinary} from "cloudinary";

/**
 * Handle POST requests to create a new event with an uploaded image.
 *
 * Parses multipart form data (expects `agenda` and `tags` as JSON strings and an `image` file),
 * uploads the image to Cloudinary, creates an Event document in the database, and returns a JSON response.
 *
 * @param req - The incoming request with multipart/form-data containing event fields and an `image` file
 * @returns On success: a JSON payload with `message: "Event created successfully"` and the created `event` (status 201).
 *          On client errors: a JSON payload with `message: "Invalid form data format"` (status 400) or `message: "No file uploaded"` (status 400).
 *          On server errors: a JSON payload with `message: "Event creation failed. Please try again later."` and an `error` field (status 500).
 */
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await req.formData();

    let event;

    try {
      event = Object.fromEntries(formData.entries());
      event.agenda = JSON.parse(event.agenda as string);
      event.tags = JSON.parse(event.tags as string);
    } catch (e) {
      return NextResponse.json({ message: "Invalid form data format" }, { status: 400 });
    }

    const file = formData.get("image") as File;

    if(!file) return NextResponse.json({ message: "No file uploaded" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        resource_type: "image",
        folder: "DevEvent"
      }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }).end(buffer);
    });

    event.image = (uploadResult as {secure_url: string}).secure_url;

    const createdEvent = await Event.create(event);
    return NextResponse.json(
      { message: "Event created successfully", event: createdEvent },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Event creation failed. Please try again later.",
        error: e,
      },
      { status: 500 }
    );
  }
}

/**
 * Retrieve all events from the database sorted by creation time descending.
 *
 * @returns A JSON response containing `message` and `events` on success (status 200), or `message` and `error` on failure (status 500).
 */
export async function GET() {
  try {
    await connectToDatabase();
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json({message: "Events fetched successfully", events: events}, {status: 200});
  } catch (e) {
    return NextResponse.json({
      message: "Failed to fetch events",
      error: e,
    }, {status: 500})
  }
}

