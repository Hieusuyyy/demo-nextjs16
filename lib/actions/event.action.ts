'use server';
import Event from "@/database/event.model";

import {connectToDatabase} from "@/lib/mongodb";

export interface SimilarEvent {
  id: string;
  title: string;
  image: string;
  location: string;
  date: string;
  time: string;
  slug: string;
}

export const getSimilarEventsBySlugs = async (slug: string) => {
  try {
    await connectToDatabase();

    const event = await Event.findOne({slug});

    if (!event) return [];

    const similarEvents = await Event.find({_id: {$ne: event._id}, tags: { $in: event.tags }})
      .limit(4)
      .lean<SimilarEvent[]>();
    // $ne: not equal - loại trừ event hiện tại đang xem
    // $in: event.tags: lấy các event có ít nhất 1 tag trùng với event hiện tại
    // _id: id unique được tạo bởi mongodb, tránh xung đột với id do user tạo

    return similarEvents.map((similarEvent) => ({
      id: String(similarEvent.id),
      title: similarEvent.title,
      image: similarEvent.image,
      location: similarEvent.location,
      date: similarEvent.date,
      time: similarEvent.time,
      slug: similarEvent.slug,
    }));

  } catch (e) {
    return [];
  }
}

