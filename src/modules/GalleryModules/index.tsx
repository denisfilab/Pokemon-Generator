import { useState, useEffect } from "react";
import CardGallery from "./elements/CardGallery";



const GalleryModules = () => {
    const [cards, setCards] = useState<any[]>([]);
    const [status, setStatus] = useState<string | null>(null);

    useEffect(() => {
        const fetchCards = async () => {
            setStatus('Loading...');
            try {
                const response = await fetch('/api/fetch-cards', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_INTERNAL_API}`
                    }
                });

                if (!response.ok) {
                    setStatus('Error fetching cards');
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json();
                setCards(data.message);
                setStatus(null);
            } catch (error) {
                console.error('Error fetching cards:', error);
                setStatus('Error fetching cards');
            }
        };

        fetchCards();
    }, []);

    return (
        <div className="w-full h-full flex flex-col justify-center items-center py-[6rem] px-[4rem]">
            <h1 className="font-outfit text-6xl font-bold text-gradient mb-[2rem]">Gallery</h1>
            {status && <p>{status}</p>}
            <div className="grid grid-cols-3 gap-8 gap-y-[15vw] w-full mt-[6vw]">
                {cards.map((card, index) => (
                    <div key={index} className="w-full h-full">
                        <CardGallery
                            imageUrl={`https://ezvoyqyobltsardvbeox.supabase.co/storage/v1/object/public/card/generated_cards/${(card.name).toLowerCase()}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
export default GalleryModules;