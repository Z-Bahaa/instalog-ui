import { useState, useEffect, useMemo, memo } from 'react'
import { AnimatePresence, motion } from "framer-motion"
import useSWRMutation from 'swr/mutation'
import { observer } from "mobx-react-lite";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import Skeleton from 'react-loading-skeleton'
import { CgMediaLive as _CgMediaLive } from 'react-icons/cg'
import { IoDownload as _IoDownload } from 'react-icons/io5'
import { BiFilter as _BiFilter } from 'react-icons/bi'
import { AiOutlineLoading3Quarters as _AiOutlineLoading3Quarters } from 'react-icons/ai'
import { Virtuoso } from 'react-virtuoso'
import { Event } from '../../domain-models'
import { requestFetchAllEvents, requestExportEvents } from '../../network';
import ListItem from './ListItemWeb';
import EventDetails from './EventDetails'

import debounce from 'lodash.debounce'
import downloadFile from '../../utils/downloadFile';
import dayjs from 'dayjs';
import EventsDataStore from './DataStore';
import { camelizeKeys } from 'humps';

import 'react-loading-skeleton/dist/skeleton.css'
import { preload } from 'swr';

let preFetchedData = await preload({}, requestFetchAllEvents)

// Memoizing icons to avoid re-drawing canvas on re-renders
const CgMediaLive = memo(_CgMediaLive)
const IoDownload = memo(_IoDownload)
const BiFilter = memo(_BiFilter)
const AiOutlineLoading3Quarters = memo(_AiOutlineLoading3Quarters)

