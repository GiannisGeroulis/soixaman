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
import axios from "axios";
import { use } from 'react'
import { parseISO, format } from 'date-fns';

const supabase = createClient('https://jijpfubuctsndjifoijm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppanBmdWJ1Y3RzbmRqaWZvaWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyOTY3NzAsImV4cCI6MjA0OTg3Mjc3MH0.-ULAU7RraewQKid5LDYXMtGoo5FK8J6_YLIE9PcsqGA')








function App() {
  const [matchesApi,setMatchesApi]=useState([])
  const [katatakseis,set_Katatakseis]=useState([])
  const [kerdismeno,set_Kerdismeno]=useState(true)
  const [anoixto,set_Anoixto]=useState(true)
  const [xameno,set_Xameno]=useState(true)
  const [bet_List_Istoriko,set_Bet_List_Istoriko]=useState([])
  const [banner_Istoriko,set_Banner_Istoriko]=useState(false)
  const [banner_Soixima,set_Banner_Soixima]=useState(true)
  const  [banner_Katatakseis,set_Banner_Katatakseis]=useState(false)
  const [bet_Odd,set_Bet_Odd]=useState(1)
  const [bet_List,set_Bet_List]=useState([])
  const [matches,set_Matches]=useState(null)
  const [matches_Display,set_Matches_Display]=useState([])
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
  const [flag,setFlag]=useState(null)
  const [formData,setFormData] = useState({
    email:"",name:"",surname:"",password:"",input_Bet:1
   }) 


  
   const fetchFlagFromTable = async () => {
    const { data, error } = await supabase
      .from('fetch') // Πίνακας
      .select('fetchFlag') // Επιλογή μόνο της στήλης fetchFlag
      .single(); // Υποθέτουμε ότι υπάρχει μία μόνο γραμμή (ή χρησιμοποίησε data[0] για πολλαπλές)

    if (error) {
      console.error('Error fetching flag:', error);
    } else {
      setFlag(data.fetchFlag); // Ενημέρωση του state με την τιμή του fetchFlag
    }
  };

  


  // Παρακολούθηση matchesApi και flag
  useEffect(() => {
    console.log('Flag:', flag);
    
    if(flag === true)
    {
      fetchMatches();
      setFlag(false)
      updateFlag(false)
      fetch_Games2()
    }
  }, [flag]); // Τρέχει κάθε φορά που αλλάζει το matchesApi
  async function insert_Match(home_Team, away_Team, home_Image, away_Image, time) {
    // Έλεγχος αν υπάρχει ήδη ο αγώνας
    const { data: existingMatch, error: fetchError } = await supabase
      .from('matches')
      .select('*')
      .eq('h_Team', home_Team)
      .eq('a_Team', away_Team)
      .single();
  
    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 σημαίνει "Not Found" (δεν βρέθηκε εγγραφή)
      console.error('Error checking existing match:', fetchError);
      return;
    }
  
    if (existingMatch) {
      console.log('Match already exists:', existingMatch);
      return; // Σταματάει η διαδικασία αν υπάρχει ήδη
    }
  
    // Αν δεν υπάρχει, κάνε insert
    const { data, error } = await supabase
      .from('matches')
      .insert({
        h_Team: home_Team,
        a_Team: away_Team,
        home_Image: home_Image,
        away_Image: away_Image,
        time: time,
      });
  
    if (error) {
      console.error('Error inserting match:', error);
    } else {
      console.log('Match inserted successfully:', data);
    }
  }
  useEffect(() => {
    
    if(matchesApi.matches)
    {
     
     matchesApi.matches.map(match => {
      const homeTeam = match.homeTeam.shortName
      const awayTeam = match.awayTeam.shortName
      const homeImage = match.homeTeam.crest
      const awayImage = match.awayTeam.crest
      const time = match.utcDate
      const home= match.score.fullTime.home
      const away = match.score.fullTime.away
     // console.log(homeTeam,awayTeam,homeImage,awayImage,format(parseISO(time), 'dd/MM HH:mm'))
      insert_Match(homeTeam,awayTeam,homeImage,awayImage,format(parseISO(time), 'dd/MM HH:mm'))
      if(home !== null && away !== null)
      {
        update_Score(home,away,homeTeam,awayTeam)
      }
      
    })
    }else
    {
      console.log('No matches yet');
    }
  }, [matchesApi]); // Τρέχει κάθε φορά που αλλάζει το flag
  async function update_Score(home,away,homeTeam,awayTeam)
  {
    const {error} = await supabase
    .from('matches')
    .update({ home: home, away: away, match_End: true })
    .eq('h_Team', homeTeam)
    .eq('a_Team', awayTeam)
    
    if(home>away)
    {
      const {error} = await supabase
      .from('matches')
      .update({ asos_Result: true })
      .eq('h_Team', homeTeam)
      .eq('a_Team', awayTeam)
    }else if(home<away)
    {
      const {error} = await supabase
      .from('matches')
      .update({ diplo_Result: true })
      .eq('h_Team', homeTeam)
      .eq('a_Team', awayTeam)
    }else if(home===away)
    {
      const {error} = await supabase
      .from('matches')
      .update({ x_Result: true })
      .eq('h_Team', homeTeam)
      .eq('a_Team', awayTeam)
    }
    if(home + away > 2.5)
    {
      const {error} = await supabase
      .from('matches')
      .update({ over25_Result: true })
      .eq('h_Team', homeTeam)
      .eq('a_Team', awayTeam)
    }else if(home + away < 2.5)
    {
      const {error} = await supabase
      .from('matches')
      .update({ under25_Result: true })
      .eq('h_Team', homeTeam)
      .eq('a_Team', awayTeam)
    }
    if(home > 0 && away > 0)
    {
      const {error} = await supabase
      .from('matches')
      .update({ gg_Result: true })
      .eq('h_Team', homeTeam)
      .eq('a_Team', awayTeam)
    }else if(home === 0 || away === 0)
    {
      const {error} = await supabase
      .from('matches')
      .update({ ng_Result: true })
      .eq('h_Team', homeTeam)
      .eq('a_Team', awayTeam)
    }
  }
  async function updateFlag(val)
  {
    const { error } = await supabase
    .from('fetch')
    .update({ fetchFlag: val })
    .eq('id', 1);
    
  }
  const fetchMatches = async () => {
    try {
      const response = await fetch("https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/matches", {
        method: "GET",
        headers: {
            "X-Auth-Token": "545e7fc4e4854d149dc252050ebce396",
        },
    });

      if (response.ok) {
        const data = await response.json();
        setMatchesApi(data);
        
      } else {
        console.error("HTTP error:", response.status);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };


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
   
   function handleChange(event)
   {
     setFormData((prevFormData)=>{
       return{
         ...prevFormData,[event.target.name]:event.target.value
       }
       
     })
   }
   function filter_Kerdismena()
   {set_Kerdismeno(!kerdismeno)}
   function filter_Xamena()
   {set_Xameno(!xameno)}
   function filter_Anoixta()
   {set_Anoixto(!anoixto)}
    
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
    
    if(!error)
    {
      set_Toggle_Register(false)
      set_Toggle_Login(true)
    }
    
    insert_User_Table(data.user.id,data.user.user_metadata.name)
   }
   async function insert_User_Table(r_id,display)
   {
     const { error } = await supabase
     .from('users')
     .insert({ id: r_id , display:display } )
     

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
    fetch_Katatakseis()
    fetchFlagFromTable()
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
            match_Bool: match_Bool,
            home: match.home,
            away: match.away
            
            
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
  
    let wins=0
    

    newBetListIstoriko.map(bet => {
      if(bet.bet_Status===true) {wins++}


    })
    update_Pososta(wins,newBetListIstoriko.length)
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
  async function update_Pososta(wins, matches) {
    const { data: { user } } = await supabase.auth.getUser();
  
    const pososto = matches  > 0  ? ((wins / matches) * 100).toFixed(2) : 0.00;
    
    const { error } = await supabase
      .from('users')
      .update({
        bet_Wins: wins,
        bet_Length: matches,
        pososto: pososto
      })
      .eq('id', user.id);
  
    
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
   async function fetch_Games2() {
    const { data, error } = await supabase
    .from('matches')
    .select()
    .eq("match_End",false)
    set_Matches_Display(data)

    
    
   }
   useEffect(() => {
    fetch_Games2();
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
    if (bet_List.length > 8)
    {
      set_Error("Μέχρι 8 στοιχήματα")
      return
    }
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
      
      
        
        
      
      set_Error("Το στοίχημα τοποθετήθηκε επιτυχώς")
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
  async function fetch_Katatakseis()
  {
    const {data,error} = await supabase
    .from('users')
    .select()
    .gt('bet_Length',0)
    set_Katatakseis(data)
  }
  function handle_Banner_Katatakseis()
  {
    set_Banner_Katatakseis(true)
    set_Banner_Istoriko(false)
    set_Banner_Soixima(false)
  }
  function handle_Banner_Soixima()
  {
    set_Banner_Katatakseis(false)
    set_Banner_Soixima(true)
    set_Banner_Istoriko(false)
  }
  function handle_Banner_Istoriko()
  {
    set_Banner_Katatakseis(false)
    set_Banner_Soixima(false)
    set_Banner_Istoriko(true)
    set_Anoixto(true)
    set_Xameno(true)
    set_Kerdismeno(true)
  }
  
  
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
        <Button onClick={handle_Banner_Katatakseis} className="font-bold bg-transparent hover:bg-transparent hover:ring-0 hover:outline-none hover:border-none focus:ring-0 focus:border-0 focus:outline-none text-white w-fit mt-6 h-4  text-sm  ">ΚΑΤΑΤΑΞΕΙΣ</Button>
      </div>
      
      <div className="bg-[#0066cc] w-1/2 h-16 fixed left-1/2 top-0 flex flex-row justify-end ">
      {greeting && (<div className=" mt-4 font-semibold text-lg text-white mr-12 flex">
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
        
        <div className="bg-white w-[79%]  h-fit max-h-[92%]    overflow-y-auto rounded-lg ml-4  mt-2 ">
          
          { matches_Display && banner_Soixima && (
            matches_Display
            .sort((a, b) => {
              // Διαχωρισμός και μετατροπή της μορφής DD/MM HH:mm σε Date
              const [dayA, monthA] = a.time.split(' ')[0].split('/'); // Παίρνουμε DD/MM
              const timeA = a.time.split(' ')[1]; // Παίρνουμε HH:mm
              const dateA = new Date(`2025-${monthA}-${dayA}T${timeA}:00`); // Ανασύνθεση σε YYYY-MM-DDTHH:mm:ss
        
              const [dayB, monthB] = b.time.split(' ')[0].split('/');
              const timeB = b.time.split(' ')[1];
              const dateB = new Date(`2025-${monthB}-${dayB}T${timeB}:00`);
        
              // Σύγκριση για ταξινόμηση
              return dateA - dateB;
            })
            .map((match,index) => (
              
          <div key={index} className=" w-full h-13 flex p-4 border-b ">
            <div className=" h-full w-[15%] flex-col mt-3  " >
              
              <div className=''>
             {match.time}
              </div>
            </div>
            <div className=" h-full w-[25%] flex-col  space-y-1" >
              <div className='flex  justify-left ml-28'>
                <div className=' w-fit h-fit '>
                  <img src={match.home_Image} className="w-5  h-5 mt-1" />
                </div>
                <div className="text-lg">{match.h_Team}</div>
              </div>
              <div className='flex  justify-left ml-28'>
                <div className=' w-fit h-fit'>
                  <img src={match.away_Image} className="w-5  h-5 mt-1" />
                </div>
                <div className="text-lg">{match.a_Team}</div>
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
          {matches_Display.length===0 && banner_Soixima && (<div>Δεν υπάρχουν διαθέσιμα παιχνίδια</div>)}
          
       {/*History Body*/}
{banner_Istoriko && (
  <div className="w-full h-full rounded-lg flex flex-row flex-wrap overflow-y-auto justify-start">
    {bet_List_Istoriko
      .filter(bet => {
        // Δημιουργία συνόλου των επιθυμητών status
        const validStatuses = [];
        if (kerdismeno) validStatuses.push("ΚΕΡΔΙΣΜΕΝΟ");
        if (xameno) validStatuses.push("ΧΑΜΕΝΟ");
        if (anoixto) validStatuses.push("ΑΝΟΙΧΤΟ");

        // Επιστροφή μόνο όσων bet έχουν status που περιλαμβάνεται στο validStatuses
        return validStatuses.includes(bet.status_Text);
      })
      .sort((a, b) =>
        {if (a.status_Text < b.status_Text) return -1;
          if (a.status_Text > b.status_Text) return 1;
  
          // Αν τα status_Text είναι ίδια, ταξινομούμε με βάση το created_At
          return new Date(b.created_At) - new Date(a.created_At);} )
      .map((bet,index) => (
        <div key={index} className="bg-gray-50 mb-20 mt-2 mr-2 w-[19%] h-fit  rounded-3xl border-gray-200 border">
          <div className="text-sm">
            Ημερομηνία Δελτίου: {dayjs(bet.created_At).format("DD/MM/YYYY HH:mm")}
          </div>

          {bet.items.map((game,index) => (
            <div key={index} className="rounded-lg mb-2 border text-left mx-2 mt-2">
              <div
                className={`font-semibold w-full flex ${
                  !game.match_Bool
                    ? "text-yellow-400"
                    : game.odd_Bool && game.match_Bool
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                <div className="w-1/2 text-left pl-2">{game.title}</div>
                <div className="w-1/2 text-right mr-2">{game.value_Odd}</div>
              </div>
              <div className="w-full text-left pl-2 text-sm text-gray-600">{game.descr}</div>
              <div className="w-full text-left pl-2 text-sm">
                {game.home_Team}-{game.away_Team}
                <div>{game.home}-{game.away}</div>
              </div>
              
            </div>
          ))}
          <div className="bg-white w-full rounded-t-3xl border-t">
            <div className="w-[90%] mx-auto border-b mt-2">
              <div className="flex">
                <div className="text-left text-sm text-gray-600 w-1/2 font-semibold">
                  Στοιχήματα
                </div>
                <div className="text-right text-sm text-gray-600 w-1/2 font-semibold">
                  {bet.items.length}
                </div>
              </div>
            </div>
            <div className="w-[90%] mx-auto mt-2">
              <div className="flex">
                <div className="text-left text-sm text-gray-600 w-1/2 font-semibold">
                  Πιθανά κέρδη
                </div>
                <div className="text-right text-sm font-bold w-1/2">
                  {((bet.bet_Odd) * (bet.bet_Amount)).toFixed(2)}
                </div>
              </div>
            </div>
            <div className="w-[90%] mx-auto mt-2">
              <div className="flex">
                <div className="text-left text-sm text-gray-600 w-1/2 font-semibold">
                  Ποσό στοιχήματος
                </div>
                <div className="text-right text-sm font-bold w-1/2">
                  {(bet.bet_Amount).toFixed(2)}
                </div>
              </div>
            </div>
            <div
              className={`rounded-b-3xl border-t font-semibold text-sm ${
                bet.status_Text === "ΑΝΟΙΧΤΟ"
                  ? "bg-yellow-400"
                  : bet.status_Text === "ΚΕΡΔΙΣΜΕΝΟ"
                  ? "bg-green-600"
                  : "bg-red-600"
              }`}
            >
              {bet.status_Text}
            </div>
          </div>
        </div>
      ))}
  </div>
)}

      
      {banner_Katatakseis && (
        <div >
        <div className="flex w-full h-full space-x-4 justify-center  border-b border-gray-300">
          <div className="border-r-2 border-l-2 w-[8%] border-gray-200 pr-2 my-2">Θέση</div>
          <div className="border-r-2  w-[13%] border-gray-200 pr-2 my-2">Όνομα Χρήστη</div>
          <div className="border-r-2 w-[13%] border-gray-200 pr-2 my-2">Νίκες/Στοιχήματα</div>
          <div className="border-r-2 w-[13%] border-gray-200 pr-2 my-2">Ποσοστό Επιτυχίας</div>
        </div>
        
          {katatakseis
          .sort((a, b) => b.pososto - a.pososto)
          .map((katataksi,index) => (
            <div key={index} className="flex  w-full h-full space-x-4 justify-center  border-b border-gray-300">
              <div className="border-r-2 border-l-2 w-[8%] border-gray-200 pr-2 my-2">{index + 1}</div>
              <div className="border-r-2  w-[13%] border-gray-200 pr-2 my-2">{katataksi.display}</div>
              <div className="border-r-2 w-[13%] border-gray-200 pr-2 my-2">{katataksi.bet_Wins}/{katataksi.bet_Length}</div>
              <div className="border-r-2 w-[13%] border-gray-200 pr-2 my-2">{katataksi.pososto}%</div>
            </div>
          ))}
        </div>
        
      )}




        
        </div>
        
        
       
        {/*Bet Body*/}
        <div className="bg-gray-50 w-[19%]  mr-auto rounded-t-3xl  fixed bottom-0 right-0 border-gray-200 border  pb-3 ">
          <div className=" max-h-96 rounded-3xl overflow-auto">
        {bet_List.map((choice, index) => (
          
          <div key={index} className="rounded-lg bg-white border-gray-200 border w-[95%] mx-auto h-fit pb-2pt-2  mt-2">
           {/* <div className="text-left  w-[95%] mx-auto font-semibold  h-1/2 pt-3 flex">{choice.title}<div className=' w-2/3 mx-auto text-right'>{(choice.odd).toFixed(2)}</div></div>*/}
            
            <div className="flex ">
              <div className="w-1/2 text-left mx-auto pl-2 font-semibold">{choice.title}</div>
              <div className="w-1/2 text-right pr-4 font-semibold">{(choice.odd).toFixed(2)}</div>
            </div>
            <div className="text-left w-[95%] mx-auto  text-sm text-gray-600">{choice.perigrafi}</div>
            <div className="text-left w-[95%] mx-auto  text-sm">{choice.home_Team}-{choice.away_Team}</div>
            </div>
            
            
          
        ))}
        </div>
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
          
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {banner_Istoriko && (<div className=" w-[18%]  mx-auto mt-2 flex space-y-2  flex-col flex-wrap">
      <Button onClick={filter_Kerdismena} className={`w-24 ring-0 outline-none focus:outline-none h-8 ${kerdismeno ? 'bg-white border-blue-400 text-green-700 hover:bg-white' : 'bg-gray-300 hover:bg-transparent text-green-700 border-black'}`}>ΚΕΡΔΙΣΜΕΝΑ</Button>

        <Button onClick={filter_Anoixta} className={`w-24 ring-0 outline-none focus:outline-none h-8 ${anoixto ? 'bg-white border-blue-400 text-yellow-400 hover:bg-white' : 'bg-gray-300 hover:bg-transparent text-yellow-400 border-black'}`}>ΑΝΟΙΧΤΑ</Button>
        <Button onClick={filter_Xamena} className={`w-24 ring-0 outline-none focus:outline-none h-8 ${xameno ? 'bg-white border-blue-400 text-red-700 hover:bg-white' : 'bg-gray-300 hover:bg-transparent text-red-700 border-black'}`}>ΧΑΜΕΝΑ</Button>
        
      </div>)}

     
      
      </div>
    </div>
  )
}

export default App

