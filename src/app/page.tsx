'use client'
import Slider from "@/components/Slider/Slider";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <section className="flex h-full flex-col items-center px-[7.7vw]">
      <div className="w-full h-full flex flex-row items-center">
        <div className="flex flex-col">
          <h1 className="text-7xl font-bold font-outfit text-gradient">
            Generate Your Own<br></br> Pokémon Card
            <br></br>with AI
          </h1>
          <p className="text-2xl font-fontspringDemoGreycliff text-black w-[50%] mt-[2vw]">Hey there, Pokémon fans and creative minds<span className="font-outfit">!</span> Ready to shake up the Pokémon world? We<span className="font-outfit">'</span>ve got something awesome for you, a super cool AI tool that lets you dream up your very own Pokémon cards<span className="font-outfit">!</span></p>
          <Link href="/generate" className="bg-button-gradient w-fit text-outfit text-white font-bold mt-[2vw] px-[1.5vw] py-[1vw] text-4xl rounded-full">Create Your Own</Link>"
        </div>
        <div className="">
          <Slider />
        </div>
      </div>
    </section>
  );
}

/* Font */

