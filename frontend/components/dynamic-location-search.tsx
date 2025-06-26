"use client"

import * as React from "react"
import { MapPinIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DynamicLocationSearchProps {
  locations: { value: string, label: string }[];
  onChange?: (location: string) => void;
}

export function DynamicLocationSearch({ locations, onChange }: DynamicLocationSearchProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [selectedLocation, setSelectedLocation] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-start">
          <MapPinIcon className="w-4 h-4 mr-2" />
          {selectedLocation ? selectedLocation : "Dokąd się wybierasz?"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Szukaj lokalizacji..." />
          <CommandList>
            <CommandEmpty>Nie znaleziono lokalizacji.</CommandEmpty>
            <CommandGroup>
              {locations.map((location) => (
                <CommandItem
                  key={location.value}
                  value={location.value}
                  onSelect={(currentValue) => {
                    setSelectedLocation(location.label)
                    setValue(currentValue)
                    setOpen(false)
                    if (onChange) {
                      onChange(location.label)
                    }
                  }}
                >
                  {location.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
