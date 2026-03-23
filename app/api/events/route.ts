import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Event from "@/database/event.model";
import {v2 as cloudinary} from "cloudinary";

type IncomingEvent = {
  id?: string;
  agenda: unknown;
  tags: unknown;
  image?: string;
  [key: string]: unknown;
};

type ParsedEvent = Omit<IncomingEvent, "agenda" | "tags"> & {
  agenda: string[];
  tags: string[];
};

function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (typeof value === "string") {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map(String);
    }
  }

  throw new Error("Invalid array field");
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await req.formData();

    let event: IncomingEvent;
    let parsedEvent: ParsedEvent;

    try {
      event = Object.fromEntries(formData.entries()) as IncomingEvent;
      parsedEvent = {
        ...event,
        agenda: parseStringArray(event.agenda),
        tags: parseStringArray(event.tags),
      };
    } catch (e) {
      return NextResponse.json({ message: "Invalid form data format" }, { status: 400 });
    }

    const file = formData.get("image") as File;

    if(!file) return NextResponse.json({ message: "No file uploaded" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer(); // Convert File to ArrayBuffer
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

    parsedEvent.image = (uploadResult as {secure_url: string}).secure_url;

    // The schema requires `id`; generate one when the client does not provide it.
    const normalizedId = typeof parsedEvent.id === "string" ? parsedEvent.id.trim() : "";
    parsedEvent.id = normalizedId || `evt_${crypto.randomUUID()}`;

    const createdEvent = await Event.create(
      { ...parsedEvent }
    );
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

export async function GET() {
  try {
    await connectToDatabase();

    const events = await Event.find().sort({ createdAt: -1 })

    return NextResponse.json({message: "Events fetched successfully", events}, {status: 200});
  } catch (e) {
    console.error(e);
    return NextResponse.json({
      message: "Failed to fetch events",
    }, {status: 500})
  }
}



//
