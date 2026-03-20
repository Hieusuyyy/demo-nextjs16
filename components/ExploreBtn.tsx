'use client'
import React from 'react'
import Image from "next/image";
import posthog from "posthog-js";

const ExploreBtn = () => {
  const handleClick = () => {
    console.log("click this");
    posthog.capture("explore_events_clicked");
  };

  return (
    <a 
      href={"#events"} 
      id={"explore-btn"} 
      className={"mt-7 mx-auto"} 
      onClick={handleClick}
    >
      Explore Events
      <Image src={"/icons/arrow-down.svg"} alt={"arrow-down"} width={24} height={24} className={"ml-2"}/>
    </a>  )
}

export default ExploreBtn
