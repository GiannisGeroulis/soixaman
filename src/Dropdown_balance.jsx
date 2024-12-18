import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu"
import { ChevronDown } from "lucide-react"
import { Input } from "./components/ui/input"
import { useState } from "react"
import { createClient } from '@supabase/supabase-js'


const supabase = createClient('https://jijpfubuctsndjifoijm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppanBmdWJ1Y3RzbmRqaWZvaWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyOTY3NzAsImV4cCI6MjA0OTg3Mjc3MH0.-ULAU7RraewQKid5LDYXMtGoo5FK8J6_YLIE9PcsqGA')


export function Dropdown_balance(text) {
    

    
    const [sum,set_Sum]=useState(text.text)
    const [formData,setFormData] = useState({
        input:"0"
       })
    
    
    async function update_Balance ()
   {
    
    
    const {data , error } = await supabase
    .from('users')
    .update({ balance: (+text.text + +formData.input).toFixed(2)})
    .eq('id', text.id )
    .select()
    text.set(data[0].balance)
    
   }
    
    function handle_Change(event)
   {
     setFormData((prevFormData)=>{
       return{
         ...prevFormData,[event.target.name]:event.target.value
       }
       
     })
   }
   
   function handle_Click()
   {
    set_Sum(parseFloat(text.text) + parseFloat(formData.input));
    
    update_Balance()
    
    
   }
   

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-transparent hover:border-none w-18 h-7  ring-0 focus:outline-none font-semibold text-lg" variant="link">{text.text}<ChevronDown></ChevronDown></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" arrow="true">
        
        <div className=" w-50">
            <div className="ml-8 font-semibold mb-2">Προσθήκη Χρημάτων</div>
            <DropdownMenuSeparator className="mb-2"></DropdownMenuSeparator>
            <div className="flex">
            <Input autoComplete="off" type="number" name="input" onChange={handle_Change} className="w-[60%] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus-visible:ring-0 focus:outline-none  focus:ring-0 " placeholder="π.χ. 5€"></Input>
            <Button onClick={handle_Click} className="w-[40%] ml-2 bg-[#e70161] hover:bg-[#e70161] border-none ring-0 outline-none focus:outline-none">Προσθήκη</Button>
            </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
