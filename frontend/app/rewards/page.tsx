"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Gift, Crown, Star, MapPin, Zap, Award, TrendingUp } from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/header"
import { useAuthenticatedRoute } from "@/hooks/use-protected-route"

const rewardsData = {
  userPoints: 8750,
  nextTierPoints: 10000,
  currentTier: "Gold",
  nextTier: "Platinum",
  lifetimePoints: 24500,
  yearlySpent: 3200,
}

const exclusiveDeals = [
  {
    id: 1,
    name: "The Ritz-Carlton",
    location: "San Francisco, CA",
    image:
      "https://images.unsplash.com/photo-1575262172805-d6a5c7e16dba?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.9,
    memberPrice: 450,
    regularPrice: 580,
    pointsEarned: 900,
    exclusive: true,
  },
  {
    id: 2,
    name: "Four Seasons Resort",
    location: "Maui, HI",
    image:
      "https://images.unsplash.com/photo-1602691024897-aca7c1a68677?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.8,
    memberPrice: 650,
    regularPrice: 820,
    pointsEarned: 1300,
    exclusive: true,
  },
  {
    id: 3,
    name: "St. Regis Hotel",
    location: "New York, NY",
    image:
      "https://images.unsplash.com/photo-1577948256119-b185b337d474?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.9,
    memberPrice: 550,
    regularPrice: 720,
    pointsEarned: 1100,
    exclusive: true,
  },
]

const rewardBenefits = [
  {
    icon: Crown,
    title: "Room Upgrades",
    description: "Complimentary upgrades when available",
    active: true,
  },
  {
    icon: Gift,
    title: "Welcome Amenities",
    description: "Special gifts and treats upon arrival",
    active: true,
  },
  {
    icon: Zap,
    title: "Priority Support",
    description: "24/7 dedicated customer service",
    active: true,
  },
  {
    icon: Award,
    title: "Late Checkout",
    description: "Extended checkout until 4 PM",
    active: false,
  },
  {
    icon: TrendingUp,
    title: "Bonus Points",
    description: "Earn 2x points on weekend stays",
    active: false,
  },
]

const pointsHistory = [
  {
    date: "Dec 15, 2024",
    hotel: "Grand Plaza Hotel",
    points: 450,
    type: "earned",
  },
  {
    date: "Nov 28, 2024",
    hotel: "Mountain View Resort",
    points: 680,
    type: "earned",
  },
  {
    date: "Nov 10, 2024",
    description: "Free Night Reward",
    points: -7500,
    type: "redeemed",
  },
  {
    date: "Oct 22, 2024",
    hotel: "Oceanfront Paradise",
    points: 560,
    type: "earned",
  },
]

export default function RewardsPage() {
  const { isLoading, isAuthenticated } = useAuthenticatedRoute()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // User will be redirected by the hook
  }

  const progressPercentage =
    (rewardsData.userPoints / rewardsData.nextTierPoints) * 100

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main content */}
      <div className="w-full max-w-7xl mx-auto p-6">
        {/* Header */}

        {/* Rewards Status Card */}
        <Card className="mb-8 bg-gray-50 border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-black">
                    {rewardsData.currentTier} Member
                  </CardTitle>
                  <p className="text-gray-600">
                    {rewardsData.userPoints.toLocaleString()} points available
                  </p>
                  <p className="text-sm text-gray-500">
                    {rewardsData.lifetimePoints.toLocaleString()} lifetime
                    points
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-black text-white hover:bg-gray-800 mb-2">
                  {rewardsData.currentTier}
                </Badge>
                <p className="text-sm text-gray-500">
                  ${rewardsData.yearlySpent} spent this year
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2 text-gray-700">
                <span>Progress to {rewardsData.nextTier}</span>
                <span>
                  {rewardsData.nextTierPoints - rewardsData.userPoints} points
                  to go
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
            <div className="flex gap-4">
              <Button className="flex-1 bg-black text-white hover:bg-gray-800">
                Earn More Points
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Redeem Points
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Member Exclusive Deals */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-black">
              <Star className="w-6 h-6 text-black" />
              Member Exclusive Deals
            </h2>
            <div className="space-y-6">
              {exclusiveDeals.map((deal) => (
                <Card key={deal.id} className="overflow-hidden border-gray-200">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="relative">
                        <Image
                          src={deal.image || "/placeholder.svg"}
                          alt={deal.name}
                          width={200}
                          height={150}
                          className="w-40 h-32 object-cover"
                        />
                        <Badge className="absolute top-2 left-2 bg-black text-white text-xs">
                          Exclusive
                        </Badge>
                      </div>
                      <div className="flex-1 p-6">
                        <h3 className="font-semibold text-lg mb-2 text-black">
                          {deal.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          {deal.location}
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                          <Star className="w-4 h-4 fill-black text-black" />
                          <span className="font-medium text-black">
                            {deal.rating}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-black">
                              ${deal.memberPrice}
                            </span>
                            <span className="text-lg text-gray-500 line-through ml-2">
                              ${deal.regularPrice}
                            </span>
                            <p className="text-sm text-gray-700 font-medium">
                              +{deal.pointsEarned} points
                            </p>
                          </div>
                          <Button className="bg-black text-white hover:bg-gray-800">
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Benefits */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-black">
                <Gift className="w-5 h-5 text-black" />
                Your Benefits
              </h3>
              <div className="space-y-3">
                {rewardBenefits.map((benefit, index) => (
                  <Card
                    key={index}
                    className={`${
                      benefit.active
                        ? "border-gray-400 bg-gray-50"
                        : "border-gray-200 bg-gray-100"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            benefit.active ? "bg-black" : "bg-gray-400"
                          }`}
                        >
                          <benefit.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1 text-black">
                            {benefit.title}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {benefit.description}
                          </p>
                          {!benefit.active && (
                            <Badge
                              variant="secondary"
                              className="mt-2 text-xs bg-gray-200 text-gray-700"
                            >
                              Unlock at Platinum
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Points History */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-black">
                Recent Activity
              </h3>
              <Card className="border-gray-200">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {pointsHistory.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-start text-sm"
                      >
                        <div>
                          <p className="font-medium text-black">
                            {item.hotel || item.description}
                          </p>
                          <p className="text-gray-600">{item.date}</p>
                        </div>
                        <span
                          className={`font-medium ${
                            item.type === "earned"
                              ? "text-black"
                              : "text-gray-600"
                          }`}
                        >
                          {item.type === "earned" ? "+" : ""}
                          {item.points}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4 border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    View All Activity
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
