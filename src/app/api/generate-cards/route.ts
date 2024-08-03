import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
    generateCard,
    generateImagesForCards,
} from '@/utils/functions/card/get_prompt'

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
    const authorization = headers?.get('Authorization')

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = authorization.split(' ')[1]

    if (token !== process.env.NEXT_INTERNAL_API) {
        return NextResponse.json({ message: 'Forbidden!' }, { status: 403 })
    }

    try {
        const requestBody = await req.text()
        console.log('Request body:', requestBody)

        const formData = JSON.parse(requestBody) as FormData
        console.log('Parsed form data:', formData)

        let element = formData.element.toUpperCase() as Element

        // Ensure element is of type Element
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
            return NextResponse.json(
                { message: 'Invalid element type' },
                { status: 400 }
            )
        }

        let cards = await generateCard(
            formData.description,
            element,
            formData.rarity,
            formData.evolvement,
            [formData.holdable, formData.wearable, formData.detail]
        )
        cards = await generateImagesForCards(cards)
        const updatedCards = { ...cards }
        return NextResponse.json({ updatedCards }, { status: 200 })
    } catch (error: any) {
        console.error('Error handling POST request:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function GET() {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 })
}
