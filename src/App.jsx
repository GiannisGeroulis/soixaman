import './App.css'
import { Button } from './components/ui/button'
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'
import { DatePickerDemo } from './Calendar'
import { SelectScrollable } from './Select_Gender'
import { setDate } from 'date-fns'
import { TriangleAlert } from "lucide-react"
import { Dropdown_balance } from './Dropdown_balance'


const supabase = createClient('https://jijpfubuctsndjifoijm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppanBmdWJ1Y3RzbmRqaWZvaWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyOTY3NzAsImV4cCI6MjA0OTg3Mjc3MH0.-ULAU7RraewQKid5LDYXMtGoo5FK8J6_YLIE9PcsqGA')







function App() {
  const [matches,set_Matches]=useState(null)
  const [toggle_Register,set_Toggle_Register]=useState(false)
  const [toggle_Login,set_Toggle_Login]=useState(true)
  const [error,set_Error]=useState(null)
  const [login_Data,set_Login_Data]=useState(null)
  const [user,set_User]=useState(null)
  const [greeting,set_Greeting]=useState(false)
  const [balance,set_Balance]=useState(null)
  function handle_Register() {set_Toggle_Register(!toggle_Register)}
  function handle_Login() {set_Toggle_Login(!toggle_Login)}
  const [date,set_Date]=useState(null)
  const [gender,set_Gender]=useState("")
  const [formData,setFormData] = useState({
    email:"",name:"",surname:"",password:""
   })
   {/*console.log(formData)
   console.log("date : ",date)
   console.log("gender : ",gender)
   console.log("Login data : ",login_Data)
   console.log("Error : " , error)
   console.log("User : ",user)
   console.log("Balance : ",balance)*/}
   function handleChange(event)
   {
     setFormData((prevFormData)=>{
       return{
         ...prevFormData,[event.target.name]:event.target.value
       }
       
     })
   }
   async function register_User ()
   {
    const { data, error } = await supabase.auth.signUp(
      {
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            surname: formData.surname,
            gender: formData.gender,
            dateob: date
          }
        }
      }
    )
    insert_User_Table(data.user.id)
   }
   async function insert_User_Table(r_id)
   {
     const { error } = await supabase
     .from('users')
     .insert({ id: r_id } )
     

   }
   async function fetch_Balance (user)
   {
    const { data, error } = await supabase
      .from('users')
      .select('balance')
      .eq('id',user.id)
    set_Balance(data[0].balance)
   }
   async function login_User ()
   {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password
    })
    if(data.user!==null)
    {
    set_Login_Data(data)
    set_Toggle_Login(false)
    set_Error(false)
    set_User(data.user)
    set_Greeting(true)
    fetch_Balance(data.user)
    }
    else if(error)
    {
      set_Error(error)
    }
   }
   const handle_Enter = (e) =>
   {
    if(e.key === "Enter")
    {
      login_User()
    }
   }
   async function fetch_Games() {
    const { data, error } = await supabase
    .from('matches')
    .select()
    set_Matches(data)
    
   }
   useEffect(() => {
    fetch_Games();
   }, [])
   
  

  return (
    <div>
      {/*Register Page */
      
      toggle_Register &&
      <div className="fixed top-0 left-0 w-full h-full z-[10000] bg-black bg-opacity-60">
      <div className="fixed w-[55%] h-[80%] z-[10000]  top-12 left-[22%] bg-slate-100  flex">
      <div className="w-1/2 h-full bg-[#0066cc]">sdaf</div>
      <div className="w-1/2">
        <div className="w-full h-12 bg-white flex ">
          <div className="bg-white w-[95%]">tha mpei text edw</div>
        <Button onClick={handle_Register} className="hover:border-none border-none bg-transparent text-black hover:bg-transparent focus:outline-none focus:ring-0 w-[5%] justify-end"  >X</Button>
        </div>
        <div className="mt-3  ">
        <div className=" w-1/2 mx-auto text-left font-bold text-sm">Email</div>
        <Input name="email" onChange={handleChange} className=" focus-visible:ring-0 outline-none w-1/2 mx-auto mt-1 rounded-lg" placeholder="π.χ. someone@gmail.com"></Input>
        </div>
        <div className="mt-3  ">
        <div className=" w-1/2 mx-auto text-left font-bold text-sm">Κωδικός</div>
        <Input name="password" onChange={handleChange} type="password" className=" focus-visible:ring-0 outline-none w-1/2 mx-auto mt-1 rounded-lg" placeholder="π.χ. mitsoeisaigay123"></Input>
        </div>
        <div className="mt-2">
        <div className=" w-1/2 mx-auto text-left font-bold text-sm">Όνομα</div>
        <Input name="name" onChange={handleChange} className=" focus-visible:ring-0 outline-none w-1/2 mx-auto mt-1 rounded-lg" placeholder="π.χ. Δημήτρης"></Input>
        </div>
        <div className="mt-2">
        <div className=" w-1/2 mx-auto text-left font-bold text-sm">Επώνυμο</div>
        <Input name="surname" onChange={handleChange} className=" focus-visible:ring-0 outline-none w-1/2 mx-auto mt-1 rounded-lg" placeholder="π.χ. Τσεσμελής"></Input>
        </div>
        <div className="mt-2">
        <div className=" w-1/2 mx-auto text-left font-bold text-sm">Ημερομηνία Γέννησης</div>
        <DatePickerDemo pick={set_Date} ></DatePickerDemo>
        </div>
        <div className="mt-2">
        <div className=" w-1/2 mx-auto text-left font-bold text-sm">Φύλο</div>
        <SelectScrollable name="gender" pick={set_Gender}></SelectScrollable>
        </div>
        <div><Button onClick={register_User} className="bg-[#e70161] w-1/2 h-9 mt-2 mx-auto  focus:outline-none  rounded-lg   hover:bg-[#e70161]  text-sm text-white">Εγγραφή</Button></div>
        
      </div>
      </div>
      
      </div>}
      {/*Login page*/
      toggle_Login &&
      <div className="fixed top-0 left-0 w-full h-full z-[10000] bg-black bg-opacity-60">
      <div className="fixed w-[55%] h-[80%] z-[10000]  top-12 left-[22%] bg-slate-100  flex">
      <div className="w-1/2 h-full bg-[#0066cc]">sdaf</div>
      <div className="w-1/2">
        <div className="w-full h-12 bg-white flex ">
          <div className="bg-white w-[95%]">tha mpei text edw</div>
        <Button onClick={handle_Login} className="hover:border-none border-none bg-transparent text-black hover:bg-transparent focus:outline-none focus:ring-0 w-[5%] justify-end"  >X</Button>
        </div>
        <div className="mt-2">
        <div className=" w-1/2 mx-auto text-left font-bold text-sm">Email</div>
        <Input name="email" onChange={handleChange} className=" focus-visible:ring-0 outline-none w-1/2 mx-auto mt-1 rounded-lg" placeholder="π.χ. traveli@gmail.com"></Input>
        </div>
        <div className="mt-3  ">
        <div className=" w-1/2 mx-auto text-left font-bold text-sm">Κωδικός</div>
        <Input onKeyDown={handle_Enter} name="password" onChange={handleChange} type="password" className=" focus-visible:ring-0 outline-none w-1/2 mx-auto mt-1 rounded-lg" placeholder="π.χ. mitsoeisaigay123"></Input>
        </div>
        <div><Button onClick={login_User} className="bg-[#e70161] w-1/2 h-9 mt-2 mx-auto  focus:outline-none  rounded-lg   hover:bg-[#e70161]  text-sm text-white">Είσοδος</Button></div>
        {error && (
          <div className="mt-5  font-bold underline flex mx-[30%] ">Λάθος email ή κωδικός<TriangleAlert className="text-red-600 ml-2"></TriangleAlert></div>
          
        )}
      
        
      </div>
      </div>
      </div>
      }
      {/*Header banner*/}
      <div className="bg-[#0066cc] w-1/2 h-16 fixed left-0 top-0 flex flex-row justify-start ">
        <div className="font-semibold text-white w-1/12 h-1/12 pt-3 text-3xl italic  ml-6 " > Sixaman </div>
        <div className="font-bold text-white w-1/12 h-1/12 pt-6 text-sm ml-20 ">ΣΟΙΧΑΜΑ</div>
        
        
      </div>
      
      <div className="bg-[#0066cc] w-1/2 h-16 fixed left-1/2 top-0 flex flex-row justify-end ">
      {greeting && (<div className=" mt-4 font-semibold text-lg mr-12 flex">
        <div className="mr-3">Γεια σου {user.user_metadata.name}</div> 
        <Dropdown_balance arrow="true" text={balance} id={user.id} set={set_Balance}></Dropdown_balance>
        
        </div>
      
      
      )}
      {!user && (<div ><Button onClick={handle_Register} className="w-16 h-9 mt-3 mr-4   focus:outline-none rounded-xl  hover:border-white hover:bg-transparent bg-transparent border-white border-2 font-bold text-xs text-white">
        ΕΓΓΡΑΦΗ
        
        </Button></div>)}
      
      {
        !user && (
      <div><Button onClick={handle_Login} className="bg-[#e70161] w-16 h-9 mt-3 mr-10   focus:outline-none  rounded-xl   hover:bg-[#e70161]   font-bold text-xs text-white">ΕΙΣΟΔΟΣ</Button></div>)
      }
        
        
        
      </div>
      {/*Body*/}
      
      <div className="bg-gray-200 fixed h-full w-full left-0 top-16">
      
       
        {/*Matches body */}
        <div className="bg-white w-[95%] h-[80%] rounded-lg mx-auto mt-2">
        
          <div className=" w-full h-10 border-b pt-2">ΑΓΩΝΕΣ</div>
          { matches && (
            matches.map(match => (
              
          <div className=" w-full h-13 flex p-4 border-b ">
            <div className=" h-full w-[15%] flex-col " >
              <div>
                {match.date}
              </div>
              <div>
                {match.time}
              </div>
            </div>
            <div className=" h-full w-[25%] flex-col " >
              <div>
                {match.h_Team}
              </div>
              <div>
                {match.a_Team}
              </div>
            </div>
            <div className="text-sm h-full w-[20%] flex-col " >
            <div className=" h-5 flex  justify-around text-xs border-r font-bold">
                <div className=" ">1</div>
                <div>X</div>
                <div>2</div>
              </div>
              
              
              <div className=" h-7 flex justify-around  border-r">
                
                <Button className="h-7 bg-gray-100 outline-none hover:outline-none hover:border-gray-200 border-gray-200 hover:bg-gray-200  ring-0 focus:ring-0 focus:border-none focus:outline-none text-[#0066cc] font-semibold">{match.asos_Odd}</Button>
                <Button className="h-7 bg-gray-100 outline-none hover:outline-none hover:border-gray-200 border-gray-200 hover:bg-gray-200  ring-0 focus:ring-0 focus:border-none focus:outline-none text-[#0066cc] font-semibold">{match.x_Odd}</Button>
                <Button className="h-7 bg-gray-100 outline-none hover:outline-none hover:border-gray-200 border-gray-200 hover:bg-gray-200  ring-0 focus:ring-0 focus:border-none focus:outline-none text-[#0066cc] font-semibold">{match.diplo_Odd}</Button>
              </div>
              
              
              
            </div>
            <div className="text-sm h-full w-[20%] flex-col border-r font-bold" >
            <div className=" h-5 flex  justify-around text-xs ">
                <div className=" ">OVER2.5</div>
                <div>UNDER2.5</div>
                
              </div>
              
              
              <div className=" h-7 flex  justify-around">
                <Button className="h-7 bg-gray-100 outline-none hover:outline-none hover:border-gray-200 border-gray-200 hover:bg-gray-200  ring-0 focus:ring-0 focus:border-none focus:outline-none text-[#0066cc] font-semibold">{match.over25_Odd}</Button>
                <Button className="h-7 bg-gray-100 outline-none hover:outline-none hover:border-gray-200 border-gray-200 hover:bg-gray-200  ring-0 focus:ring-0 focus:border-none focus:outline-none text-[#0066cc] font-semibold">{match.under25_Odd}</Button>
                
              </div>
              
              
              
            </div>
            <div className="text-sm h-full w-[20%] flex-col font-bold" >
            <div className=" h-5 flex  justify-around text-xs">
                <div className=" ">GG</div>
                <div>NG</div>
                
              </div>
              
              
              <div className=" h-7 flex  justify-around">
                <Button className="h-7 bg-gray-100 outline-none hover:outline-none hover:border-gray-200 border-gray-200 hover:bg-gray-200  ring-0 focus:ring-0 focus:border-none focus:outline-none text-[#0066cc] font-semibold">{match.gg_Odd}</Button>
                <Button className="h-7 bg-gray-100 outline-none hover:outline-none hover:border-gray-200 border-gray-200 hover:bg-gray-200  ring-0 focus:ring-0 focus:border-none focus:outline-none text-[#0066cc] font-semibold">{match.ng_Odd}</Button>
                
              </div>
              
              
            </div>
      
          
          </div>
          )))}
      
        </div>
        
      </div>
    </div>
  )
}

export default App

