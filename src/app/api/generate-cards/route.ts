import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  generateCard,
  generateImagesForCards,
} from '@/utils/functions/card/get_prompt'
import { Card, Ability } from '@utils/functions/card/card' // Adjust the import path as needed
import { send } from 'process'

// Define the possible elements as a union of string literals
type Element =
  | 'NEUTRAL'
  | 'FIRE'
  | 'WATER'
  | 'GRASS'
  | 'ELECTRIC'
  | 'PSYCHIC'
  | 'FIGHTING'

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

interface FormData {
  description: string
  element: string
  rarity: number
  evolvement: number
  holdable: boolean
  wearable: boolean
  detail: boolean
}

export async function POST(req: NextRequest) {
  const headers = req.headers
  const authorization = headers.get('Authorization')

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const token = authorization.split(' ')[1]

  if (token !== process.env.PASSWORD) {
    return NextResponse.json({ message: 'Forbidden!' }, { status: 403 })
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const requestBody = await req.text()
        controller.enqueue(
          `data: ${JSON.stringify({ message: 'Request received' })}\n\n`
        )

        const formData = JSON.parse(requestBody) as FormData
        controller.enqueue(
          `data: ${JSON.stringify({ message: 'Form data parsed' })}\n\n`
        )

        let element = formData.element.toUpperCase() as Element

        if (
          ![
            'NEUTRAL',
            'FIRE',
            'WATER',
            'GRASS',
            'ELECTRIC',
            'PSYCHIC',
            'FIGHTING',
          ].includes(element)
        ) {
          throw new Error('Invalid element type')
        }

        controller.enqueue(
          `data: ${JSON.stringify({ message: 'Generating card...' })}\n\n`
        )
        let cards = await generateCard(
          formData.description,
          element,
          formData.rarity,
          formData.evolvement,
          [formData.holdable, formData.wearable, formData.detail]
        )

        controller.enqueue(
          `data: ${JSON.stringify({
            message: 'Generating images for cards...',
          })}\n\n`
        )
        cards = await generateImagesForCards(cards)

        controller.enqueue(
          `data: ${JSON.stringify({ message: 'Rendering cards...' })}\n\n`
        )
        await sendCardsToExternalEndpoint(cards)

        await sendToSupabase(cards)

        controller.enqueue(
          `data: ${JSON.stringify({
            message: 'Cards processed successfully',
          })}\n\n`
        )
        const finalResponse = JSON.stringify({ data: cards })
        controller.enqueue(`data: ${finalResponse}\n\n`)
        controller.close()
        return NextResponse.json({ data: cards }, { status: 200 })
      } catch (error: any) {
        console.error('Error handling POST request:', error)
        controller.enqueue(
          `data: ${JSON.stringify({ error: error.message })}\n\n`
        )
        controller.close()
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' },
  })
}

export async function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 })
}

async function sendToSupabase(cards: Record<string, Card>) {
  let evolvementId: number[] = []
  for (const key in cards) {
    const card = cards[key]
    const {
      name,
      description,
      element,
      evolvement,
      rarity_index,
      hp,
      image_prompt,
      image_url,
    } = card
    const abilities = card.abilities

    const { data: pokemonData, error: pokemonError } = await supabase
      .from('pokemon')
      .insert([
        {
          name,
          description,
          element,
          evolvement: evolvement,
          rarity_index,
          hp,
          image_prompt,
          image_url,
        },
      ])
      .select()

    if (pokemonError) {
      console.error('Error inserting Pokémon:', pokemonError.message)
      continue
    }

    const pokemonId = pokemonData[0].pokemon_id

    for (const ability of abilities) {
      const { name, description, element, cost, is_mixed_element, power } =
        ability
      const { data: abilityData, error: abilityError } = await supabase
        .from('ability')
        .insert([
          {
            name,
            description,
            element,
            cost,
            is_mixed_element,
            power,
            pokemon_id: pokemonId,
          },
        ])
        .select()

      if (abilityError) {
        console.error('Error inserting Ability:', abilityError.message)
      }
    }
    evolvementId.push(pokemonId)
  }

  const generationData = {
    evolvement_0: evolvementId[0] || null,
    evolvement_1: evolvementId[1] || null,
    evolvement_2: evolvementId[2] || null,
  }

  const { error: generationError } = await supabase
    .from('generation')
    .insert(generationData)

  if (generationError) {
    console.error('Error inserting generation:', generationError.message)
  }
}

async function sendCardsToExternalEndpoint(cards: Record<string, Card>) {
  const token = process.env.NEXT_PUBLIC_INTERNAL_API
  if (!token) {
    throw new Error('token is not defined')
  }

  const response = await fetch('http://3.106.206.27/render-card', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cards),
  })

  if (!response.ok) {
    throw new Error(
      `Error sending cards to external endpoint: ${response.statusText}`
    )
  }

  return response.json()
}
