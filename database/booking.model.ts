import mongoose, { Document, Model, Schema, Types } from "mongoose";
import Event from "./event.model";

export interface IBooking extends Document {
  eventId: Types.ObjectId;  // Reference to an Event document
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// RFC 5322-inspired email pattern; covers the vast majority of valid addresses
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BookingSchema = new Schema<IBooking>(
  {
    // Indexed for efficient lookups of all bookings belonging to an event
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => EMAIL_REGEX.test(value),
        message: (props: { value: string }) =>
          `"${props.value}" is not a valid email address`,
      },
    },
  },
  { timestamps: true }
);

// Pre-save: ensure the referenced event exists before persisting a booking
BookingSchema.pre("save", async function () {
  // Only re-check when eventId is new or has changed
  if (!this.isModified("eventId")) return;

  const exists = await Event.exists({ _id: this.eventId });
  if (!exists) {
    throw new Error(`Event with id "${this.eventId}" does not exist`);
  }

});

// Prevent model re-registration errors during Next.js hot-reloads
const Booking: Model<IBooking> =
  (mongoose.models.Booking as Model<IBooking>) ??
  mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
