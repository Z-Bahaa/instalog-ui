import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from "framer-motion"
import debounce from 'lodash.debounce';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation'

import {CgMediaLive} from 'react-icons/cg'
import {IoDownload} from 'react-icons/io5'
import {BiFilter} from 'react-icons/bi'
import {AiOutlineLoading3Quarters} from 'react-icons/ai'

import {Event} from '../../domain-models'
import { requestFetchAllEvents, requestExportEvents } from '../../network';
import ListItemWeb from './ListItemWeb';
import ListItem from './ListItem'
import EventDetails from './EventDetails'

const request = debounce(value => {
  alert(`request: ${value}`);
}, 1000);

const EventList =() => {

  const [isLive, setIsLive] = useState(false)
  const [eventsData, setEventsData]= useState<Event[]>([])
  const [activeEvent, setActiveEvent]= useState(null)
  const [eventCardVisible, setEventCardVisible] = useState(false)

  const [page, setPage] = useState(0)
  const [searchValue, setSearchValue] = useState("")
  const [searchInputValue, setSearchInputValue] = useState("")



  
  let { data, isLoading, error, trigger: getAllEvents } = useSWRMutation({page, searchText: searchValue},requestFetchAllEvents, {
    refreshInterval: isLive? 5000 : 0,
    revalidateOnMount: false, 
    revalidateOnFocus: false,
  }); 


  useEffect(() =>  {
    if(data != undefined  ) {
      if(page > 0) setEventsData(eventsData.slice(0, -1).concat(data))
      else setEventsData(data);
    }

  }, [data])




  const {data: exportEventsFile, trigger: exportEvents, isMutating: exportEventsIsLoading, error: exportEventsError } = 
  useSWRMutation({searchText: searchValue}, requestExportEvents);
  





  const handleToggleLive = () => {
    setIsLive(!isLive)
    if(isLive) {
      setPage(0)
      setSearchValue("")
    }
    
  }

  const handleActiveEventChange =  (event: Event) => {
    setActiveEvent(event); 
    setEventCardVisible(true)
  }
  const handleActiveEventDelete =  (event: Event) => {
    setActiveEvent(event);
    setEventCardVisible(false) 

  }


  useEffect(() => {
    getAllEvents()
  }, [page, searchValue])

  const handleSearchValueChange = (event) => {
    setSearchInputValue(event.target.value)
  }

  const handleExportList = () => {
    if(exportEventsIsLoading) {
      return
    }

    exportEvents()

  }


  useEffect(() => {
    const controller = setTimeout(() => {
      setSearchValue(searchInputValue)
    }, 300)

    return () => clearTimeout(controller)
  },[searchInputValue])



  useEffect(() => {
    if(!exportEventsFile) {
      return
    }

    const url = window.URL.createObjectURL(new Blob([exportEventsFile]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'file.pdf');
    document.body.appendChild(link);
    link.click();
  },[exportEventsFile])

  


  return (<div className="flex flex-col w-full h-full">
    <div  className="p-8 md:p-16 md:py-8 md:mt-8 flex flex-col items-center space-y justify-items-start justify-start h-fit" >

      <div id="upper-section" className="w-full rounded-tl-2xl rounded-tr-2xl bg-neutral-100 border-neutral-300 border-x border-t items-center flex flex-col p-3 pb-0">

        <div id="search-container" className="flex w-full items-center justify-between p-2 rounded-lg border border-neutral-300 md:divide-x-2 md:divide-neutral-300">

          <input 
            type="text" 
            disabled={isLive} 
            name="search" 
            value={searchValue} 
            onChange={handleSearchValueChange} 
            placeholder={isLive ? "Search is not available during live mode" : "Search name, email or action..."} 
            className="bg-transparent focus:border-teal-500 focus:outline-none text-sm text-neutral-600 w-full"
            
          />
          
          

          <div id="cta-container-web" className="sm:hidden bg-neutral-100 flex justify-items-end divide-x-2 divide-neutral-300">
            <button className=" flex items-center p-1 px-2 hover:bg-neutral-200" >
              <BiFilter size="18" color="#414141" />
              <p className="text-center text-neutral-500 text-xs font-normal mx-1">FILTER</p>
            </button>
            <button className=" flex items-center p-1 px-2 hover:bg-neutral-200" onClick={handleExportList}>
              {exportEventsIsLoading ? 
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, ease: 'linear', repeat: Infinity }}
                >
                  <AiOutlineLoading3Quarters size="17" color="#606060" />
                </motion.div>
              :<IoDownload size="17" color="#414141" />}
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
          <button className=" flex items-center p-1 px-2" onClick={handleExportList} >
            {exportEventsIsLoading ? 
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, ease: 'linear', repeat: Infinity }}
              >
                <AiOutlineLoading3Quarters size="17" color="#606060" />
              </motion.div>
            :<IoDownload size="17" color="#414141" />}
            <p className="text-center text-neutral-500 text-sm font-normal mx-1 mt-1">EXPORT</p>
          </button>
          <button className=" flex items-center p-1 px-2" onClick={handleToggleLive}>
            <CgMediaLive size="19" color={isLive? "#d60b0b" : "#414141"} />
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
        {eventsData.slice(0, 10*(page+1)).map((event: any, i:number) => (
          <ListItemWeb  
            key={i} 
            actor={event.targetName} 
            action={event.action.name} 
            date={event.occurredAt} 
            handleEventChange={() => handleActiveEventChange(event)}
            />
        ))}
        {
          eventsData.length > 0 && isLoading ? (
            <motion.div id="no-events"
            className="h-12 bg-neutral-200 self-end w-full flex items-center justify-center border-b text-center text-neutral-900"
            initial={{ opacity: 1,}}
            animate={{ opacity: 0,}}
            transition={{ duration: 1.6, repeat: Infinity, repeatType: 'loop' }}
          >

          </motion.div>
          ) : ""
        }
      </div>

      

      <div id="table-content" className="md:hidden w-full divide-y divide-neutral-300 border-neutral-300 border-x px-4">
        {eventsData.slice(0, 10*(page+1)).map((event: any, i:number) => (
        <div key={i}>
          <ListItem 
            key={i} 
            actor={event.targetName} 
            action={event.action.name} 
            date={event.occurredAt} 
            handleEventChange={() => handleActiveEventChange(event)}
          />
        {
          (event === activeEvent && eventCardVisible) ?
          (<div className="text-xs bg-red-100 text-center font-normal">
            <p>to access event data, please use the webview console. </p>
          </div>) : ""
        }
        </div>))}
      </div>
        
      {eventsData.length >= 10*(page+1)+1 && !isLoading? (<button id="load-more" onClick={() => setPage(page+1)}
      className="font-semibold bg-neutral-200 text-sm border-neutral-300 w-full p-3 rounded-bl-3xl rounded-br-3xl border-x border-b text-center text-neutral-600
      ">
        LOAD MORE
      </button>) : " "}

      {eventsData?.length === 0 ? isLoading ? (
          <div id="no-events"
          className="h-96 bg-neutral-200  self-end w-full flex items-center justify-center rounded-bl-3xl rounded-br-3xl border-x border-b text-center text-neutral-900">
            <motion.div
              initial={{ opacity: 1,}}
              animate={{ opacity: .5,}}
              transition={{ duration: 1.2, repeat: Infinity, repeatType: 'loop' }}
            > 
            LOADING...
            </motion.div>
          </div>
      ) : (<div id="no-events"
      className="h-96 bg-neutral-200  self-end w-full flex items-center justify-center rounded-bl-3xl rounded-br-3xl border-x border-b text-center text-neutral-900">
        NO EVENTS LOG AVAILABLE
      </div>) : ""}

    </div >
    
    
    {(!eventCardVisible) ? "" : (activeEvent == null) ? "" : (
      <EventDetails 
        activeEvent={activeEvent}
        handleEventChange={() => handleActiveEventDelete(null)}
      />
    )}
  </div>
  )
}

export default EventList