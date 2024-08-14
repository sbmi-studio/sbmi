"use client";

import StickyNavbar from "./_components/navbar-sticky";
import MobileNavbar from "./_components/navbar-mobile";
import Logo from "@/components/Logo";
import { networksList, servicesList } from "@/components/custom-lists";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [isHover, setHover] = useState("");

  return (
    <>
      <StickyNavbar />
      <MobileNavbar />
      <main className="flex min-h-screen flex-col items-center justify-between md:p-24 p-10">
        <section
          id="About"
          className={`flex flex-col text-center lg:mb-0 lg:w-full lg:max-w-5xl items-center bg-transparent md:py-20 pb-28`}>
          <Logo classes={"h-80"} />
          <h1 className="text-5xl font-bold">Sumido Blockchain Mining Inc.</h1>
          <p className="pt-7 text-center">
            A dynamic and innovative technology company specializing in
            blockchain protocol validator management and node operations. We
            pride ourselves on running reliable blockchain infrastructure and
            supporting new blockchain protocols fostering growth.
          </p>
        </section>
        <section
          id="Services"
          className={`flex flex-col text-center lg:mb-0 lg:w-full lg:max-w-5xl md:py-20 pb-28 items-center gap-7`}>
          <h1 className="text-5xl font-bold">What We Do</h1>
          <div className={`grid md:grid-cols-2 gap-5`}>
            {servicesList.map((item) => (
              <div
                className="py-10 px-10 lg:px-20 gap-5 flex-col text-center flex w-full"
                key={item.title}>
                <h1 className={`text-xl font-semibold`}>
                  <img
                    src={`/images/${item.image}`}
                    className={`h-20 w-full`}
                  />
                  {item.title}
                </h1>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </section>
        <section
          id="Networks"
          className={`text-center mb-0 w-full max-w-5xl md:py-20 pb-28`}>
          <h1 className="text-5xl font-bold pb-10">Our Supported Networks</h1>
          <div className={`grid md:grid-cols-3 gap-5`}>
            {networksList.map((item) => (
              <Link href={item.href} target="_blank" key={item.abr}>
                <div
                  className={`relative w-full overflow-hidden rounded-xl p-[1.5px] ${
                    isHover !== item.abr ? "border-gold" : "border-transparent"
                  } border-[1.5px]`}
                  onMouseEnter={() => setHover(item.abr)}
                  onMouseLeave={() => setHover("")}>
                  <div
                    className={`animate-rotate absolute inset-0 h-full w-full rounded-full ${
                      isHover === item.abr &&
                      "bg-[conic-gradient(#c7ab65_20deg,transparent_120deg)"
                    }]`}></div>
                  <div className="py-10 px-10 lg:px-20 gap-2 relative text-center w-full rounded-[0.60rem] bg-primary flex flex-col items-center">
                    <img src={`/images/${item.image}`} className={`h-10`} />
                    <h1 className="font-bold">{item.name}</h1>
                    <p className="text-xs">({item.abr})</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section
          className={`flex flex-col text-center lg:mb-0 lg:w-full lg:max-w-5xl md:py-20 pb-28 items-center gap-7 bg-pink-500`}>
          TEST
        </section>
      </main>
    </>
  );
}
