'use client'
// import useBreakpoint from '@/components/hooks/useBreakpoint'
import Image from "next/image"
import Link from "next/link"
const NavDesktop = () => {

    return (
        <nav
            className={`sm:flex hidden z-[10000] w-screen fixed bg-navbar top-0 h-24 p-4 justify-between items-center transition-transform duration-700 px-[7.7vw]
                }`}
        >
            <div className="flex justify-between items-center w-full">
                <div className="relative">
                    <Link href='/'>
                        <Image
                            src='/images/Pokemon.svg'
                            alt='logo'
                            width={0}
                            height={0}
                            layout='responsive'
                        /></Link>

                </div>
                <Link href='/gallery' className='font-outfit font-bold text-white text-[1.5rem] mr-[20%] text-outline drop-shadow-[16px_16px_4px_rgba(0.2,0.2,0.2,0.2)]'>Gallery</Link>
            </div>


        </nav>
    )
}

export default NavDesktop
/* Rectangle 14399 */


