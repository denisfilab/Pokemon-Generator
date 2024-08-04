'use client'
import Slider from "@/components/Slider/Slider";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <section className="flex h-full px-[7.7vw] pt-[6rem]">
      <div className="w-full h-full flex flex-row max-lg:flex-col-reverse max-lg:items-center max-lg:justify-end lg:items-center lg:justify-between">
        <div className="flex flex-col">
          <h1 className="text-[3.75vw] max-xl:text-[4.5vw] max-lg:text-[3.5rem] max-md:text-[3rem] leading-tight font-bold font-outfit text-gradient max-lg:mt-[1rem]">
            Generate Your Own<br className=""></br> Pokémon Card
            <br className="max-lg:hidden"></br> with AI
          </h1>
          <p className="text-[1.25vw] max-xl:text-[1.4vw]  w-[35.25vw] max-lg:w-full max-lg:text-[1.1rem] max-md:text-[1rem]  font-fontspringDemoGreycliff text-black mt-[2vw]">Hey there, Pokémon fans and creative minds<span className="font-outfit">!</span> Ready to shake up the Pokémon world? We<span className="font-outfit">&apos;</span>ve got something awesome for you, a super cool AI tool that lets you dream up your very own Pokémon cards<span className="font-outfit">!</span></p>
          <Link href="/generate" className="bg-button-gradient w-fit text-outfit text-white font-bold mt-[2vw] px-[1.5vw] py-[0.6vw] text-[1.45vw] rounded-full max-lg:text-[1rem]">Create Your Own</Link>
        </div>
        <div className="">
          <Slider />
        </div>
      </div>
    </section>
  );
}


