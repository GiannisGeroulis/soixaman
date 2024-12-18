"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePickerDemo({pick}) {
  const [date, setDate] = React.useState(null)
  
  return (
    
    <Popover  modal={true} >
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-1/2 justify-start text-left  content-start font-normal mr-0",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span >Διάλεξε μια ημερομηνία</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-[10000000] " align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {setDate(selectedDate);pick(selectedDate)}      }
          initialFocus
           
        />
      </PopoverContent>
    </Popover>
    
  )
  
}
