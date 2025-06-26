"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps {
  className?: string
  value?: DateRange
  onChange?: (dates: DateRange | undefined) => void
}

export function DatePickerWithRange({
  className,
  value,
  onChange,
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(
    value || {
      from: new Date(),
      to: new Date(new Date().setDate(new Date().getDate() + 7)),
    }
  )

  // Update local state when value prop changes
  React.useEffect(() => {
    if (value) {
      setDate(value)
    }
  }, [value])

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate)
    if (onChange) {
      onChange(newDate)
    }
  }

  const displayDate = value || date

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !displayDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            {displayDate?.from ? (
              displayDate.to ? (
                <>
                  {format(displayDate.from, "d MMM, yyyy")} -{" "}
                  {format(displayDate.to, "d MMM, yyyy")}
                </>
              ) : (
                format(displayDate.from, "d MMM, yyyy")
              )
            ) : (
              <span>Choose date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={displayDate?.from}
            selected={displayDate}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
