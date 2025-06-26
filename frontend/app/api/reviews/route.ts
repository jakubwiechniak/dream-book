import { type NextRequest, NextResponse } from "next/server"
import { mockGuestStays } from "@/lib/mock-data"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { stayId, overallRating, cleanliness, communication, checkIn, accuracy, comment } = body

        // Validate required fields
        if (!stayId || !overallRating) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // In a real application, you would save this to a database
        // For this example, we'll just update the mock data
        const stayIndex = mockGuestStays.findIndex((stay) => stay.id === stayId)

        if (stayIndex === -1) {
            return NextResponse.json({ error: "Stay not found" }, { status: 404 })
        }

        // Update the stay with the rating and mark as reviewed
        mockGuestStays[stayIndex].rating = overallRating
        mockGuestStays[stayIndex].hasReviewed = true

        // Create a review object (in a real app, this would be saved to a database)
        const review = {
            id: `rev-${Date.now()}`,
            stayId,
            overallRating,
            cleanliness,
            communication,
            checkIn,
            accuracy,
            comment,
            createdAt: new Date().toISOString(),
        }

        // Simulate a delay to mimic a real API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        return NextResponse.json({ success: true, review })
    } catch (error) {
        console.error("Error processing review:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
