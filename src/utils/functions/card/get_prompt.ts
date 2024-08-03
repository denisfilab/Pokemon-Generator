// List of input

import { Card, Ability } from './card'
import fs from 'fs'
import { main, generateImage } from '../gptclient'
import axios from 'axios'
/**
 * Adjectives and ambiences for the subject element are derived from
 * https://github.com/pixegami/pokémon-card-generator/blob/main/src/pokémon_content/pokémon_content_pool.py
 */
type Element =
    | 'NEUTRAL'
    | 'FIRE'
    | 'WATER'
    | 'GRASS'
    | 'ELECTRIC'
    | 'PSYCHIC'
    | 'FIGHTING'

function getRarityAdjectives(rarityIndex: number) {
    if (rarityIndex === 0) {
        return ['simple', 'basic']
    }
    if (rarityIndex === 1) {
        return ['strong', 'rare', 'special']
    }
    if (rarityIndex === 2) {
        return ['legendary', 'epic', 'mythical']
    } else {
        return ['']
    }
}
const DETAIL_ADJECTIVES_BY_ELEMENT: Record<Element, string[]> = {
    NEUTRAL: ['white', 'shiny', 'prismatic', 'opal', 'diamond'],
    FIRE: ['red and white', 'orange and black', 'fiery', 'ruby'],
    WATER: [
        'blue and white',
        'white and black',
        'teal and navy',
        'blue crystal',
        'cyan glittering',
        'sapphire',
    ],
    GRASS: [
        'green and brown',
        'white and green',
        'stone',
        'wooden',
        'leafy',
        'green runic',
    ],
    ELECTRIC: [
        'yellow and teal',
        'yellow and black',
        'golden',
        'lightning-charged',
    ],
    PSYCHIC: ['amethyst', 'purple cosmic', 'galaxy-pattern', 'violet hypnotic'],
    FIGHTING: ['red and black', 'rocky', 'stone', 'brown and grey'],
}

const ENVIRONMENTS_BY_ELEMENT: Record<Element, string[]> = {
    NEUTRAL: ['village', 'field', 'grassland'],
    FIRE: ['volcano', 'desert'],
    WATER: ['ocean', 'lake', 'river'],
    GRASS: ['forest', 'jungle', 'woods'],
    ELECTRIC: ['mountain', 'city', 'thunderstorm'],
    PSYCHIC: ['castle', 'cave', 'crypt'],
    FIGHTING: ['arena', 'ruins', 'canyon'],
}

const AMBIENCE_BY_ELEMENT: Record<Element, string[]> = {
    NEUTRAL: [
        'pastel colors',
        'bright lighting',
        'soft ambient light',
        'faded prismatic bokeh background',
        'silver galaxy background',
    ],
    FIRE: [
        'red and purple ambient lighting',
        'blue and red ambient lighting',
        'lava texture background',
        'orange galaxy background',
    ],
    WATER: [
        'teal and blue ambient lighting',
        'aurora background',
        'sparkling blue background',
        'gleaming bubble background',
        'sapphire blue galaxy background',
    ],
    GRASS: [
        'green and orange ambient lighting',
        'green and teal ambient lighting',
        'emerald bokeh lighting',
        'sunlight ray ambience',
        'emerald galaxy background',
    ],
    ELECTRIC: [
        'yellow and teal ambient lighting',
        'lightning background',
        'orange galaxy background',
    ],
    PSYCHIC: [
        'pink bokeh lighting',
        'violet shadows',
        'dreamy background',
        'galaxy background',
    ],
    FIGHTING: [
        'orange ambient lighting',
        'red and purple ambient lighting',
        'orange and blue ambient lighting',
        'galaxy background',
    ],
}