const EventList = observer(() => {
  const [eventStore] = useState(() => new EventsDataStore());

  const [isLive, setIsLive] = useState(false)
  const [activeEvent, setActiveEvent] = useState<Event | null>(null)


  const [loadMore, setLoadMore] = useState({})
  const [searchText, setSearchText] = useState(null)

  const {
    data: eventsList,
    isMutating: isLoadingEvents,
    error: getAllEventsError,
    trigger: getAllEvents
  } = useSWRMutation({
    searchText,
    lastCursor: eventStore.getLastCursor()
  }, requestFetchAllEvents);
  const {
    data: exportedEventsFile,
    trigger: getExportableData,
    isMutating: exportEventsIsLoading,
    error: exportingEventsError
  } =
    useSWRMutation({ searchText }, requestExportEvents);

  const hasNextPage = Boolean(eventStore.getLastCursor)

  const handleToggleLive = () => {
    setIsLive(!isLive)
    if (isLive) {
      setSearchText(null)
    }
  }

  const handleSearchText = useMemo(() => debounce((event) => {
    setSearchText(event.target.value)
    eventStore.setLastCursor(null)
  }, 300), [searchText])

  const handleExportList = () => {
    if (exportEventsIsLoading) {
      return
    }

    getExportableData()
  }

  useEffect(() => {
    if (preFetchedData) {
      eventStore.setEventsList(preFetchedData.data)
      eventStore.setLastCursor(preFetchedData?.metadata?.lastCursor)
      preFetchedData = undefined
      return
    }

    getAllEvents()
  }, [searchText, loadMore])

  useEffect(() => {
    if (!eventsList?.data) {
      return
    }

    if (eventsList.data.length === 0) {
      // settings search results
      eventStore.setEventsList(eventsList?.data)
    } else {
      eventStore.updateEventsList(eventsList?.data)
      eventStore.setLastCursor(eventsList.metadata.lastCursor)
    }
  }, [eventsList])

  useEffect(() => {
    if (!exportedEventsFile) {
      return
    }

    downloadFile(new Blob([exportedEventsFile]), `logs_${dayjs().format()}.csv`)

  }, [exportedEventsFile])

  useEffect(() => {
    return () => {
      handleSearchText.cancel()
    }
  }, [])

  useEffect(() => {
    if (!isLive) return
    const controller = new AbortController();
    try {
      fetchEventSource(`${import.meta.env.VITE_API_URL}events/live/`, {
        onopen(res) {
          if (res.ok && res.status === 200) {
            console.log("Connection made ", res);
          } else if (
            res.status >= 400 &&
            res.status < 500 &&
            res.status !== 429
          ) {
            console.log("Client side error ", res);
          }
        },
        onmessage({ data: payload }) {
          if (!payload) {
            return;
          }
          const newEvent: Event = JSON.parse(payload);
          // console.log(newEvent)
          eventStore.addNewEvent(camelizeKeys(newEvent));
        },
        onclose() {
          console.log("Connection closed by the server");
        },
        onerror(err) {
          console.log("There was an error from server", err);
        },
        headers: {
          Accept: "text/event-stream",
        },
        signal: controller.signal
      });
    } catch (error) {
      console.log(error);
    }
    return () => {
      controller.abort()
    }
  }, [isLive]);

  useEffect(() => {
    // should report events list fetching error here
  }, [getAllEventsError])

  useEffect(() => {
    // should report all events exporting error here
  }, [exportingEventsError])

  return (<div className="flex flex-col w-full h-full">
    <div className="p-8 md:p-16 md:py-8 md:mt-8 flex flex-col items-center space-y justify-items-start justify-start h-fit" >

      <div className="w-full rounded-tl-2xl rounded-tr-2xl bg-neutral-100 border-neutral-300 border-x border-t items-center flex flex-col p-4 pb-0">

        <div className="flex w-full items-center justify-between p-2 rounded-lg border border-neutral-300 md:divide-x-2 md:divide-neutral-300">

          <input
            type="text"
            disabled={isLive}
            name="search"
            onChange={handleSearchText}
            placeholder={isLive ? "Search is not available during live mode" : "Search name, email or action..."}
            className="bg-transparent focus:border-teal-500 focus:outline-none text-sm text-neutral-600 w-full"
          />

          <div className="sm:hidden bg-neutral-100 flex justify-items-end divide-x-2 divide-neutral-300">
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
                : <IoDownload size="17" color="#414141" />}
              <p className="text-center text-neutral-500 text-xs font-normal mx-1">EXPORT</p>
            </button>
            <button className={"flex items-center p-1 px-2 hover:bg-neutral-200"} onClick={handleToggleLive}>
              <CgMediaLive size="17" color={isLive ? "#d60b0b" : "#414141"} />
              <p className={"text-center text-neutral-500 text-xs font-normal mx-1 " + (isLive ? "text-red-700 font-semibold" : "")}>LIVE</p>
            </button>
          </div>

        </div>

        <div className="md:hidden w-full bg-neutral-100 flex justify-items-center justify-center divide-x-2 divide-neutral-300 mb-1 mt-3">
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
              : <IoDownload size="17" color="#414141" />}
            <p className="text-center text-neutral-500 text-sm font-normal mx-1 mt-1">EXPORT</p>
          </button>
          <button className=" flex items-center p-1 px-2" onClick={handleToggleLive}>
            <CgMediaLive size="19" color={isLive ? "#d60b0b" : "#414141"} />
            <p className="text-center text-neutral-500 text-sm font-normal mx-1">LIVE</p>
          </button>
        </div>

        <div className="md:hidden grid grid-cols-1 w-full justify-items-center justify-between text-sm font-semibold pt-1 text-neutral-700 pb-1">
          <p>EVENTS LOG</p>
        </div>

        <div className="sm:hidden grid grid-cols-3 w-full justify-items-center justify-between text-sm mt-2 font-semibold p-2 pb-2 text-neutral-700">
          <p className=" w-full ">ACTOR</p>
          <p className=" w-full ">ACTION</p>
          <p className=" w-full ">DATE</p>
        </div>

      </div>

      <div className="sm:hidden flex w-full divide-y divide-neutral-300 border-neutral-300 border-x">

        <div className='flex-auto py-2' >
          <AnimatePresence>
            {(eventStore.eventsList?.length === 0 && !isLoadingEvents) ? (
              <div
                className="h-96 self-end w-full flex items-center justify-center text-center text-neutral-900">
                NO EVENTS LOG AVAILABLE
              </div>
            ) : (
              <Virtuoso
                style={{ height: '100Vh', display: 'flex' }}
                totalCount={eventStore.eventsList?.length}
                data={eventStore.eventsList}
                useWindowScroll
                computeItemKey={(_, item) => item.id}
                itemContent={(_, item) => {
                  return <ListItem
                    eventData={item}
                    handleEventChange={(targetEvent: Event) => setActiveEvent(targetEvent)}
                  />
                }
                }
              />
            )}
            {(isLoadingEvents && eventStore.eventsList.length && hasNextPage) && (
              <motion.div initial="initial"
                animate="animate"
                exit="exit"
                variants={{
                  initial: { opacity: 0, y: -10 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -10 },
                }}
                className={'px-5 py-1'}>
                <Skeleton height={28} />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>


      <button disabled={!hasNextPage} onClick={() => setLoadMore({})}
        className="font-semibold bg-neutral-200 text-sm border-neutral-300 w-full p-3 rounded-bl-3xl rounded-br-3xl border-x border-b text-center text-neutral-600
      ">
        {isLoadingEvents ? "Loading..." : hasNextPage ? 'LOAD MORE' : 'No More Events'}
      </button>
    </div >

    {activeEvent && (
      <EventDetails
        activeEvent={activeEvent}
        handleEventChange={() => setActiveEvent(null)}
      />
    )}
  </div >
  )
})

export default EventList