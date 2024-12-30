import './App.css'
import { Button } from './components/ui/button'
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'
import { DatePickerDemo } from './Calendar'
import { SelectScrollable } from './Select_Gender'
import { setDate, setSeconds } from 'date-fns'
import { TriangleAlert } from "lucide-react"
import { Dropdown_balance } from './Dropdown_balance'
import dayjs from 'dayjs';
import { AlertCircle } from "lucide-react"
import {Alert,AlertDescription,AlertTitle} from "@/components/ui/alert"


const supabase = createClient('https://jijpfubuctsndjifoijm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppanBmdWJ1Y3RzbmRqaWZvaWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyOTY3NzAsImV4cCI6MjA0OTg3Mjc3MH0.-ULAU7RraewQKid5LDYXMtGoo5FK8J6_YLIE9PcsqGA')







function App() {
  const [bet_List_Istoriko,set_Bet_List_Istoriko]=useState([])
  const [banner_Istoriko,set_Banner_Istoriko]=useState(false)
  const [banner_Soixima,set_Banner_Soixima]=useState(true)
  const [bet_Odd,set_Bet_Odd]=useState(1)
  const [bet_List,set_Bet_List]=useState([])
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
  const [istoriko,set_Istoriko]=useState([])
  const [isSlidingOut, setIsSlidingOut] = useState(false);
  const [formData,setFormData] = useState({
    email:"",name:"",surname:"",password:"",input_Bet:1
   })
   useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setIsSlidingOut(true); // Ενεργοποιεί το slide-out animation
        setTimeout(() => {
          set_Error(null); // Κρύβει το Alert εντελώς
          setIsSlidingOut(false); // Επαναφέρει την κατάσταση slide-out
        }, 500); // Διάρκεια του slide-out (500ms)
      }, 3000); // Χρονική διάρκεια παραμονής (3 δευτερόλεπτα)

      return () => clearTimeout(timeout); // Καθαρισμός timeout αν αλλάξει το component
    }
  }, [error, set_Error]);
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
          },
          

        }
      }
      
    )
    console.log(data)
    if(!error)
    {
      set_Toggle_Register(false)
      set_Toggle_Login(true)
    }
    
    insert_User_Table(data.user.id)
   }
   async function insert_User_Table(r_id)
   {
     const { error } = await supabase
     .from('users')
     .insert({ id: r_id } )
     

   }
   async function fetch_Balance(user) {
    if (!user || !user.id) {
      console.error("Ο χρήστης δεν είναι έγκυρος:", user);
      return;
    }
  
    const { data, error } = await supabase
      .from("users")
      .select("balance")
      .eq("id", user.id)
      .single(); // Επιστρέφουμε μόνο μία εγγραφή
  
    if (error) {
      console.error("fetch_Balance error:", error);
      return;
    }
  
    if (data) {
      set_Balance(data.balance); // Ενημέρωση του balance
    } else {
      console.warn("Δεν βρέθηκε balance για τον χρήστη:", user.id);
    }
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
    
    set_User(data.user)
    set_Greeting(true)
    fetch_Balance(data.user)
    fetch_Istoriko(data.user)
    }
    else if(error)
    {
      set_Error("Λάθος email ή κωδικός")
    }
   }
   async function fetch_Istoriko(user) {
    const {data} = await supabase
    .from('users')
    .select('balance')
    .eq('id',user.id)
    const balance = (data[0].balance)
    // 1α) Μηδενίζουμε προσωρινά ή όχι (ανάλογα τι θέλεις)
    set_Bet_List_Istoriko([]);
  
    // 1β) Παίρνουμε όλα τα bets για τον χρήστη
    const { data: betsData, error } = await supabase
      .from('bets')
      .select()
      .eq('player_Id', user.id);
  
    if (error) {
      console.error("fetch_Istoriko error:", error);
      return;
    }
  
    // 1γ) “Χτίζουμε” ένα νέο array με το σχήμα που θες (betId, items[])
    const newBetListIstoriko = [];
    let balance_Add =0;
    for (const bet of betsData) {
      
      let bet_Status = false;
      const betItems = [];
      let counter=0
      let counter_match=0
      // Κάνουμε for στα choice_1..choice_8
      for (let i = 1; i <= 8; i++) {
        const choiceKey = `choice_${i}`;
        if (bet[choiceKey]) {
          // π.χ. "asos 12 1.35"
          const [name, matchIdStr, valueOddStr] = bet[choiceKey].split(" ");
          const matchId = parseFloat(matchIdStr);
          const match = matches?.find(m => m.id === matchId);
  
          // Λογική για title, perigrafi
          const match_Bool= match.match_End
          
          let title;
          let perigrafi;
          let status_text;
          const odd_Result = `${name}_Result`
          const odd_Bool = (match[odd_Result])
          if(odd_Bool===true)
          {counter++}
          if(match_Bool===true)
          {counter_match++}
          switch (name) {
            case "asos":
              title = match.h_Team;
              perigrafi = "Αποτέλεσμα κανονική διάρκεια";
              break;
            case "x":
              title = "Ισοπαλία";
              perigrafi = "Αποτέλεσμα κανονική διάρκεια";
              break;
            case "diplo":
              title = match.a_Team;
              perigrafi = "Αποτέλεσμα κανονική διάρκεια";
              break;
            case "over25":
              title = "Over 2.5";
              perigrafi = "Goal Over/Under";
              break;
            case "under25":
              title = "Under 2.5";
              perigrafi = "Goal Over/Under";
              break;
            case "gg":
              title = "Ναι(GG)";
              perigrafi = "Να σκοράρουν και οι δυο ομάδες";
              break;
            case "ng":
              title = "Οχι(NG)";
              perigrafi = "Να σκοράρουν και οι δυο ομάδες";
              break;
            default:
              // Αν καμιά από τις πιο πάνω τιμές δεν ταιριάζει,
              // μπορείς να βάλεις ένα default κείμενο ή απλώς το name όπως είναι.
              title = name;
              perigrafi = "";
              break;
          }

// Συνέχισε τη λογική σου χρησιμοποιώντας τα title, perigrafi

  
          betItems.push({
            home_Team: match.h_Team,
            away_Team: match.a_Team,
            value: name,
            value_Odd: parseFloat(valueOddStr).toFixed(2),
            descr: perigrafi,
            title: title,
            odd_Bool: odd_Bool,
            match_Bool: match_Bool
            
            
            
          });
        }
      }
      
      let status_Text;
      
      if((counter === betItems.length) && (counter_match === betItems.length) && (bet.bet_Receive === false))
      {
        
        //set_Balance(balance + (bet.bet_Amount * bet.bet_Odd))
        //update_Balance(balance + (bet.bet_Amount * bet.bet_Odd))
        bet_Status=true
        status_Text="ΚΕΡΔΙΣΜΕΝΟ"
        balance_Add += (bet.bet_Amount * bet.bet_Odd)
        
        
      }else if((counter === betItems.length) && (counter_match === betItems.length))
      {
        bet_Status=true
        status_Text="ΚΕΡΔΙΣΜΕΝΟ"
      }
      else if((counter !== betItems.length) && (counter_match === betItems.length))
      {
        status_Text="ΧΑΜΕΝΟ"
        bet_Status=false
      }else if(counter_match !== betItems.length)
      {
        status_Text="ΑΝΟΙΧΤΟ"
        bet_Status=null
      }
      
      
      // Στο τέλος προσθέτουμε κανονικά το στοιχείο στο array
      newBetListIstoriko.push({
        created_At: bet.created_at,
        status_Text: status_Text,
        counter: counter,
        bet_Odd: bet.bet_Odd,
        bet_Amount: bet.bet_Amount,
        bet_Status : bet_Status,
        betId: bet.id,
        bet_Receive: bet.bet_Receive,
        items: betItems
      });

      {
      
      if(bet.bet_Receive === false && bet_Status === true)
      {
        
        set_Balance( balance +balance_Add)
        update_Balance(balance +balance_Add)
        update_Receive(bet.id)
        
        
      }
      
      update_Status(bet_Status,bet.id)}
      
    }
    //console.log(newBetListIstoriko)
    console.log(newBetListIstoriko)
    // 1δ) Ενημερώνουμε ΤΟ state (χωρίς push/splice)
    set_Bet_List_Istoriko(newBetListIstoriko);
    
    
    
    //update_Status(newBetListIstoriko.betId)
    
    
  }
  async function update_Receive(id)
  {
    const {error} = await supabase
    .from('bets')
    .update({bet_Receive : true})
    .eq('id',id)
  }
  
  async function update_Status(status,id)
  {
    const {error} = await supabase
    .from('bets')
    .update({bet_Status : status})
    .eq('id',id)
  }
  async function update_Balance (new_Balance)
  {
    const { data: { user } } = await supabase.auth.getUser()

    
   const {data , error } = await supabase
   .from('users')
   .update({ balance: new_Balance })
   .eq('id', user.id )
   
   
   
   
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
   
  function handle_Odd_Button (e) 
  {
    let title=null;
    let game = null;
    let perigrafi = null;
    const name = e.target.name;
    const odd = parseFloat(e.target.innerText);
    const id = e.target.id;
    matches.map(match => {
      if(match.id === parseFloat(id))
      {
        game = match
      }
    }
    )
    if(name === "asos"){title=game.h_Team;perigrafi="Αποτέλεσμα κανονική διάρκεια"}else if (name === "x"){title="Ισοπαλία";perigrafi="Αποτέλεσμα κανονική διάρκεια"}else if (name === "diplo") {title=game.a_Team;perigrafi="Αποτέλεσμα κανονική διάρκεια"}
    else if(name==="over25"){title="Over 2.5";perigrafi="Goal Over/Under"}else if(name==="under25"){title="Under 2.5";perigrafi="Goal Over/Under"}else if(name==="gg"){title="Ναι(GG)";perigrafi="Να σκοράρουν και οι δυο ομάδες"}else if(name==="ng"){title="Οχι(NG)";perigrafi="Να σκοράρουν και οι δυο ομάδες"}
  
    


    if (bet_List.some((item) => (item.name === name) && (item.id === id))) {
      set_Bet_Odd((bet_Odd/odd).toFixed(2))
      // Αν το στοιχείο υπάρχει ήδη, το αφαιρούμε
      e.target.style.backgroundColor = "#f3f4f6"
      e.target.style.color="#0066cc"
      const updated_List = bet_List.filter((item) => !(item.name === name && item.id === id));
      set_Bet_List(updated_List); // Ενημέρωση state με νέο array
    } else {
     set_Bet_Odd((bet_Odd*odd).toFixed(2))
     e.target.style.backgroundColor = "#0066cc"
     e.target.style.color = "white"
      // Αν δεν υπάρχει, το προσθέτουμε
      const full_Odd = {
        home_Team: game.h_Team,
        away_Team: game.a_Team,
        odd: odd,
        name: name,
        id: id,
        title: title,
        perigrafi: perigrafi,
        


      };
      set_Bet_List([...bet_List, full_Odd]); // Προσθήκη νέου στοιχείου στο state
    }
  }    
  async function handle_Bet() {
    if (bet_List.length === 0) return;
    const choicesObj = bet_List.reduce((acc, bet, index) => {
      acc[`choice_${index + 1}`] = bet.name + " " + bet.id + " " + bet.odd;
      return acc;
    }, {});
  
    if(balance -parseFloat(formData.input_Bet).toFixed(2) < 0)
    {
      set_Error("Δεν επαρκει το υπόλοιπο")
      return
    }
    const { data, error } = await supabase
      .from('bets')
      .insert([
        {
          bet_Odd: bet_Odd,
          player_Id: user.id,
          bet_Amount: parseFloat(formData.input_Bet).toFixed(2),
          ...choicesObj
        }
      ]);
      
    if (!error) {
      
      
        
        
      
      
      update_Balance(balance -parseFloat(formData.input_Bet).toFixed(2))
      set_Balance(balance -parseFloat(formData.input_Bet).toFixed(2))
      // Αφού το insert πέτυχε, ανανέωσε το ιστορικό
      fetch_Istoriko(user);
      // Αν θέλεις, μπορείς και να “καθαρίσεις” τα τρέχοντα στοιχήματα
      set_Bet_List([]);
      set_Bet_Odd(1)
      
    } else {
      console.error("handle_Bet insert error:", error);
    }
  }
  function fetch_Istoriko_Bet(bet_Id)
  {
  const bet_Items = [];
    
  // 1) Αν τα choice_1..choice_8 είναι μέσα σε bet_Id σαν object properties,
  //    τότε μπορούμε να τα διατρέξουμε με έναν κλασικό for:

  for (let i = 1; i <= 8; i++) {
    let game =null
    let perigrafi =null
    let title=null
    const choiceKey = `choice_${i}`;
    if(bet_Id[choiceKey] !== null)
    {
      const [name,match_Id,value_Odd] = bet_Id[choiceKey].split(" ");
      matches.map(match =>
        {
          if(match.id === parseFloat(match_Id)){game=match}
        }
        )
      if(name === "asos"){title=game.h_Team;perigrafi="Αποτέλεσμα κανονική διάρκεια"}else if (name === "x"){title="Ισοπαλία";perigrafi="Αποτέλεσμα κανονική διάρκεια"}else if (name === "diplo") {title=game.a_Team;perigrafi="Αποτέλεσμα κανονική διάρκεια"}
      else if(name==="over25"){title="Over 2.5";perigrafi="Goal Over/Under"}else if(name==="under25"){title="Under 2.5";perigrafi="Goal Over/Under"}else if(name==="gg"){title="Ναι(GG)";perigrafi="Να σκοράρουν και οι δυο ομάδες"}else if(name==="ng"){title="Οχι(NG)";perigrafi="Να σκοράρουν και οι δυο ομάδες"}
        
      const full_Info =
      {
        home_Team: game.h_Team,
        away_Team: game.a_Team,
        bet_Odd: bet_Id.bet_Odd,
        value: name,
        value_Odd: value_Odd ,
        descr: perigrafi,
        title: title,
        bet_Id: bet_Id.id,
        bet_Amount: bet_Id.bet_Amount,
        created_At: bet_Id.created_at,
        
        
      }
      
      bet_Items.push(full_Info)
    
    }
    
   
  }
  let index = bet_List_Istoriko.findIndex(item => item.betId === bet_Id.id);

  if (index !== -1) {
    // 2α) Αν υπάρχει, προσθέτουμε τα νέα full_Info
    bet_List_Istoriko[index].items.push(...betItems);
  } else {
    // 2β) Αν δεν υπάρχει, το σπρώχνουμε στο ΤΕΛΟΣ του πίνακα
    bet_List_Istoriko.push({
      betId: bet_Id.id,
      items: bet_Items
    });
  }

  }
  function handle_Banner_Soixima()
  {
    set_Banner_Soixima(true)
    set_Banner_Istoriko(false)
  }
  function handle_Banner_Istoriko()
  {
    
    set_Banner_Soixima(false)
    set_Banner_Istoriko(true)
    
  }
  
  
  return (
    
    <div>
      {/*Register Page */
      
      toggle_Register &&  
      <div className="fixed top-0 left-0 w-full h-full  bg-black bg-opacity-60">
      <div className="fixed w-[55%] h-[80%] z-[10000]  top-12 left-[22%] bg-slate-100  flex">
      <div className="w-1/2 h-full bg-[#0066cc]">sdaf</div>
      <div className="w-1/2">
        <div className="w-full h-12 bg-white flex ">
          <div className="bg-white w-[95%]">tha mpei text edw</div>
        <Button onClick={handle_Register} className="hover:border-none border-none bg-transparent text-black hover:bg-transparent focus:outline-none focus:ring-0 w-[5%] justify-end"  >X</Button>
        </div>
        <div className="mt-3  ">
        <div className=" w-1/2 mx-auto text-left font-bold text-sm">Email</div>
        <Input name="email" onChange={handleChange} className="  focus-visible:ring-0 outline-none w-1/2 mx-auto mt-1 rounded-lg" placeholder="π.χ. someone@gmail.com"></Input>
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
      <div className="bg-[#0066cc] w-1/2 h-16 fixed left-0 top-0 flex  justify-start ">
        <Button onClick={handle_Banner_Soixima} className="font-semibold text-white w-fit bg-transparent hover:bg-transparent hover:ring-0 hover:outline-none hover:border-none focus:ring-0 focus:border-0 focus:outline-none h-fit mt-1 text-3xl italic  ml-6 " > Sixaman </Button>
        <Button onClick={handle_Banner_Soixima} className="font-bold bg-transparent hover:bg-transparent hover:ring-0 hover:outline-none hover:border-none focus:ring-0 focus:border-0 focus:outline-none text-white w-fit mt-6 h-4  text-sm  ">ΣΟΙΧΗΜΑ</Button>
        <Button onClick={handle_Banner_Istoriko} className="font-bold bg-transparent hover:bg-transparent hover:ring-0 hover:outline-none hover:border-none focus:ring-0 focus:border-0 focus:outline-none text-white w-fit mt-6 h-4  text-sm  ">ΤΑ ΣΟΙΧΗΜΑΤΑ ΜΟΥ</Button>
        
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
      
      <div className="bg-gray-200 fixed h-full w-full left-0 top-16 flex overflow-y-auto">
      
       
        {/*Matches body */}
        
        <div className="bg-white w-[79%]  h-fit  rounded-lg ml-4  mt-2">
          
          { matches && banner_Soixima && (
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
                
                <Button onClick={handle_Odd_Button} id={match.id} name="asos" className="h-7 bg-gray-100 outline-none hover:outline-none hover:border-gray-200 border-gray-200 hover:bg-gray-200  ring-0 focus:ring-0 focus:border-none focus:outline-none text-[#0066cc] font-semibold">{(match.asos_Odd).toFixed(2)}</Button>
                <Button onClick={handle_Odd_Button} id={match.id} name="x" className="h-7 bg-gray-100 outline-none hover:outline-none hover:border-gray-200 border-gray-200 hover:bg-gray-200  ring-0 focus:ring-0 focus:border-none focus:outline-none text-[#0066cc] font-semibold">{(match.x_Odd).toFixed(2)}</Button>
                <Button onClick={handle_Odd_Button} id={match.id} name="diplo" className="h-7 bg-gray-100 outline-none hover:outline-none hover:border-gray-200 border-gray-200 hover:bg-gray-200  ring-0 focus:ring-0 focus:border-none focus:outline-none text-[#0066cc] font-semibold">{(match.diplo_Odd).toFixed(2)}</Button>
              </div>
              
              
              
            </div>
            <div className="text-sm h-full w-[20%] flex-col border-r font-bold" >
            <div className=" h-5 flex  justify-around text-xs ">
                <div className=" ">OVER2.5</div>
                <div>UNDER2.5</div>
                
              </div>
              
              
              <div className=" h-7 flex  justify-around">
                <Button onClick={handle_Odd_Button} id={match.id} name="over25" className="h-7 bg-gray-100 outline-none hover:outline-none hover:border-gray-200 border-gray-200 hover:bg-gray-200  ring-0 focus:ring-0 focus:border-none focus:outline-none text-[#0066cc] font-semibold">{(match.over25_Odd).toFixed(2)}</Button>
                <Button onClick={handle_Odd_Button} id={match.id} name="under25" className="h-7 bg-gray-100 outline-none hover:outline-none hover:border-gray-200 border-gray-200 hover:bg-gray-200  ring-0 focus:ring-0 focus:border-none focus:outline-none text-[#0066cc] font-semibold">{(match.under25_Odd).toFixed(2)}</Button>
                
              </div>
              
              
              
            </div>
            <div className="text-sm h-full w-[20%] flex-col font-bold" >
            <div className=" h-5 flex  justify-around text-xs">
                <div className=" ">GG</div>
                <div>NG</div>
                
              </div>
              
              
              <div className=" h-7 flex  justify-around">
                <Button onClick={handle_Odd_Button} id={match.id} name="gg" className="h-7 bg-gray-100 outline-none hover:outline-none hover:border-gray-200 border-gray-200 hover:bg-gray-200  ring-0 focus:ring-0 focus:border-none focus:outline-none text-[#0066cc] font-semibold">{(match.gg_Odd).toFixed(2)}</Button>
                <Button onClick={handle_Odd_Button} id={match.id} name="ng" className="h-7 bg-gray-100 outline-none hover:outline-none hover:border-gray-200 border-gray-200 hover:bg-gray-200  ring-0 focus:ring-0 focus:border-none focus:outline-none text-[#0066cc] font-semibold">{(match.ng_Odd).toFixed(2)}</Button>
                
              </div>
              
              
            </div>
      
          
          </div>
          
          )))}
        {/*History Body}*/}
        {banner_Istoriko && (
          <div className=" w-full h-full rounded-lg flex flex-row flex-wrap overflow-y-auto  justify-start ">
              
              {bet_List_Istoriko.map(bet => (
                <div className="bg-gray-50 mb-20  w-[19%] h-fit  mr-2 rounded-t-3xl   border-gray-200 border    ">
                  <div className=" text-sm">Ημερομηνία Δελτίου: {dayjs(bet.created_At).format("DD/MM/YYYY HH:mm")}</div>
                  {console.log(bet)}
                  
                {
                  bet.items.map(game => (
                    
                        <div
                        className= "rounded-lg mb-2 border text-left mx-2 mt-2 ">
                      
                        <div className={`font-semibold w-full flex ${!game.match_Bool ? "text-yellow-400" : game.odd_Bool && game.match_Bool ? "text-green-600" : "text-red-600"}`}>
                          <div className="w-1/2 text-left pl-2 " >{game.title}</div>
                          <div className="w-1/2 text-right mr-2">{game.value_Odd}</div>
                        </div>
                        <div className="w-full text-left pl-2 text-sm text-gray-600">{game.descr}</div>
                        <div className="w-full text-left pl-2 text-sm">
                          {game.home_Team}-{game.away_Team}
                        </div>
                      </div>
                  ))
                }
                <div className="bg-white w-full rounded-t-3xl border-t">
                  <div className=" w-[90%] mx-auto border-b mt-2">
                    <div className="flex">
                    <div className="text-left text-sm text-gray-600 w-1/2  font-semibold">Στοιχήματα </div>
                    <div className="text-right text-sm text-gray-600 w-1/2 font-semibold">{(bet.items).length}</div>
                    </div>
                  </div>
                  <div className=" w-[90%] mx-auto  mt-2">
                    <div className="flex">
                      <div className="text-left text-sm text-gray-600 w-1/2  font-semibold">Πιθανά κέρδη </div>
                      <div className="text-right text-sm font-bold w-1/2 ">{((bet.bet_Odd)*(bet.bet_Amount)).toFixed(2)}</div>
                    </div>
                  </div>
                  <div className=" w-[90%] mx-auto  mt-2">
                    <div className="flex">
                      <div className="text-left text-sm text-gray-600 w-1/2  font-semibold">Ποσό στοιχήματος </div>
                      <div className="text-right text-sm font-bold w-1/2 ">{(bet.bet_Amount).toFixed(2)}</div>
                    </div>
                  </div>
                  <div className={`rounded-b-3xl border-t font-semibold text-sm ${bet.status_Text === "ΑΝΟΙΧΤΟ" ? "bg-yellow-400": bet.status_Text === "ΚΕΡΔΙΣΜΕΝΟ"? "bg-green-600": "bg-red-600"}`}>{bet.status_Text}</div>
                
                  
                </div>
                </div>
              ))}
              
              
              
            </div>
          
        )}
        





        
        </div>
        
        
       
        {/*Bet Body*/}
        <div className="bg-gray-50 w-[19%] h-fit  mr-auto rounded-t-3xl fixed bottom-0 right-0 border-gray-200 border  pb-3 ">
        {bet_List.map((choice, index) => (
          
          <div key={index} className="rounded-lg bg-white border-gray-200 border w-[95%] mx-auto h-20 pt-2  mt-2">
           {/* <div className="text-left  w-[95%] mx-auto font-semibold  h-1/2 pt-3 flex">{choice.title}<div className=' w-2/3 mx-auto text-right'>{(choice.odd).toFixed(2)}</div></div>*/}
            <div className="flex">
              <div className="w-1/2 text-left mx-auto pl-2 font-semibold">{choice.title}</div>
              <div className="w-1/2 text-right pr-4 font-semibold">{(choice.odd).toFixed(2)}</div>
            </div>
            <div className="text-left w-[95%] mx-auto  text-sm text-gray-600">{choice.perigrafi}</div>
            <div className="text-left w-[95%] mx-auto  text-sm">{choice.home_Team}-{choice.away_Team}</div>
            
            
            
          </div>
        ))}
        <div className="flex justify-end w-[95%]  mx-auto mt-2">
          <div className="w-[15%] h-fit my-1">{bet_Odd}</div>
          
          <Input name="input_Bet" type="number" onChange={handleChange} className="w-[20%] h-full rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus-visible:ring-0 focus:outline-none  focus:ring-0"></Input>
        </div>
        <div className="rounded-t-lg bg-white border-t mt-2  border-gray-200  w-[100%] mx-auto h-fit  text-sm text-left text-gray-600">
        <div className="text-left pl-2  w-[95%] mx-auto font-semibold  h-1/2 pt-2 border-b flex">Στοιχήματα <div className="text-right w-full pr-6">{bet_List.length}</div></div>
        <div className="text-left pl-2  w-[95%] mx-auto font-semibold  h-1/2 pt-2   flex">Πιθανά κέρδη <div className="text-right w-[70%] pr-3   h-1/2  font-bold text-black">{((formData.input_Bet)*bet_Odd).toFixed(2)}</div></div>
        
        </div>
        <div className='bg-white'><Button onClick={handle_Bet} className=" w-[95%] mx-auto h-8 bg-[#e70161] text-xs rounded-lg mt-2 hover:bg-[#e70161] border-none ring-0 outline-none focus:outline-none">ΣΟΙΧΗΜΑΤΙΣΕ</Button></div>
        
        </div>
        {error && (
        <Alert
          variant="destructive"
          className={`fixed bottom-4 bg-white w-fit left-4 transition-all duration-500 ${
            isSlidingOut ? "animate-out slide-out-to-bottom" : "animate-in slide-in-from-bottom"
          }`}
        >
          
          <AlertCircle className="h-4 w-4 " />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

        
      </div>
    </div>
  )
}

export default App