const pokémon_UNIQUE_FEAUTURES = {
    holdableItems: [
        'sword',
        'bow',
        'staff',
        'shield',
        'axe',
        'dagger',
        'spear',
        'mace',
        'hammer',
        'club',
        'lance',
        'whip',
        'glaive',
        'crossbow',
        'scythe',
        'katana',
        'flail',
        'trident',
        'chakram',
        'boomerang',
        'halberd',
        'morningstar',
        'sling',
        'javelin',
        'nunchaku',
        'tome',
        'orb',
        'wand',
        'rapier',
        'scimitar',
        'sabre',
        'battleaxe',
        'warhammer',
        'longbow',
        'shortbow',
        'blowgun',
        'dart',
        'polearm',
        'sai',
        'shuriken',
    ],
    details: [
        'claws',
        'tail',
        'horns',
        'hooves',
        'tusks',
        'fur',
        'skin',
        'antlers',
        'scales',
        'shell',
        'crystal core',
        'halo',
        'wings',
        'fins',
        'tentacles',
        'feathers',
        'talons',
        'beak',
        'carapace',
        'texture',
        'spikes',
        'fangs',
        'gills',
        'mane',
        'quills',
        'pincers',
        'antennae',
        'ears',
        'eyes',
        'snout',
        'whiskers',
        'webbed feet',
        'glowing markings',
        'bioluminescence',
        'scars',
        'plumage',
        'crest',
        'beard',
        'horn plates',
        'wing membranes',
        'third eye',
        'gemstones',
        'tail spikes',
        'cloaking scales',
        'ink sac',
        'regenerative skin',
    ],
    wearables: [
        'armor',
        'bracers',
        'gemstones',
        'mask',
        'crown',
        'crystal headband',
        'cape',
        'cloak',
        'helmet',
        'boots',
        'gauntlets',
        'belt',
        'pauldrons',
        'greaves',
        'chainmail',
        'plate armor',
        'robe',
        'sash',
        'amulet',
        'ring',
        'earrings',
        'necklace',
        'gloves',
        'scarf',
        'hood',
        'tunic',
        'vest',
        'tabard',
        'kilt',
        'armbands',
        'bandana',
        'goggles',
        'visor',
        'diadem',
        'circlet',
        'charm',
        'pendant',
        'brooch',
        'anklet',
        'bracelet',
        'wristbands',
    ],
}

function getRandomFeatures(accessoriesFeaturesBoolean: boolean[]) {
    let features = []
    let isHoldableItems = accessoriesFeaturesBoolean[0]
    let isDetails = accessoriesFeaturesBoolean[1]
    let isWearables = accessoriesFeaturesBoolean[2]

    if (isHoldableItems) {
        const randomIndex = Math.floor(
            Math.random() * pokémon_UNIQUE_FEAUTURES.holdableItems.length
        )
        features.push(pokémon_UNIQUE_FEAUTURES.holdableItems[randomIndex])
    } else {
        features.push('')
    }

    if (isDetails) {
        const randomIndex = Math.floor(
            Math.random() * pokémon_UNIQUE_FEAUTURES.details.length
        )
        features.push(pokémon_UNIQUE_FEAUTURES.details[randomIndex])
    } else {
        features.push('')
    }

    if (isWearables) {
        const randomIndex = Math.floor(
            Math.random() * pokémon_UNIQUE_FEAUTURES.wearables.length
        )
        features.push(pokémon_UNIQUE_FEAUTURES.wearables[randomIndex])
    } else {
        features.push('')
    }

    return features
}

function getSeriesAdjectivesSet(evolvement: number) {
    if (evolvement === 0) {
        return ['chibi cute', 'chibi young']
    }
    if (evolvement === 1) {
        return ['young', 'middle', 'dynamic']
    }
    if (evolvement === 2) {
        return ['gigantic', 'massive']
    }
    return []
}

function getRaritySizeAdjectives(rarityIndex: number) {
    let rarityAdjectives = getSeriesAdjectivesSet(rarityIndex)
    let randomIndex = Math.floor(Math.random() * rarityAdjectives.length)
    return rarityAdjectives[randomIndex]
}

function getDetailbyAdjectives(element: Element) {
    const detailList = DETAIL_ADJECTIVES_BY_ELEMENT[element]
    const randomIndex = Math.floor(Math.random() * detailList.length)
    return detailList[randomIndex]
}

function getRandomRarityAdjective(rarityIndex: number) {
    const adjectivesArray = getRarityAdjectives(rarityIndex)
    const randomIndex = Math.floor(Math.random() * adjectivesArray.length)
    return adjectivesArray[randomIndex]
}
function getStyleSuffix(rarityIndex: number) {
    if (rarityIndex === 0) {
        return ['anime with watercolor, pastel background, full frame']
    }
    if (rarityIndex === 1) {
        return ['anime with watercolor, full frame']
    }
    if (rarityIndex === 2) {
        return ['anime watercolor spectacular, full frame']
    }
    return []
}

function getRandomEnvironment(element: Element) {
    // Check if element is a list
    const environment = ENVIRONMENTS_BY_ELEMENT[element]
    const randomIndex = Math.floor(Math.random() * environment.length)
    return environment[randomIndex]
}

function getRandomAmbience(element: Element) {
    const ambienceList = AMBIENCE_BY_ELEMENT[element]
    const randomIndex = Math.floor(Math.random() * (ambienceList.length - 1))
    return ambienceList[randomIndex]
}

