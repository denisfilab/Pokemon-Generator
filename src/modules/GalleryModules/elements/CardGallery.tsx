import Image from 'next/image';

const CardGallery = ({ imageUrl, index }: { imageUrl: string, index: number }) => {
    return (
        <div className='relative w-full h-full'>
            <div className="absolute z-0 w-full left-3 top-3 h-full border-[6px] bg-black border-black rounded-[4.5%]" />
            <div className='border-4 border-black rounded-[4.5%] relative z-10 overflow-hidden'>
                <Image
                    src={imageUrl}
                    alt="charizard"
                    className="z-[10]"
                    layout="responsive"
                    width={700}
                    height={700}
                    priority={index < 6} // Set priority for first 6 images
                    loading={index < 6 ? "eager" : "lazy"}
                />
            </div>
        </div>
    );
};

export default CardGallery;
