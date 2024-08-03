// import { NextRequest, NextResponse } from "next/server";
// import { spawn } from "child_process";
// import { createClient } from "@supabase/supabase-js";
// import {
// 	generateCard,
// 	generateImagesForCards,
// } from "@/utils/functions/card/get_prompt";
// import { Card, Ability } from "../../../utils/functions/card/card"; // Adjust the import path as needed

// const supabase = createClient(
// 	process.env.SUPABASE_URL as string,
// 	process.env.SUPABASE_SERVICE_ROLE_KEY as string
// );

// interface FormData {
// 	description: string;
// 	element: string;
// 	rarity: number;
// 	evolvement: number;
// 	holdable: boolean;
// 	wearable: boolean;
// 	detail: boolean;
// }

// export async function POST(req: NextRequest) {
// 	const headers = req.headers;
// 	const secret = headers?.get("x-internal-api-secret");

// 	if (secret !== process.env.NEXT_PUBLIC_INTERNAL_API_SECRET) {
// 		return NextResponse.json(
// 			{ message: "Forbidden!!!!!!" },
// 			{ status: 403 }
// 		);
// 	}
// 	const formData = (await req.json()) as FormData;

// 	try {
// 		const cards = await generateCard(
// 			formData.description,
// 			formData.element,
// 			formData.rarity,
// 			formData.evolvement,
// 			[formData.holdable, formData.wearable, formData.detail]
// 		);

// 		const updatedCards = await generateImagesForCards(cards);
// 		const updatedCardsString = JSON.stringify(updatedCards);

// 		const pythonProcess = spawn("python", ["@/utils/render_card.py"]); // Adjust the path as needed

// 		pythonProcess.stdin.write(updatedCardsString);
// 		pythonProcess.stdin.end();

// 		let stdout = "";
// 		let stderr = "";

// 		pythonProcess.stdout.on("data", (data) => {
// 			stdout += data.toString();
// 		});

// 		pythonProcess.stderr.on("data", (data) => {
// 			stderr += data.toString();
// 		});

// 		return new Promise((resolve, reject) => {
// 			pythonProcess.on("close", async (code) => {
// 				if (code !== 0) {
// 					console.error(`Python process exited with code ${code}`);
// 					console.error(`stderr: ${stderr}`);
// 					resolve(
// 						NextResponse.json(
// 							{ error: `Error rendering cards: ${stderr}` },
// 							{ status: 500 }
// 						)
// 					);
// 				} else {
// 					await sendToSupabase(updatedCards);
// 					resolve(NextResponse.json(updatedCards, { status: 200 }));
// 				}
// 			});
// 		});
// 	} catch (error) {
// 		console.error("Error generating cards:", error);
// 		return NextResponse.json(
// 			{ error: "Error generating cards" },
// 			{ status: 500 }
// 		);
// 	}
// }

// async function sendToSupabase(cards: Record<string, Card>) {
// 	let evolvementId: number[] = [];
// 	for (const key in cards) {
// 		const card = cards[key];
// 		const {
// 			name,
// 			description,
// 			element,
// 			evolvement,
// 			rarity_index,
// 			hp,
// 			image_prompt,
// 			image_url,
// 		} = card;
// 		const abilities = card.abilities;

// 		const { data: pokemonData, error: pokemonError } = await supabase
// 			.from("pokemon")
// 			.insert([
// 				{
// 					name,
// 					description,
// 					element,
// 					evolvement: evolvement,
// 					rarity_index,
// 					hp,
// 					image_prompt,
// 					image_url,
// 				},
// 			])
// 			.select();

// 		if (pokemonError) {
// 			console.error("Error inserting Pokémon:", pokemonError.message);
// 			continue;
// 		}

// 		const pokemonId = pokemonData[0].pokemon_id;

// 		for (const ability of abilities) {
// 			const {
// 				name,
// 				description,
// 				element,
// 				cost,
// 				is_mixed_element,
// 				power,
// 			} = ability;
// 			const { data: abilityData, error: abilityError } = await supabase
// 				.from("ability")
// 				.insert([
// 					{
// 						name,
// 						description,
// 						element,
// 						cost,
// 						is_mixed_element,
// 						power,
// 						pokemon_id: pokemonId,
// 					},
// 				])
// 				.select();

// 			if (abilityError) {
// 				console.error("Error inserting Ability:", abilityError.message);
// 			}
// 		}
// 		evolvementId.push(pokemonId);
// 	}

// 	const generationData = {
// 		evolvement_0: evolvementId[0] || null,
// 		evolvement_1: evolvementId[1] || null,
// 		evolvement_2: evolvementId[2] || null,
// 	};

// 	const { error: generationError } = await supabase
// 		.from("generation")
// 		.insert(generationData);

// 	if (generationError) {
// 		console.error("Error inserting generation:", generationError.message);
// 	}
// }
