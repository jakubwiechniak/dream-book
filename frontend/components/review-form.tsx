"use client"

import type React from "react"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { StarRating } from "@/components/star-rating"
import { submitReview } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import type { Stay } from "@/lib/types"

interface ReviewFormProps {
    stay: Stay
    isOpen: boolean
    onClose: () => void
    onReviewSubmitted: (stayId: string, rating: number) => void
}

export function ReviewForm({ stay, isOpen, onClose, onReviewSubmitted }: ReviewFormProps) {
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        overallRating: 0,
        cleanliness: 0,
        communication: 0,
        checkIn: 0,
        accuracy: 0,
        comment: "",
    })

    const handleRatingChange = (category: string, value: number) => {
        setFormData((prev) => ({
            ...prev,
            [category]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.overallRating === 0) {
            toast({
                title: "Rating required",
                description: "Please provide an overall rating for your stay",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)

        try {
            await submitReview(stay.id, formData)
            toast({
                title: "Review submitted",
                description: "Thank you for sharing your experience!",
            })
            onReviewSubmitted(stay.id, formData.overallRating)
            onClose()
        } catch (error) {
            toast({
                title: "Submission failed",
                description: "There was an error submitting your review. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Review your stay at {stay.propertyName}</DialogTitle>
                    <DialogDescription>Share your experience to help other guests make the right choice.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="overall-rating" className="text-base">
                                Overall Rating
                            </Label>
                            <div className="mt-2">
                                <StarRating
                                    value={formData.overallRating}
                                    onChange={(value) => handleRatingChange("overallRating", value)}
                                    size="large"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="cleanliness" className="text-sm">
                                    Cleanliness
                                </Label>
                                <div className="mt-1">
                                    <StarRating
                                        value={formData.cleanliness}
                                        onChange={(value) => handleRatingChange("cleanliness", value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="communication" className="text-sm">
                                    Communication
                                </Label>
                                <div className="mt-1">
                                    <StarRating
                                        value={formData.communication}
                                        onChange={(value) => handleRatingChange("communication", value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="check-in" className="text-sm">
                                    Check-in
                                </Label>
                                <div className="mt-1">
                                    <StarRating value={formData.checkIn} onChange={(value) => handleRatingChange("checkIn", value)} />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="accuracy" className="text-sm">
                                    Accuracy
                                </Label>
                                <div className="mt-1">
                                    <StarRating value={formData.accuracy} onChange={(value) => handleRatingChange("accuracy", value)} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="comment" className="text-base">
                                Your Review
                            </Label>
                            <Textarea
                                id="comment"
                                placeholder="Share the details of your experience at this property..."
                                className="mt-2 h-32"
                                value={formData.comment}
                                onChange={(e) => setFormData((prev) => ({ ...prev, comment: e.target.value }))}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
