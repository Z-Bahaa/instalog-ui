import { useState, useEffect } from 'react'
import axios from 'axios';
import dayjs from 'dayjs';
import './App.css'
import {CgMediaLive} from 'react-icons/cg'
import {IoDownload} from 'react-icons/io5'
import {BiFilter} from 'react-icons/bi'
import {AiOutlineClose} from 'react-icons/ai'
import { motion } from "framer-motion"
import Event from './types/event'

import useSWR from 'swr';

let events = [
  {"id":"0268f3e0-6afd-4d10-b8e9-c0fb37fa16a4",
  "object":"event","actor_id":"user_3VG742j9PUA2","actor_name":"ali Salah","group":"instatus.com","target_id":"user_DOKVD1U3L031","target_name":"sami@instatus.com","location":"105.40.62.95","occurred_at":"2022-01-05T14:31:13.607Z","action":{"id":"8f42349f-4990-455a-ba0a-1a0d6a6e3f4f","object":"event_action","name":"user.didsomethinghere","event_id":"0268f3e0-6afd-4d10-b8e9-c0fb37fa16a4"},"metadata":{"id":"ca65e4a3-6076-466f-8d0b-6380abed8b6a","redirect":"/setup","description":"User login failed.","x_request_id":"req_W4Y47lljg85H","event_id":"0268f3e0-6afd-4d10-b8e9-c0fb37fa16a4"}},{"id":"04d459ba-78e3-46f8-92a2-4b0f6139bf89","object":"event","actor_id":"user_3VG742j9PUA2","actor_name":"ali Salah","group":"instatus.com","target_id":"user_DOKVD1U3L031","target_name":"sami@instatus.com","location":"105.40.62.95","occurred_at":"2022-01-05T14:31:13.607Z","action":{"id":"889e0fdd-1ef1-4850-a5f9-fba440c1ed48","object":"event_action","name":"user.didsomethinghere","event_id":"04d459ba-78e3-46f8-92a2-4b0f6139bf89"},"metadata":{"id":"36c0094e-a639-40ea-b19e-f5b32026fa2d","redirect":"/setup","description":"User login failed.","x_request_id":"req_W4Y47lljg85H","event_id":"04d459ba-78e3-46f8-92a2-4b0f6139bf89"}},{"id":"0f4a597f-634a-4bbe-b373-3558f942887c","object":"event","actor_id":"user_3VG742j9PUA2","actor_name":"ali Salah","group":"instatus.com","target_id":"user_DOKVD1U3L031","target_name":"sami@instatus.com","location":"105.40.62.95","occurred_at":"2022-01-05T14:31:13.607Z","action":{"id":"ed2f30a1-5611-4227-840a-40f4a87f357d","object":"event_action","name":"user.didsomethinghere","event_id":"0f4a597f-634a-4bbe-b373-3558f942887c"},"metadata":{"id":"b2e3b4a2-d572-47c9-84cb-056228b0f285","redirect":"/setup","description":"User login failed.","x_request_id":"req_W4Y47lljg85H","event_id":"0f4a597f-634a-4bbe-b373-3558f942887c"}},{"id":"160de73b-620b-4c15-8c05-3f49e6358de3","object":"event","actor_id":"user_3VG742j9PUA2","actor_name":"ali Salah","group":"instatus.com","target_id":"user_DOKVD1U3L031","target_name":"sami@instatus.com","location":"105.40.62.95","occurred_at":"2022-01-05T14:31:13.607Z","action":{"id":"7409a834-1a54-4237-9275-92925758de70","object":"event_action","name":"user.didsomethinghere","event_id":"160de73b-620b-4c15-8c05-3f49e6358de3"},"metadata":{"id":"c404324d-5d34-4fb3-8b31-f65239e8d9e2","redirect":"/setup","description":"User login failed.","x_request_id":"req_W4Y47lljg85H","event_id":"160de73b-620b-4c15-8c05-3f49e6358de3"}},{"id":"368794b3-5598-4f9a-8a80-566aa9fbd3e4","object":"event","actor_id":"user_3VG742j9PUA2","actor_name":"ali Salah","group":"instatus.com","target_id":"user_DOKVD1U3L031","target_name":"sami@instatus.com","location":"105.40.62.95","occurred_at":"2022-01-05T14:31:13.607Z","action":{"id":"8ebae3d6-f571-4ebc-88ea-10a4539486f5","object":"event_action","name":"user.didsomethinghere","event_id":"368794b3-5598-4f9a-8a80-566aa9fbd3e4"},"metadata":{"id":"1645db3d-5815-472d-b35d-b1d68cbdbce3","redirect":"/setup","description":"User login failed.","x_request_id":"req_W4Y47lljg85H","event_id":"368794b3-5598-4f9a-8a80-566aa9fbd3e4"}},{"id":"392ed075-db85-44de-9124-68fb6e488ed0","object":"event","actor_id":"user_3VG742j9PUA2","actor_name":"ali Salah","group":"not instatus.com","target_id":"user_DOKVD1U3L031","target_name":"sami@instatus.com","location":"105.40.62.95","occurred_at":"2022-01-05T14:31:13.607Z","action":{"id":"e1988190-447d-4a10-978c-1a30859d849f","object":"event_action","name":"user.didsomethinghere","event_id":"392ed075-db85-44de-9124-68fb6e488ed0"},"metadata":{"id":"e5c487f5-a6d8-4fb6-81c7-85bfb783674a","redirect":"/setup","description":"User login failed.","x_request_id":"req_W4Y47lljg85H","event_id":"392ed075-db85-44de-9124-68fb6e488ed0"}}
]

