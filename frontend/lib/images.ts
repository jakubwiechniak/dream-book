const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY

export async function getRandomUnsplashImage(query: string): Promise<string | null> {
    if (!UNSPLASH_ACCESS_KEY) {
        console.error("Missing Unsplash API key")
        return null
    }

    try {
        const response = await fetch(
            `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
        )

        if (!response.ok) {
            return null
        }

        const data = await response.json()
        return data?.urls?.regular || null
    } catch (error) {
        console.error("Error fetching Unsplash image:", error)
        return null
    }
}