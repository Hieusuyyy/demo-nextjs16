import mongoose, { Document, Model, Schema } from "mongoose";

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;   // Normalized to YYYY-MM-DD
  time: string;   // Normalized to HH:MM (24-hour)
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title:       { type: String, required: true, trim: true },
    // Slug is auto-generated from title; unique index enforces no duplicates
    slug:        { type: String, unique: true },
    description: { type: String, required: true, trim: true },
    overview:    { type: String, required: true, trim: true },
    image:       { type: String, required: true, trim: true },
    venue:       { type: String, required: true, trim: true },
    location:    { type: String, required: true, trim: true },
    date:        { type: String, required: true },
    time:        { type: String, required: true },
    mode:        { type: String, required: true, trim: true },
    audience:    { type: String, required: true, trim: true },
    agenda:      { type: [String], required: true },
    organizer:   { type: String, required: true, trim: true },
    tags:        { type: [String], required: true },
  },
  { timestamps: true }
);

EventSchema.pre("save", function () {
  // Regenerate slug only when the title has changed (or on first save)
  if (this.isModified("title")) {
    const baseSlug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")   // Strip non-alphanumeric characters
      .replace(/[\s_]+/g, "-")    // Replace whitespace / underscores with hyphens
      .replace(/^-+|-+$/g, "");   // Remove leading and trailing hyphens
    // Add short unique suffix to prevent collisions
    this.slug = `${baseSlug}-${Date.now().toString(36).slice(-4)}`;
  }
  // Normalize date to ISO 8601 date string (YYYY-MM-DD)
  if (this.isModified("date")) {
    const parsed = new Date(this.date);
    if (isNaN(parsed.getTime())) {
      throw new Error(`Invalid date value: "${this.date}"`);
    }
    this.date = parsed.toISOString().split("T")[0];
  }

  // Normalize time to HH:MM (24-hour); accepts "14:30", "2:30 PM", "02:30:00"
  if (this.isModified("time")) {
    const match = this.time
      .trim()
      .match(/^(\d{1,2}):(\d{2})(?::\d{2})?(?:\s*(AM|PM))?$/i);

    if (!match) {
      throw new Error(`Invalid time value: "${this.time}"`);
    }

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const meridiem = match[3]?.toUpperCase();

    // Convert 12-hour clock to 24-hour clock
    if (meridiem === "AM" && hours === 12) hours = 0;
    if (meridiem === "PM" && hours !== 12) hours += 12;

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      throw new Error(`Invalid time value: "${this.time}"`);
    }

    this.time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }

});

// Prevent model re-registration errors during Next.js hot-reloads
const Event: Model<IEvent> =
  (mongoose.models.Event as Model<IEvent>) ??
  mongoose.model<IEvent>("Event", EventSchema);

export default Event;
