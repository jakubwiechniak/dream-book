import { type NextRequest, NextResponse } from "next/server"
import { mockLandlordStays, mockGuestStays } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
    // Get the mode from the query parameters
    const { searchParams } = new URL(request.url)
    const mode = (searchParams.get("mode") as "landlord" | "guest") || "guest"

    // In a real application, you would fetch data from a database here
    // For this example, we'll use the mock data
    const stays = mode === "landlord" ? mockLandlordStays : mockGuestStays

    // Simulate a delay to mimic a real API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json(stays)
}
