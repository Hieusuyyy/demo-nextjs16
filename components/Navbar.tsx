import React from 'react'
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <header>
      <nav className={""}>
        <Link href={"/"} className={"logo"} >
          <Image src={"/icons/logo.png"} alt={"logo"} width={32} height={32} className={"mr-2"}/>
          <span>Dev Event</span>
        </Link>
        <ul>
          <Link href={"/"}>Home</Link>
          <Link href={"/"}>Events</Link>
          <Link href={"/"}>Create Events</Link>
        </ul>
      </nav>
    </header>
  )
}
export default Navbar
