import React from 'react'
import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import {cacheLife} from "next/cache";

type EventListItem = {
  id: string;
  title: string;
  image: string;
  location: string;
  date: string;
  time: string;
  slug: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = async () => {
  'use cache';
  cacheLife('hours')
  let events: EventListItem[] = [];
  
  try {
    if (!BASE_URL) {
      console.error("NEXT_PUBLIC_BASE_URL is not defined");
    } else {
      const res = await fetch(`${BASE_URL}/api/events`);
      if (res.ok) {
        const data = await res.json();
        events = data.events ?? [];
      }
    }
  } catch (error) {
    console.error("Failed to fetch events:", error);
  }

  return (
      <section>
        <h1 className={"text-center"}>Hello World <br/> Event you can't miss</h1>
        <p className={"text-center mt-3 text-lg"}>Tất cả mọi thứ đều có ở trong này</p>

        <ExploreBtn/>

        <div className={"mt-20 space-y-7"}>
          <h3>Featured Events</h3>

          <ul className={"events list-none"}>
            {events && events.length > 0 && events.map((event: EventListItem) => (
              <li key={event.id}>
                <EventCard
                  title={event.title}
                  image={event.image}
                  location={event.location}
                  date={event.date}
                  time={event.time}
                  slug={event.slug}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>
  )
}
export default Page
