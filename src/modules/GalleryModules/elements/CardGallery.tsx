import Image from 'next/image';

const CardGallery = ({ imageUrl }: { imageUrl: string }) => {
    return (
        <div className='relative w-[80%]'>
            <div className="absolute z-0 w-full left-3 top-3 h-full border-[6px] bg-black border-black rounded-[4.5%]" />
            <div className='border-4 border-black rounded-[4.5%] relative z-10'>
                <Image
                    src={imageUrl}
                    alt="charizard"
                    className="z-[10]"
                    layout="responsive"
                    width={700}
                    height={700}
                />
            </div>
        </div>
    );
};

export default CardGallery;
