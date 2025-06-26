"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { addMonths, subMonths } from "date-fns"
import { pl } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [month, setMonth] = React.useState<Date>(props.month || new Date())
  const [nextMonth, setNextMonth] = React.useState<Date>(
    props.month ? addMonths(props.month, 1) : addMonths(new Date(), 1)
  )

  const handlePrevious = () => {
    setMonth((prev) => subMonths(prev, 1))
    setNextMonth((prev) => subMonths(prev, 1))
  }

  const handleNext = () => {
    setMonth((prev) => addMonths(prev, 1))
    setNextMonth((prev) => addMonths(prev, 1))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center p-4">
        <button
          onClick={handlePrevious}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium text-center">
          {month.toLocaleString("default", { month: "long", year: "numeric" })}
          {" - "}
          {nextMonth.toLocaleString("default", { month: "long", year: "numeric" })}
        </span>
        <button
          onClick={handleNext}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <DayPicker
        month={month}
        locale={pl}
        onMonthChange={setMonth}
        showOutsideDays={showOutsideDays}
        numberOfMonths={2}
        className={cn("p-3", className)}
        mode="multiple"
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          table: "w-full border-collapse space-y-1",
          head_row: "hidden invisible h-0 overflow-hidden",
          head_cell: "hidden invisible h-0 overflow-hidden",
          row: "flex w-full mt-2",
          cell: cn(
            "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
            props.mode === "range"
              ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
              : "[&:has([aria-selected])]:rounded-md"
          ),
          nav: "hidden",
          day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
          day_range_start: "day-range-start",
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside:
            "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        {...props}
      />

    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
