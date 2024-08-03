import OpenAI from 'openai'
const GPT_API = process.env.GPT_API
const openai = new OpenAI({
    apiKey: GPT_API,
})

async function main(messages: string) {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: messages },
            ],
            model: 'gpt-3.5-turbo-16k',
        })
        return completion
    } catch (error) {
        console.error(error)
    }
}

async function generateImage(prompt: string) {
    try {
        const response = await openai.images.generate({
            model: 'dall-e-3',
            prompt: prompt,
            n: 1,
            size: '1792x1024',
        })

        if (response && response.data && response.data.length > 0) {
            const base64_image = response.data[0].url
            console.log('Generated Image URL:', base64_image)
            return base64_image
        } else {
            throw new Error('No image URL found in the response')
        }
    } catch (error) {
        console.error('Error generating image:', error)
        throw error
    }
}

export { main, generateImage }
