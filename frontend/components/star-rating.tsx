"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
    value: number
    onChange: (value: number) => void
    size?: "default" | "large"
}

export function StarRating({ value, onChange, size = "default" }: StarRatingProps) {
    const [hoverValue, setHoverValue] = useState(0)

    const stars = [1, 2, 3, 4, 5]

    return (
        <div className="flex">
            {stars.map((star) => (
                <button
                    key={star}
                    type="button"
                    className={cn(
                        "text-gray-300 hover:text-yellow-400 focus:outline-none transition-colors",
                        size === "large" ? "p-1" : "p-0.5",
                    )}
                    onMouseEnter={() => setHoverValue(star)}
                    onMouseLeave={() => setHoverValue(0)}
                    onClick={() => onChange(star)}
                >
                    <Star
                        className={cn(
                            "transition-all",
                            (hoverValue || value) >= star ? "fill-yellow-400 text-yellow-400" : "fill-transparent text-gray-300",
                            size === "large" ? "h-8 w-8" : "h-5 w-5",
                        )}
                    />
                </button>
            ))}
        </div>
    )
}
