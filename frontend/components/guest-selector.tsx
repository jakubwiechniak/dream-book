"use client"

import * as React from "react"
import { UsersIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface GuestSelectorProps {
  value?: {
    adults: number
    children: number
    rooms: number
  }
  onChange?: (guests: {
    adults: number
    children: number
    rooms: number
  }) => void
}

export function GuestSelector({ value, onChange }: GuestSelectorProps) {
  const [adults, setAdults] = React.useState(value?.adults || 2)
  const [children, setChildren] = React.useState(value?.children || 0)
  const [rooms, setRooms] = React.useState(value?.rooms || 1)

  // Update local state when value prop changes
  React.useEffect(() => {
    if (value) {
      setAdults(value.adults)
      setChildren(value.children)
      setRooms(value.rooms)
    }
  }, [value])

  const updateValues = (
    newAdults: number,
    newChildren: number,
    newRooms: number
  ) => {
    if (onChange) {
      onChange({ adults: newAdults, children: newChildren, rooms: newRooms })
    }
  }

  const incrementAdults = () => {
    const newValue = adults + 1
    setAdults(newValue)
    updateValues(newValue, children, rooms)
  }

  const decrementAdults = () => {
    if (adults > 1) {
      const newValue = adults - 1
      setAdults(newValue)
      updateValues(newValue, children, rooms)
    }
  }

  const incrementChildren = () => {
    const newValue = children + 1
    setChildren(newValue)
    updateValues(adults, newValue, rooms)
  }

  const decrementChildren = () => {
    if (children > 0) {
      const newValue = children - 1
      setChildren(newValue)
      updateValues(adults, newValue, rooms)
    }
  }

  const incrementRooms = () => {
    const newValue = rooms + 1
    setRooms(newValue)
    updateValues(adults, children, newValue)
  }

  const decrementRooms = () => {
    if (rooms > 1) {
      const newValue = rooms - 1
      setRooms(newValue)
      updateValues(adults, children, newValue)
    }
  }

  const handleAdultsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1
    setAdults(value)
    updateValues(value, children, rooms)
  }

  const handleChildrenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0
    setChildren(value)
    updateValues(adults, value, rooms)
  }

  const handleRoomsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1
    setRooms(value)
    updateValues(adults, children, value)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <UsersIcon className="w-4 h-4 mr-2" />
          <span>
            {adults} {adults === 1 ? "Dorosły" : "Dorosłych"}, {children}{" "}
            {children === 1 ? "Dziecko" : "Dzieci"}, {rooms}{" "}
            {rooms === 1 ? "Pokój" : "Pokoje"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Goście</h4>
            <p className="text-sm text-muted-foreground">
              Wybierz liczbę gości i pokojów
            </p>
          </div>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="adults">Dorośli</Label>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-r-none"
                  onClick={decrementAdults}
                >
                  -
                </Button>
                <Input
                  id="adults"
                  type="number"
                  className="h-8 w-12 rounded-none text-center"
                  value={adults}
                  onChange={handleAdultsChange}
                  min={1}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-l-none"
                  onClick={incrementAdults}
                >
                  +
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="children">Dzieci</Label>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-r-none"
                  onClick={decrementChildren}
                >
                  -
                </Button>
                <Input
                  id="children"
                  type="number"
                  className="h-8 w-12 rounded-none text-center"
                  value={children}
                  onChange={handleChildrenChange}
                  min={0}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-l-none"
                  onClick={incrementChildren}
                >
                  +
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="rooms">Pokoje</Label>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-r-none"
                  onClick={decrementRooms}
                >
                  -
                </Button>
                <Input
                  id="rooms"
                  type="number"
                  className="h-8 w-12 rounded-none text-center"
                  value={rooms}
                  onChange={handleRoomsChange}
                  min={1}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-l-none"
                  onClick={incrementRooms}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
          <Button
            className="w-full"
            onClick={() => {
              updateValues(adults, children, rooms)
            }}
          >
            Zastosuj
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
