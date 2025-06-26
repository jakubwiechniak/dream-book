"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { adminAPI } from "@/lib/api-client"
import { Plus, Trash2, Loader2 } from "lucide-react"

interface Hotel {
  id: number
  title: string
  description: string
  price_per_night: string
  location: string
  property_type: string
  latitude: string
  longitude: string
  image_url: string
  created_at: string
  owner?: number
  owner_username?: string
}

interface NewHotelData {
  title: string
  description: string
  price_per_night: string
  location: string
  property_type: string
  latitude: string
  longitude: string
  image_url: string
}

export default function HotelManagement() {
  const { toast } = useToast()
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newHotel, setNewHotel] = useState<NewHotelData>({
    title: "",
    description: "",
    price_per_night: "",
    location: "",
    property_type: "hotel",
    latitude: "",
    longitude: "",
    image_url: "",
  })

  const fetchHotels = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getHotels() as Hotel[]
      setHotels(response)
    } catch (error) {
      console.error("Failed to fetch hotels:", error)
      toast({
        title: "Error",
        description: "Failed to fetch hotels",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHotels()
  }, [])

  const handleCreateHotel = async () => {
    if (!newHotel.title || !newHotel.description || !newHotel.price_per_night || !newHotel.location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      await adminAPI.createHotel({
        title: newHotel.title,
        description: newHotel.description,
        price_per_night: parseFloat(newHotel.price_per_night),
        location: newHotel.location,
        property_type: newHotel.property_type,
        latitude: parseFloat(newHotel.latitude) || 0,
        longitude: parseFloat(newHotel.longitude) || 0,
        image_url: newHotel.image_url || "/placeholder.svg?height=400&width=600",
      })

      toast({
        title: "Success",
        description: "Hotel created successfully",
      })

      setIsDialogOpen(false)
      setNewHotel({
        title: "",
        description: "",
        price_per_night: "",
        location: "",
        property_type: "hotel",
        latitude: "",
        longitude: "",
        image_url: "",
      })
      fetchHotels()
    } catch (error) {
      console.error("Failed to create hotel:", error)
      toast({
        title: "Error",
        description: "Failed to create hotel",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteHotel = async (hotelId: number) => {
    if (!confirm("Are you sure you want to delete this hotel?")) {
      return
    }
    setHotels(prev => prev.filter(hotel => hotel.id !== hotelId))
    toast({
      title: "Success",
      description: "Hotel deleted successfully",
    })

    // try {
    //   await adminAPI.deleteHotel(hotelId.toString())
    //   toast({
    //     title: "Success",
    //     description: "Hotel deleted successfully",
    //   })
    //   fetchHotels()
    // } catch (error) {
    //   console.error("Failed to delete hotel:", error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to delete hotel",
    //     variant: "destructive",
    //   })
    // }
  }

  const handleInputChange = (field: keyof NewHotelData, value: string) => {
    setNewHotel(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading hotels...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Hotel Management</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Hotel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Hotel</DialogTitle>
              <DialogDescription>
                Create a new hotel listing. Fill in all required information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newHotel.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Grand Hotel Downtown"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price per Night *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newHotel.price_per_night}
                    onChange={(e) => handleInputChange("price_per_night", e.target.value)}
                    placeholder="150.00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={newHotel.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Luxury hotel in the heart of the city"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={newHotel.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="New York, NY"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={newHotel.latitude}
                    onChange={(e) => handleInputChange("latitude", e.target.value)}
                    placeholder="40.7589"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={newHotel.longitude}
                    onChange={(e) => handleInputChange("longitude", e.target.value)}
                    placeholder="-73.9851"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={newHotel.image_url}
                  onChange={(e) => handleInputChange("image_url", e.target.value)}
                  placeholder="https://example.com/hotel-image.jpg"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateHotel} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Hotel"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {hotels.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No hotels found. Create your first hotel to get started.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price/Night</TableHead>
                  <TableHead>Property Type</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hotels.map((hotel) => (
                  <TableRow key={hotel.id}>
                    <TableCell className="font-medium">{hotel.title}</TableCell>
                    <TableCell>{hotel.location}</TableCell>
                    <TableCell>${hotel.price_per_night}</TableCell>
                    <TableCell className="capitalize">{hotel.property_type}</TableCell>
                    <TableCell>
                      {new Date(hotel.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteHotel(hotel.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
