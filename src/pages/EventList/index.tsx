import { useState, useEffect, useMemo } from 'react'
import { motion } from "framer-motion"
import useSWRMutation from 'swr/mutation'
import { observer } from "mobx-react-lite";
import { fetchEventSource } from "@microsoft/fetch-event-source";

import { CgMediaLive } from 'react-icons/cg'
import { IoDownload } from 'react-icons/io5'
import { BiFilter } from 'react-icons/bi'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { Virtuoso } from 'react-virtuoso'

import { Event } from '../../domain-models'
import { requestFetchAllEvents, requestExportEvents } from '../../network';
import ListItem from './ListItemWeb';
import EventDetails from './EventDetails'

import debounce from 'lodash.debounce'
import downloadFile from '../../utils/downloadFile';
import dayjs from 'dayjs';
import useSWR, { preload } from 'swr'

const INITIAL_EVENTS_PAGE = 0;

let preFetchedData = await preload({ page: INITIAL_EVENTS_PAGE, }, requestFetchAllEvents)

const EventList = () => {
  const [tickerStore] = useState(() => new TickersDataStore());

  const [isLive, setIsLive] = useState(false)
  const [activeEvent, setActiveEvent] = useState(null)
  const [eventCardVisible, setEventCardVisible] = useState(false)

  const [page, setPage] = useState(INITIAL_EVENTS_PAGE)
  const [searchText, setSearchText] = useState(null)

  const { data, isLoading: isLoadingEvents, error, mutate: getAllEvents } = useSWR({ page, searchText }, requestFetchAllEvents, {
    refreshInterval: 0,
    revalidateOnMount: false,
    revalidateOnFocus: false,
    fallbackData: preFetchedData
  });
  const { data: exportedEventsFile, trigger: getExportableData, isMutating: exportEventsIsLoading, error: exportedEventsError } =
    useSWRMutation({ searchText }, requestExportEvents);

  const handleToggleLive = () => {
    setIsLive(!isLive)
    if (isLive) {
      setPage(0)
      setSearchText(null)
    }
  }

  const handleActiveEventChange = (event: Event) => {
    setActiveEvent(event);
    setEventCardVisible(true)
  }
  const handleActiveEventDelete = (event: Event) => {
    setActiveEvent(event);
    setEventCardVisible(false)
  }

  const handleSearchText = useMemo(() => debounce((event) => {
    setSearchText(event.target.value)
  }, 300), [searchText])

  const handleExportList = () => {
    if (exportEventsIsLoading) {
      return
    }

    getExportableData()
  }

  useEffect(() => {
    if (preFetchedData) {
      preFetchedData = undefined
      return
    }
    getAllEvents()
  }, [page, searchText])

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
    try {
      fetchEventSource(`${INSTRUMENTS_API_URL}instruments-sse/general/forex`, {
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
          const newTickerData: TickerData = JSON.parse(payload);
          tickerStore.addNewTicker(newTickerData);
        },
        onclose() {
          console.log("Connection closed by the server");
        },
        onerror(err) {
          console.log("There was an error from server", err);
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "text/event-stream",
        },
      });
    } catch (error) {
      console.log(error);
    }
  }, []);


  return (<div className="flex flex-col w-full h-full">
    <div className="p-8 md:p-16 md:py-8 md:mt-8 flex flex-col items-center space-y justify-items-start justify-start h-fit" >

      <div className="w-full rounded-tl-2xl rounded-tr-2xl bg-neutral-100 border-neutral-300 border-x border-t items-center flex flex-col p-3 pb-0">

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

        <div className="sm:hidden grid grid-cols-3 w-full justify-items-center justify-between text-sm mt-2 font-semibold pt-1 text-neutral-700 pb-1">
          <p className=" w-full ">ACTOR</p>
          <p className=" w-full ">ACTION</p>
          <p className=" w-full ">DATE</p>
        </div>

      </div>

      <div className="sm:hidden flex w-full divide-y divide-neutral-300 border-neutral-300 border-x">
        {isLoadingEvents ? (
          <p>Loading....</p>
        ) : (
          <div className='flex-auto py-2'>
            <Virtuoso
              style={{ height: '100Vh' }}
              totalCount={data?.length}
              data={data}
              useWindowScroll
              itemContent={(index, item) => (
                <ListItem
                  key={item.id}
                  actor={item.targetName}
                  action={`${item.action.name} ${index}`}
                  date={item.occurredAt}
                  handleEventChange={() => handleActiveEventChange(item)}
                />
              )}
            />
          </div>
        )}

      </div>

      <button disabled={true} onClick={() => setPage(page + 1)}
        className="font-semibold bg-neutral-200 text-sm border-neutral-300 w-full p-3 rounded-bl-3xl rounded-br-3xl border-x border-b text-center text-neutral-600
      ">No More Events
        {/* {hasMore ? 'LOAD MORE' : 'No More Events'} */}
      </button>

      {(data?.length === 0 && !isLoadingEvents) && (
        <div
          className="h-96 bg-neutral-200  self-end w-full flex items-center justify-center rounded-bl-3xl rounded-br-3xl border-x border-b text-center text-neutral-900">
          NO EVENTS LOG AVAILABLE
        </div>
      )}
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

export default observer(EventList)