"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Home, MapPin, Star, User } from "lucide-react"
import { fetchStays } from "@/lib/api"
import { ReviewForm } from "@/components/review-form"
import type { Stay } from "@/lib/types"

export default function RecentStays() {
    const [mode, setMode] = useState<"landlord" | "guest">("guest")
    const [stays, setStays] = useState<Stay[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [reviewStay, setReviewStay] = useState<Stay | null>(null)

    useEffect(() => {
        const loadStays = async () => {
            setLoading(true)
            try {
                const data = await fetchStays(mode)
                setStays(data)
                setError(null)
            } catch (err) {
                console.error("Failed to fetch stays:", err)
                setError("Failed to load recent stays. Using offline data.")
            } finally {
                setLoading(false)
            }
        }

        loadStays()
    }, [mode])

    const handleReviewSubmitted = (stayId: string, rating: number) => {
        setStays(stays.map((stay) => (stay.id === stayId ? { ...stay, rating, hasReviewed: true } : stay)))
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <Tabs defaultValue="guest" onValueChange={(value) => setMode(value as "landlord" | "guest")}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Recent Stays</h2>
                    <TabsList className="grid w-[260px] grid-cols-2">
                        <TabsTrigger value="guest">Guest Mode</TabsTrigger>
                        <TabsTrigger value="landlord">Landlord Mode</TabsTrigger>
                    </TabsList>
                </div>

                {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

                <TabsContent value="guest" className="mt-0">
                    <div className="grid gap-6">
                        <p className="text-muted-foreground">Your recent stays across various locations</p>
                        {renderStaysList(stays, loading, setReviewStay, mode)}
                    </div>
                </TabsContent>

                <TabsContent value="landlord" className="mt-0">
                    <div className="grid gap-6">
                        <p className="text-muted-foreground">Recent guest stays at your properties</p>
                        {renderStaysList(stays, loading, setReviewStay, mode)}
                    </div>
                </TabsContent>
            </Tabs>

            {reviewStay && (
                <ReviewForm
                    stay={reviewStay}
                    isOpen={!!reviewStay}
                    onClose={() => setReviewStay(null)}
                    onReviewSubmitted={handleReviewSubmitted}
                />
            )}
        </div>
    )
}

function renderStaysList(
    stays: Stay[],
    loading: boolean,
    setReviewStay: (stay: Stay | null) => void,
    mode: "landlord" | "guest",
) {
    if (loading) {
        return Array(3)
            .fill(0)
            .map((_, i) => <StayCardSkeleton key={i} />)
    }

    if (stays.length === 0) {
        return <p className="py-8 text-center text-muted-foreground">No recent stays found.</p>
    }

    return (
        <div className="grid gap-6">
            {stays.map((stay) => (
                <StayCard key={stay.id} stay={stay} onReview={mode === "guest" ? setReviewStay : undefined} />
            ))}
        </div>
    )
}

function StayCard({
    stay,
    onReview,
}: {
    stay: Stay
    onReview?: (stay: Stay) => void
}) {
    const canReview = onReview && stay.status === "completed" && !stay.hasReviewed

    return (
        <Card className="overflow-hidden border-2 border-border">
            <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 h-48 md:h-auto relative">
                    <img
                        src={stay.imageUrl || "/placeholder.svg"}
                        alt={stay.propertyName}
                        className="w-full h-full object-cover"
                    />
                    {stay.rating && (
                        <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-current" />
                                {stay.rating}
                            </Badge>
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>{stay.propertyName}</CardTitle>
                                <CardDescription className="flex items-center mt-1">
                                    <MapPin className="h-3.5 w-3.5 mr-1" />
                                    {stay.location}
                                </CardDescription>
                            </div>
                            <Avatar>
                                <AvatarImage src={stay.guestImageUrl || stay.hostImageUrl} />
                                <AvatarFallback>
                                    <User className="h-4 w-4" />
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2">
                            <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>
                                    {new Date(stay.checkIn).toLocaleDateString()} - {new Date(stay.checkOut).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex items-center text-sm">
                                <User className="h-4 w-4 mr-2" />
                                <span>{stay.guestName ? `Guest: ${stay.guestName}` : `Host: ${stay.hostName}`}</span>
                            </div>
                            <div className="flex items-center text-sm">
                                <Home className="h-4 w-4 mr-2" />
                                <span>{stay.propertyType}</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                            {stay.status === "completed" ? "Completed" : "Upcoming"} stay • {stay.nights}{" "}
                            {stay.nights === 1 ? "night" : "nights"}
                        </div>
                        {canReview && (
                            <Button variant="outline" size="sm" onClick={() => onReview(stay)} className="ml-auto">
                                Leave Review
                            </Button>
                        )}
                        {stay.hasReviewed && (
                            <Badge variant="outline" className="ml-auto">
                                Reviewed
                            </Badge>
                        )}
                    </CardFooter>
                </div>
            </div>
        </Card>
    )
}

function StayCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
                <Skeleton className="w-full md:w-1/3 h-48" />
                <div className="flex-1 p-6">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-2/3" />
                        <Skeleton className="h-4 w-1/3" />
                        <div className="pt-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full mt-2" />
                            <Skeleton className="h-4 w-2/3 mt-2" />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
