import Image from 'next/image';

const CardBackground = ({ imageUrl }: { imageUrl: string }) => {
    return (
        <div className='relative w-[30%]'>
            <div className="absolute z-0 w-full left-3 top-3 h-full border-[6px] bg-black border-black rounded-[4.5%]" />
            <div className='border-4 border-black rounded-[4.5%] relative z-10'>
                <Image
                    src={imageUrl}
                    alt="charizard"
                    className="z-[10]"
                    layout="responsive"
                    width={500}
                    height={500}
                />
            </div>
        </div>
    );
};

export default CardBackground;
