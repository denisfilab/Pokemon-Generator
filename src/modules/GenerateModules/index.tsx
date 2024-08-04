'use client'
import PokemonForm from "./elements/Form";
import CardBackground from "./elements/CardBackground";
import { useEffect, useState } from "react";


interface Ability {
    name: string;
    description: string;
    element: string;
    cost: number;
    is_mixed_element: string;
    power: number;
}

interface Card {
    index: number;
    name: string;
    description: string;
    element: string;
    evolvement: number;
    rarity_index: number;
    hp: number;
    abilities: Ability[];
    image_prompt: string;
    image_url: string;
    image_file: string;
}

interface CardsState {
    [key: string]: Card;
}
const GenerateModules = () => {
    const [status, setStatus] = useState<string | null>(null);
    const [cards, setCards] = useState<CardsState>({});

    const handleFormSubmit = async (values: any) => {
        setStatus('Generating card properties...');
        try {
            const response = await fetch('/api/generate-cards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${values.password}`
                },
                body: JSON.stringify(values)
            });

            if (!response.ok) {
                setStatus('Error generating card: contact me for help');
                throw new Error(`Error: ${response.statusText}`);
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (reader) {
                let text = '';
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    text += decoder.decode(value, { stream: true });

                    // Extract and log messages from the event stream
                    const messages = text.split('\n\n').filter(Boolean);
                    messages.forEach(msg => {
                        if (msg.startsWith('data: ')) {
                            const messageContent = msg.replace('data: ', '');
                            try {
                                const json = JSON.parse(messageContent);
                                console.log(json.message);
                                setStatus(json.message);
                            } catch (e) {
                                console.error('Error parsing message', e);
                            }
                        }
                    });
                }

                // Find the final data block and parse it
                const finalDataMatch = text.match(/data: ({.*})\n\n$/);
                if (finalDataMatch) {
                    const finalData = JSON.parse(finalDataMatch[1]);
                    console.log('Final card data:', finalData.data);
                    if (finalData.data && typeof finalData.data === 'object') {
                        setCards(finalData.data);
                    } else {
                        console.error('Invalid card data received:', finalData.data);
                        setStatus('Error: Invalid card data received');
                    }
                } else {
                    console.error('No final data found in the response');
                    setStatus('Error: No card data received');
                }
                setStatus('Card generated successfully');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('Error generating card');
        }
    };

    useEffect(() => {
        console.log("Cards state updated:", cards);

    }, [cards]);
    return (
        <div className="w-full h-full flex flex-row justify-center items-center pt-[6rem]">
            <div className="relative w-[90vw] h-[80vh]">
                <div className="absolute z-0 w-full left-3 top-3 h-full border-[6px] bg-black border-black rounded-sm" />
                <div className="flex relative z-10 w-full h-full border-[6px] bg-[#fbf9f5] border-black rounded-sm">
                    <div className="w-[30%] px-6 py-6 border-r-4 border-black font-outfit">
                        <PokemonForm onSubmit={handleFormSubmit} />
                    </div>
                    <div className="flex flex-col w-[80%] h-full">
                        <div className="flex w-full px-6 py-4 border-b-4 border-black font-outfit text-2xl justify-center items-center">
                            <h1 className="text-center">Card Preview</h1>
                        </div>
                        <div className="flex flex-row h-full justify-center gap-[2rem] items-center ju p-6">
                            {Object.entries(cards).map(([key, card]) => (
                                <CardBackground
                                    key={key}
                                    imageUrl={`https://ezvoyqyobltsardvbeox.supabase.co/storage/v1/object/public/card/generated_cards/${(card.name).toLowerCase()}`}
                                />
                            ))}
                        </div>
                        <div className="flex w-full px-6 py-4 border-t-4 border-black font-outfit text-2xl justify-center items-center">
                            {status && <p className="text-center">{status}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GenerateModules;