function generateVisualDescriptions(
    subjectName: string,
    element: Element,
    rarity: number,
    evolvement: number,
    accessoriesFeaturesBoolean: boolean[]
) {
    console.log('Generating visual descriptions for:', subjectName, element)
    element = element.toUpperCase() as Element // Type assertion here
    let descriptions: { [key: number]: string } = {}
    let accessories = getRandomFeatures(accessoriesFeaturesBoolean)
    let randomEnvironment = getRandomEnvironment(element)
    let randomAmbience = getRandomAmbience(element)
    let detailAdjectives = getDetailbyAdjectives(element)
    for (let i = 0; i < evolvement + 1; i++) {
        let accessoriesFeatures = `${
            accessories[0] ? `this pokémon is holding a ${accessories[0]},` : ''
        } ${
            accessories[1]
                ? `this pokémon has detail of a ${accessories[1]},`
                : ''
        } ${
            accessories[2]
                ? `this pokémon is wearing a ${accessories[2]}, `
                : ''
        }`
        let visualDescription = ''
        if (i < 2) {
            visualDescription = `Generate a pokémon that resembled a ${getRandomRarityAdjective(
                rarity
            )} ${getRaritySizeAdjectives(
                i
            )} ${element}-type ${subjectName} pokémon with ${detailAdjectives}, in a ${randomEnvironment} environment, ${randomAmbience}, ${accessoriesFeatures}, ${getStyleSuffix(
                i
            )} --niji`
        } else {
            let array = AMBIENCE_BY_ELEMENT[element]
            let lastElement = array[array.length - 1]
            visualDescription = `Generate a pokémon that resembled a ${getRandomRarityAdjective(
                rarity
            )} ${getRaritySizeAdjectives(
                i
            )} ${element}-type ${subjectName} pokémon with ${detailAdjectives}, in a ${randomEnvironment} environment, ${lastElement}, ${accessoriesFeatures}, ${getStyleSuffix(
                i
            )} --niji`
        }
        visualDescription +=
            ' the image should cover the whole resolution DONT INCLUDE pokémon TEXT'
        descriptions[i] = visualDescription
        if (rarity < 2) {
            rarity += 1
        }
    }
    return descriptions
}

// Generate Ability Statistic
async function generateAbilityAndName(description: string, element: Element) {
    const abilityElements = ['mixed', element, 'neutral']
    const randomIndex = Math.floor(Math.random() * abilityElements.length)
    const abilityElement = abilityElements[randomIndex]
    let abilityInstruction = ''

    if (abilityElement === 'mixed') {
        abilityInstruction = `The ability should be a mix of neutral-type and ${element}-type`
    } else if (abilityElement === 'neutral') {
        abilityInstruction = `The ability should be a neutral-type`
    } else {
        abilityInstruction = `The ability should be a ${element}-type`
    }

    let prompt = `You are an expert pokémon Trainer. You have discovered a new pokémon with the following description: "${description}". Based on the information provided, please perform the following tasks:
    1. Generate a unique and creative pokémon name.
    2. Create an ability name for this pokémon that is 1-2 words long.
    3. ${abilityInstruction}
    4. Write a short but detailed description of the ability, ensuring that the description does not mention the pokémon name.
    
    Return the result in JSON format with the following structure:
    {
        "pokémonName": "Name",
        "name": "Name of the ability",
        "description": "Detailed description of the ability"
    }`

    let abilityJson
    try {
        const response = await main(prompt)
        console.log('GPT-3 API response:', response) // Log the response

        // Check if response.choices[0].message exists
        if (
            response?.choices &&
            response.choices.length > 0 &&
            response.choices[0].message &&
            response.choices[0].message.content
        ) {
            console.log(
                'GPT-3 API message content:',
                response.choices[0].message.content
            )
            abilityJson = JSON.parse(response.choices[0].message.content)
            abilityJson.elements = abilityElement
            console.log('Parsed ability JSON:', abilityJson)
        } else {
            throw new Error('Invalid API response structure')
        }
    } catch (error) {
        console.error(
            'An error occurred while generating ability and name:',
            error
        )
        throw error // Re-throw the error after logging it
    }

    return abilityJson
}

function generatePokemonStats(evolvement: number, Element: string) {
    // Validate input
    if (evolvement < 0 || evolvement > 2) {
        throw new Error('Evolvement must be between 0 and 2')
    }

    // Base values
    let baseCost = 2
    let basePower = 30
    let baseHp = 50

    // Evolvement factor (increases with each evolution)
    const evolvementFactor = 1 + evolvement * 0.5 // 1, 1.5, or 2

    // Element type factor (mixed types are slightly stronger but more costly)
    const elementFactor = Element === 'mixed' ? 1.2 : 1

    // Calculate cost
    let cost = Math.round(baseCost * evolvementFactor * elementFactor)
    cost = Math.min(Math.max(cost, 1), 6) // Ensure cost is between 1 and 6

    // Calculate power
    let power = Math.round(basePower * evolvementFactor * elementFactor)
    power += (cost - baseCost) * 10 // Each point of cost above base adds 10 power

    // Calculate HP
    let hp = Math.round(
        baseHp * evolvementFactor * (Element === 'mixed' ? 1.1 : 1)
    )

    // Add some randomness
    const randomFactor = () => Math.random() * 0.2 + 0.9 // Random factor between 0.9 and 1.1
    power = Math.round(power * randomFactor())
    hp = Math.round(hp * randomFactor())

    return {
        cost: cost,
        power: power,
        hp: hp,
    }
}

