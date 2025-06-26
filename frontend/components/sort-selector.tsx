"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const sortOptions = [
  { value: "price_asc", label: "Cena (od najniższej)" },
  { value: "price_desc", label: "Cena (od najwyższej)" },
  { value: "rating_desc", label: "Ocena (od najwyższej)" },
  { value: "rating_asc", label: "Ocena (od najniższej)" },
  { value: "name_asc", label: "Nazwa (A-Z)" },
  { value: "name_desc", label: "Nazwa (Z-A)" },
]

interface SortSelectorProps {
  onChange: (value: string) => void
  value: string
}

export function SortSelector({
  onChange,
  value = "rating_desc",
}: SortSelectorProps) {
  const [open, setOpen] = React.useState(false)

  const selectedOption = sortOptions.find((option) => option.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-52"
        >
          {selectedOption ? selectedOption.label : "Sortuj według"}
          <ChevronDownIcon className="w-4 h-4 ml-2 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {sortOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                >
                  {option.label}
                  {option.value === value && (
                    <CheckIcon className="w-4 h-4 ml-auto" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
