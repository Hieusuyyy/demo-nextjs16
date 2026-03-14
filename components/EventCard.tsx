'use client'
import React from 'react'
import Link from "next/link";
import Image from "next/image";
import posthog from "posthog-js";

interface Props {
  title: string;
  image: string;
  location: string;
  date: string;
  time: string;
  slug: string;
}

const EventCard = ({ title, image, slug, time, location, date} : Props) => {
  const handleClick = () => {
    posthog.capture("event_card_clicked", {
      event_title: title,
      event_slug: slug,
      event_location: location,
      event_date: date,
    });
  };

  return (
    <Link href={`/events/${slug}`} id={"event-card"} onClick={handleClick}>
      <Image src={image} alt={""} width={450} height={250} className={"poster"}/>
      <div className={"flex flex-row gap-2 mt-2"}>
        <Image src={"/icons/pin.svg"} alt={"location"} width={16} height={16}/>
        <p className={"text-sm"}>{location}</p>
      </div>
      <h5 className={"font-bold"}>{title}</h5>
      <div className={"datetime"}>
        <Image src={"/icons/calendar.svg"} alt={"date"} width={16} height={16}/>
        <p className={"text-sm"}>{date}</p>
        <p className={"text-sm"}>{time}</p>
      </div>
    </Link>
  )
}
export default EventCard
