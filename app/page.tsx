import React from 'react'
import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import {events} from "@/lib/constants";
import {IEvent} from "@/database/event.model";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = async () => {
  const res = await fetch(`${BASE_URL}/api/events`);
  const {events} = await res.json();
  return (
      <section>
        <h1 className={"text-center"}>Hello World <br/> Event you can't miss</h1>
        <p className={"text-center mt-3 text-lg"}>Tất cả mọi thứ đều có ở trong này</p>

        <ExploreBtn/>

        <div className={"mt-20 space-y-7"}>
          <h3>Featured Events</h3>

          <ul className={"events list-none"}>
            {events && events.length > 0 && events.map((event : IEvent) => (
              <li key={event.title}>
                <EventCard {...event} />
              </li>
            ))}
          </ul>
        </div>
      </section>
  )
}
export default Page
