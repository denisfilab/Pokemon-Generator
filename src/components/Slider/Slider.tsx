import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface SlideData {
    imageUrl: string;
    alt: string;
}
// images/1_warstone.png'
// images/1_voltimur.png'
// images/1_psikala.png
// images/01_nijiar.png
const slides: SlideData[] = [
    { imageUrl: "/images/1_warstone.png", alt: "Image 1" },
    { imageUrl: "/images/1_voltimur.png", alt: "Image 2" },
    { imageUrl: "/images/1_psikala.png", alt: "Image 3" },
    { imageUrl: "/images/01_nijiar.jpg", alt: "Image 4" },
];

const Slider: React.FC = () => {
    const [active, setActive] = useState(0);

    useEffect(() => {
        loadShow();
    }, [active]);

    const loadShow = () => {
        const items = document.querySelectorAll('.slider .item') as NodeListOf<HTMLElement>;
        items.forEach((item, index) => {
            const diff = (index - active + slides.length) % slides.length;
            if (diff === 0) {
                item.style.transform = 'none';
                item.style.zIndex = '1';
                item.style.filter = 'none';
                item.style.opacity = '1';
            } else if (diff === 1 || diff === slides.length - 1) {
                const direction = diff === 1 ? 1 : -1;
                item.style.transform = `translateX(${120 * direction}px) scale(0.8) perspective(16px) rotateY(${-1 * direction}deg)`;
                item.style.zIndex = '0';
                item.style.filter = 'blur(5px)';
                item.style.opacity = '0.6';
            } else {
                item.style.transform = 'translateX(0) scale(0.6)';
                item.style.zIndex = '-1';
                item.style.filter = 'blur(10px)';
                item.style.opacity = '0';
            }
        });
    };

    const handleNext = () => {
        setActive((prev) => (prev + 1) % slides.length);
    };

    const handlePrev = () => {
        setActive((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="relative w-[600px] h-[600px] flex justify-center items-center">
            <div className="slider relative w-full h-full overflow-hidden">
                {slides.map((slide, index) => (
                    <div key={index} className="item absolute w-[400px] h-[560px] transition-all duration-500" style={{ left: 'calc(50% - 200px)', top: '20px' }}>
                        <Image src={slide.imageUrl} alt={slide.alt} width={400} height={560} className="rounded-lg shadow-lg " loading="lazy"
                            priority={index === active} />
                    </div>
                ))}
            </div>
            <button onClick={handlePrev} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all duration-300">
                <ChevronLeft size={24} />
            </button>
            <button onClick={handleNext} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all duration-300">
                <ChevronRight size={24} />
            </button>
        </div>
    );
};

export default Slider;