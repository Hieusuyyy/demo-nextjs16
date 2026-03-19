import React from 'react'
import {notFound} from "next/navigation";
import Image from "next/image";
import {eventNextPlugins} from "next/dist/telemetry/events";

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
        {agendaItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  </>
)

const EventTags = ({tags} : ({tags: string[]})) => (
  <div className={"flex flex-row gap-1.5 flex-wrap"}>
    {tags.map((tag) => (
      <div className={"pill"} key={tag}>{tag}</div> 
      ))}
  </div>
)

const EventDetail = async ({params} : {params: Promise<{slug: string}>}) => {
  const {slug} = await params;
  const req = await fetch(`${BASE_URL}/api/events/${slug}`);
  const {event} = await req.json();

  if(!event) return notFound();
  return (
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
            <EventDetailItem icon={"/icons/calendar.svg"} alt={"calendar"} label={event.date} />
            <EventDetailItem icon={"/icons/clock.svg"} alt={"calendar"} label={event.time} />
            <EventDetailItem icon={"/icons/pin.svg"} alt={"calendar"} label={event.location} />
            <EventDetailItem icon={"/icons/mode.svg"} alt={"calendar"} label={event.mode} />
            <EventDetailItem icon={"/icons/audience.svg"} alt={"calendar"} label={event.audience} />
          </section>
          
          <EventAgenda agendaItems={event.agenda} />

          <section className={"flex-col-gap-2"}>
            <h2>About Organizer</h2>
            <p>{event.organizer}</p>
          </section>
          
          <EventTags tags={event.tags} />
        </div>
        {/*  Right side content*/}
        <aside className={"booking"} >
          <p className={"text-lg font-semibold"}>Book Event</p>
        </aside>
      </div>

    </section>
  )
}
export default EventDetail