function App() {

  const [loading, setLoading] = useState(true)
  const [isLive, setIsLive] = useState(true)
  const [eventsData, setEventsData]= useState<Event[]>([])
  const [activeEvent, setActiveEvent]: any = useState(events[0])
  const [eventCardVisible, setEventCardVisible]: any = useState(false)

  const [page, setPage] = useState(0)
  const [searchValue, setSearchValue] = useState("")

  // get all events

  const getEvents = async (url: string, pg?: number, search?: string) => {
    const response = await axios.get(url, {
      params: {
        page: pg,
        search_val: search
      }})
      if(isLive) {
        if(page > 0) {await setEventsData(eventsData.slice(0, -1).concat(response.data));}
        else  await setEventsData(response.data);
      }
      console.log(eventsData)
      return response.data;
  }

  const { error, isLoading } = useSWR([`https://instalog-api.onrender.com/events/?page=${page}&search_val=${searchValue}`], 
    getEvents,{
    refreshInterval: 30000, 
  });
  
  if(error) console.log(error)

  // export into csv
  const handleExport = () => {
    window.open(`https://instalog-api.onrender.com/events/export/?search_val=${searchValue}`, '_blank')
  }

  // live 
  const handleToggleLive = () => {
    setIsLive(!isLive)
  }


  const handleValueChange = (event: any) => {
    setPage(0)
    console.log('page:', page)
    setSearchValue(event.target.value);
  }

  useEffect(() => {
    setPage(0)
  },[ searchValue])
  if(!isLoading && loading) setLoading(false)
  if(loading) {
    return (
      <div>Loading...</div>
    )
  }
  
  return (<div className="flex flex-col ">
    <div  className="p-8 md:p-16 md:py-8 md:mt-8 flex flex-col items-center space-y justify-items-start justify-start h-fit" >

      <div id="upper-section" className="w-full rounded-tl-2xl rounded-tr-2xl bg-neutral-100 border-neutral-300 border-x border-t items-center flex flex-col p-3 pb-0">

        <div id="search-container" className="flex w-full items-center justify-between p-2 rounded-lg border border-neutral-300 md:divide-x-2 md:divide-neutral-300">

          <input type="text" name="search" value={searchValue} onChange={handleValueChange} placeholder="Search name, email or action..." className=" 
            bg-transparent focus:border-teal-500 focus:outline-none text-sm text-neutral-600 w-full"/>
          
          

          <div id="cta-container-web" className="sm:hidden bg-neutral-100 flex justify-items-end divide-x-2 divide-neutral-300">
            <button className=" flex items-center p-1 px-2 hover:bg-neutral-200" >
              <BiFilter size="18" color="#414141" />
              <p className="text-center text-neutral-500 text-xs font-normal mx-1">FILTER</p>
            </button>
            <button className=" flex items-center p-1 px-2 hover:bg-neutral-200" onClick={handleExport}>
              <IoDownload size="17" color="#414141" />
              <p className="text-center text-neutral-500 text-xs font-normal mx-1">EXPORT</p>
            </button>
            <button className={"flex items-center p-1 px-2 hover:bg-neutral-200"} onClick={handleToggleLive}>
              <CgMediaLive size="17" color={isLive? "#d60b0b" : "#414141"} />
              <p className={"text-center text-neutral-500 text-xs font-normal mx-1 " + (isLive ? "text-red-700 font-semibold" : "")}>LIVE</p>
            </button>
          </div>  

        </div>

        <div id="cta-container" className="md:hidden w-full bg-neutral-100 flex justify-items-center justify-center divide-x-2 divide-neutral-300 mb-1 mt-3">
          <button className=" flex items-center p-1 px-2" >
            <BiFilter size="21" color="#414141" />
            <p className="text-center text-neutral-500 text-sm font-normal mx-1">FILTER</p>
          </button>
          <button className=" flex items-center p-1 px-2" >
            <IoDownload size="19" color="#414141" />
            <p className="text-center text-neutral-500 text-sm font-normal mx-1 mt-1">EXPORT</p>
          </button>
          <button className=" flex items-center p-1 px-2" >
            <CgMediaLive size="19" color="#414141" />
            <p className="text-center text-neutral-500 text-sm font-normal mx-1">LIVE</p>
          </button>
        </div>  

        <div id="table-head" className="md:hidden grid grid-cols-1 w-full justify-items-center justify-between text-sm font-semibold pt-1 text-neutral-700 pb-1">
          <p>EVENTS LOG</p>
        </div>

        <div id="table-head-web" className="sm:hidden grid grid-cols-3 w-full justify-items-center justify-between text-sm mt-2 font-semibold pt-1 text-neutral-700 pb-1">
          <p className=" w-full ">ACTOR</p>
          <p className=" w-full ">ACTION</p>
          <p className=" w-full ">DATE</p>
        </div>

      </div>
    
      <div id="table-content-web" className="sm:hidden w-full divide-y divide-neutral-300 border-neutral-300 border-x">
        {eventsData.slice(0, 10*(page+1)).map((event, i) => (
          <div id="table-head" key={i}  onClick={() => {setActiveEvent(event); return setEventCardVisible(true)}} className=" hover:bg-neutral-200 grid grid-cols-3 auto-cols-auto  w-full items-center justify-between text-sm font-semibold pt-1 text-neutral-500 p-3 ">
            <div className="flex items-center ">
              <div className="ml-2 mr-4 flex items-center justify-items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 aspect-square w-8 h-8 rounded-full mt-2">
                <p className="text-white text-lg font-thin">{event.target_name[0].toUpperCase()}</p>
              </div>
              <p className=" text-base text-neutral-700 font-normal py-2 pb-0 truncate ">{event.target_name}</p>
            </div>
            <p className=" text-base text-neutral-700 font-normal py-2 pb-0 truncate ">{event.action.name}</p>
            <p className=" text-base text-neutral-700 font-normal py-2 pb-0 truncate ">{dayjs(event.occurred_at).format('MMM D, h:mm')}</p>
        </div>
        ))}
      </div>

      

      <div id="table-content" className="md:hidden w-full divide-y divide-neutral-300 border-neutral-300 border-x px-4">
        {eventsData.slice(0, 10*(page+1)).map((event, i) => (<div key={i}>
          <div id="table-head" onClick={() => setActiveEvent(event)} className=" flex flex-col  w-full justify-between text-sm font-semibold pt-1 text-neutral-500 pb-1 ">
          <p className="text-xs pb-1">ACTOR</p>
          <p className=" text-sm text-neutral-700 pb-1">{event.target_name}</p>
          <p className="text-xs pb-1">ACTION</p>
          <p className=" text-sm text-neutral-700 pb-1">{event.action.name}</p>
          <p className="text-xs pb-1">DATE</p>
          <p className=" text-sm text-neutral-700 pb-1">{dayjs(event.occurred_at).format('MMM D, h:mm')}</p>
        </div>
        {
          event.id != activeEvent.id ? "" :
          (<div className="text-xs bg-red-100 text-center font-normal">
            <p>to access event data, please use the webview console. </p>
          </div>)
        }
        </div>))}
      </div>
        
      {eventsData.length < 10*(page+1)+1 ? "" : (<button id="load-more" onClick={() => setPage(page+1)}
      className="font-semibold bg-neutral-200 text-sm border-neutral-300 w-full p-3 rounded-bl-3xl rounded-br-3xl border-x border-b text-center text-neutral-600
      ">
        LOAD MORE
      </button>)}

      {eventsData.length > 0 ? "" : (<div id="load-more"
      className="h-96 bg-neutral-200  self-end w-full flex items-center justify-center rounded-bl-3xl rounded-br-3xl border-x border-b text-center text-neutral-900">
        NO EVENT LOGS AVAILABLE
      </div>)}

    </div >
    {!eventCardVisible ? "" : (<div  className="fixed z-1 w-screen h-screen">
      <div onClick={() => {return setEventCardVisible(false)}} className=" absolute z-2  w-screen h-screen "></div>
        <motion.div
        initial={{ opacity: 0,}}
        animate={{ opacity: 1,}}
        transition={{ duration: .3 }}
    >
      <div id="event-card" className=" absolute z-12 bg-white sm:hidden svn:grid-cols-2 fft:p-8 thn:p-8 p-14 gap-x-32 thn:gap-x-4 gap-y-4 my-12 mx-8 mr-12  grid grid-cols-3 border-neutral-300 border rounded-3xl top-1/2 transform  -translate-y-1/2">
        <AiOutlineClose color="red" className="absolute right-8 top-6" size="20px" onClick={() => {return setEventCardVisible(false)}}/>
        <div className="">
          <h1 className="font-medium text-sm text-neutral-500 mb-3">ACTOR</h1>
          <div className="w-full   grid grid-cols-2 thn:grid-cols-1 ">
          <p className="font-normal text-sm text-neutral-500 mb-2">Name</p>
          <p className="font-normal text-sm text-black mb-2">{activeEvent.actor_name}</p>
          <p className="font-normal text-sm text-neutral-500 mb-2">Email</p>
          <p className="font-normal text-sm text-black mb-2">{activeEvent.target_name}</p>
          <p className="font-normal text-sm text-neutral-500 mb-2">ID</p>
          <p className="font-normal text-sm text-black mb-2">{activeEvent.actor_id}</p>
          </div>
        </div>
        <div className="">
          <h1 className="font-medium text-sm text-neutral-500 mb-3">ACTION</h1>
          <div className="w-full   grid grid-cols-2 thn:grid-cols-1 ">
          <p className="font-normal text-sm text-neutral-500 mb-2">Name</p>
          <p className="font-normal text-sm text-black mb-2">{activeEvent.action.name}</p>
          <p className="font-normal text-sm text-neutral-500 mb-2">Object</p>
          <p className="font-normal text-sm text-black mb-2">{activeEvent.action.object}</p>
          <p className="font-normal text-sm text-neutral-500 mb-2">ID</p>
          <p className="font-normal text-sm text-black mb-2">{activeEvent.action.id}</p>
          </div>
        </div>
        <div className="">
          <h1 className="font-medium text-sm text-neutral-500 mb-3">DATE</h1>
          <div className="w-full   grid grid-cols-2 thn:grid-cols-1 ">
          <p className="font-normal text-sm text-neutral-500 mb-2">Readable</p>
          <p className="font-normal text-sm text-black mb-2">{dayjs(activeEvent.occurred_at).format('MMM D, h:mm')}</p>
          </div>
        </div>
        <div className="">
          <h1 className="font-medium text-sm text-neutral-500 mb-3">METADATA</h1>
          <div className="w-full   grid grid-cols-2 thn:grid-cols-1 ">
          <p className="font-normal text-sm text-neutral-500 mb-2">Redirect</p>
          <p className="font-normal text-sm text-black mb-2">{activeEvent.metadata.redirect}</p>
          <p className="font-normal text-sm text-neutral-500 mb-2">Description</p>
          <p className="font-normal text-sm text-black mb-2">{activeEvent.metadata.description}</p>
          <p className="font-normal text-sm text-neutral-500 mb-2">Request ID</p>
          <p className="font-normal text-sm text-black mb-2">{activeEvent.metadata.x_request_id}</p>
          </div>
        </div>
        <div className="">
          <h1 className="font-medium text-sm text-neutral-500 mb-3">TARGET</h1>
          <div className="w-full   grid grid-cols-2 thn:grid-cols-1 ">
          <p className="font-normal text-sm text-neutral-500 mb-2">Name</p>
          <p className="font-normal text-sm text-black mb-2">{activeEvent.target_name}</p>
          <p className="font-normal text-sm text-neutral-500 mb-2">Location</p>
          <p className="font-normal text-sm text-black mb-2">{activeEvent.location}</p>
          <p className="font-normal text-sm text-neutral-500 mb-2">ID</p>
          <p className="font-normal text-sm text-black mb-2">{activeEvent.target_id}</p>
          </div>
        </div>
      </div>
    </motion.div>
      
    </div>
    )}
  </div>
  )
}

export default App
