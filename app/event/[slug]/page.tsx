import React from 'react'
import {notFound} from "next/navigation";
import Image from "next/image";
import {BookEvent} from "@/components/BookEvent";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({icon, alt, label} : {icon: string, alt: string, label: string}) => (
  <div className={"flex-row-gap-2 items-center"}>
    <Image src={icon} alt={alt} width={24} height={24} className={"mr-2"}/>
    <span>{label}</span>
  </div>
)

const EventAgenda = ({agendaItems} : {agendaItems: string[]}) => (
  <>
    <div className={"agenda"}>
      <h2>Agenda</h2>
      <ul>
        {agendaItems.map((item, index) => (
          <li key={`${item} - ${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  </>
)

const EventTags = ({tags} : ({tags: string[]})) => (
  <div className={"flex flex-row gap-1.5 flex-wrap"}>
    {tags.map((tag, index) => (
      <span key={`${tag} - ${index}`} className={"pill"}>{tag}</span>
      ))}
  </div>
)

const bookings = 10;

const EventDetail = async ({params} : {params: Promise<{slug: string}>}) => {
  const {slug} = await params;
  const req = await fetch(`${BASE_URL}/api/events/${slug}`);
  
  if (!req.ok) {
    if (req.status === 404) return notFound();
    throw new Error(`Failed to fetch event: ${req.status}`);
  }
  
  const {event} = await req.json();

  if(!event) return notFound();  return (
    <section id={"event"}>
      <div className={"header"}>
        <h1>{event.title}</h1>
        <p>{event.description}</p>
      </div>
      {/*Left side content*/}
      <div className={"details"}>
        <div className={"content"}>
          <Image src={event.image} alt={"Banner"} width={1200} height={400} className={"banner"}/>
          <section className={"flex-col-gap-2"}>
            <h2>Overview</h2>
            <p>{event.overview}</p>
          </section>
          <section className={"flex-col-gap-2"}>
            <h2>Event Details</h2>
            <EventDetailItem icon={"/icons/calendar.svg"} alt={"date"} label={event.date} />
            <EventDetailItem icon={"/icons/clock.svg"} alt={"time"} label={event.time} />
            <EventDetailItem icon={"/icons/pin.svg"} alt={"location"} label={event.location} />
            <EventDetailItem icon={"/icons/mode.svg"} alt={"mode"} label={event.mode} />
            <EventDetailItem icon={"/icons/audience.svg"} alt={"audience"} label={event.audience} />          </section>
          
          <EventAgenda agendaItems={event.agenda} />

          <section className={"flex-col-gap-2"}>
            <h2>About Organizer</h2>
            <p>{event.organizer}</p>
          </section>
          
          <EventTags tags={event.tags} />
        </div>
        {/*  Right side content*/}
        <aside className={"booking"} >
          <div className={"signup-card"}>
            <h2>Signup for this event</h2>
            {bookings > 0 ? (
              <p className={"text-sm"}>
                Join {bookings} other developers who are attending this event.
              </p>
            ) : (
              <p className={"text-sm"}>
                Be the first to know when {bookings} other developers are joining this event.
              </p>
            )}
            <BookEvent />
          </div>
        </aside>
      </div>

    </section>
  )
}
export default EventDetail
