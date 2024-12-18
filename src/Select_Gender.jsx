import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectScrollable({pick}) {
  return (
    <Select onValueChange={pick}>
      <SelectTrigger className="w-1/2 mx-auto focus:ring-0">
        <SelectValue placeholder="-"  />
      </SelectTrigger>
      <SelectContent className="z-[1000000]">
        <SelectGroup>
          
          <SelectItem value="male">Άνδρας</SelectItem>
          <SelectItem value="female">Γυναίκα</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