async function generateAbility(
    description: string,
    element: Element,
    evolvement: number
) {
    let ability = await generateAbilityAndName(description, element)
    if (!ability) {
        throw new Error('Failed to generate ability')
    }

    let is_mixed_element = ability.elements
    let statistics = generatePokemonStats(evolvement, is_mixed_element)
    let combinedAbility = {
        ...ability,
        ...statistics,
    }

    return combinedAbility
}

async function generateCard(
    subjectName: string,
    elements: Element,
    rarity: number,
    evolvement: number,
    accessoriesFeaturesBoolean: boolean[]
) {
    let visualDescriptions
    try {
        visualDescriptions = generateVisualDescriptions(
            subjectName,
            elements,
            rarity,
            evolvement,
            accessoriesFeaturesBoolean
        )
        console.log('Visual Descriptions:', visualDescriptions)
    } catch (error) {
        console.error('Error generating visual descriptions:', error)
        throw new Error('Failed to generate visual descriptions')
    }

    let generation: { [key: number]: Card } = {}
    for (let i = 0; i <= evolvement; i++) {
        try {
            let tempVisualDescription = visualDescriptions[i]
            console.log(
                `Generating ability for evolvement ${i} with description: ${tempVisualDescription}`
            )

            let ability = await generateAbility(
                tempVisualDescription,
                elements,
                i
            )
            console.log('Generated ability:', ability)

            let hp = ability.hp
            let card = new Card(
                1,
                ability.pokémonName,
                '',
                elements,
                i,
                rarity,
                hp,
                tempVisualDescription
            )
            let newAbility = new Ability(
                ability.name,
                elements,
                ability.description,
                ability.cost,
                ability.elements,
                ability.power
            )
            card.abilities.push(newAbility)
            card.image_prompt = tempVisualDescription
            generation[i] = card

            console.log(`Generated card for evolvement ${i}:`, card)
        } catch (error) {
            console.error(`Error generating card for evolvement ${i}:`, error)
            throw new Error(`Failed to generate card for evolvement ${i}`)
        }
    }
    return generation
}

async function generateImagesForCards(cards: { [key: string]: Card }) {
    for (const key in cards) {
        if (cards.hasOwnProperty(key)) {
            const card = cards[key]
            let index = card.index
            try {
                console.log('Generating Card Image: ' + card.name)
                const finalPrompt = card.image_prompt
                const b64_image = await generateImage(finalPrompt)
                console.log(`Generated image for card ${key}: ${b64_image}`)
                const imageFileName = `${index}_${card.name.toLowerCase()}.png`

                // You can add the image URL to the card object if needed
                cards[key].image_prompt = finalPrompt
                cards[key].image_url = b64_image
                cards[key].image_file = imageFileName
            } catch (error) {
                console.error(
                    `Error generating image for card ${card.name}_${index}.png:`,
                    error
                )
            }
        }
    }
    console.log(cards)
    return cards
}

// async function downloadImage(url: string, path: string) {
//   if (url === '') {
//     throw Error('No image URL provided')
//   }
//   const response = await axios({
//     url,
//     responseType: 'stream',
//   })
//   return new Promise<void>((resolve, reject) => {
//     response.data
//       .pipe(fs.createWriteStream(path))
//       .on('finish', () => resolve())
//       .on('error', (e: any) => reject(e))
//   })
// }

export {
    getRarityAdjectives,
    getRandomFeatures,
    getSeriesAdjectivesSet,
    getRaritySizeAdjectives,
    getDetailbyAdjectives,
    getRandomRarityAdjective,
    getStyleSuffix,
    getRandomEnvironment,
    getRandomAmbience,
    generateVisualDescriptions,
    generateAbilityAndName,
    generatePokemonStats,
    generateAbility,
    generateCard,
    generateImagesForCards,
}
// let card = await generateCard("salamander", "water", 2, 2, [true, true, true]);
// let json = JSON.stringify(card, null, 2)

// fs.writeFile('card.json', json, 'utf8', function(err) {
//     if (err) {
//         console.log("An error occured while writing JSON Object to File.");
//         return console.log(err);
//     }

//     console.log("JSON file has been saved.");
// });
